import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Package, LogOut, Plus, Pencil, Trash2, Image, KeyRound, BarChart3, Globe } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: settings } = useSiteSettings();

  // Visitor stats
  const { data: stats } = useQuery({
    queryKey: ["visitor-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  // Site settings state
  const [siteName, setSiteName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [siteType, setSiteType] = useState("both");
  const [heroProductId, setHeroProductId] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Product dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pCategoryId, setPCategoryId] = useState("");
  const [pTier, setPTier] = useState("mid");
  const [pAvailable, setPAvailable] = useState(true);
  const [pSpecs, setPSpecs] = useState("");
  const [pImageFile, setPImageFile] = useState<File | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.site_name || "");
      setPhone(settings.phone || "");
      setWhatsapp(settings.whatsapp || "");
      setAddress(settings.address || "");
      setFacebookUrl(settings.facebook_url || "");
      setLocationUrl((settings as any).location_url || "");
      setGoogleDriveUrl((settings as any).google_drive_url || "");
      setSiteType((settings as any).site_type || "both");
      setHeroProductId((settings as any).hero_product_id || "");
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    let logoUrl = settings.logo_url;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `logo/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, logoFile, { upsert: true });
      if (uploadError) {
        toast({ title: "خطأ في رفع اللوجو", description: uploadError.message, variant: "destructive" });
        setSavingSettings(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: siteName,
        phone,
        whatsapp,
        address,
        facebook_url: facebookUrl,
        logo_url: logoUrl,
        location_url: locationUrl,
        google_drive_url: googleDriveUrl,
        site_type: siteType,
        hero_product_id: heroProductId || null,
      } as any)
      .eq("id", settings.id);

    setSavingSettings(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الحفظ بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setPName(""); setPDescription(""); setPPrice(""); setPOriginalPrice("");
    setPCategoryId(""); setPTier("mid"); setPAvailable(true); setPSpecs(""); setPImageFile(null);
    setDialogOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPDescription(product.description || "");
    setPPrice(String(product.price));
    setPOriginalPrice(product.original_price ? String(product.original_price) : "");
    setPCategoryId(product.category_id || "");
    setPTier((product as any).tier || "mid");
    setPAvailable(product.is_available);
    setPSpecs(product.specs ? JSON.stringify(product.specs, null, 2) : "");
    setPImageFile(null);
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!pName || !pPrice) {
      toast({ title: "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setSavingProduct(true);
    let imageUrl = editingProduct?.image_url || null;

    if (pImageFile) {
      const ext = pImageFile.name.split(".").pop();
      const path = `products/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, pImageFile);
      if (uploadError) {
        toast({ title: "خطأ في رفع الصورة", description: uploadError.message, variant: "destructive" });
        setSavingProduct(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    let specs = {};
    if (pSpecs.trim()) {
      try { specs = JSON.parse(pSpecs); } catch {
        toast({ title: "المواصفات يجب أن تكون JSON صحيح", variant: "destructive" });
        setSavingProduct(false);
        return;
      }
    }

    const productData: any = {
      name: pName,
      description: pDescription || null,
      price: Number(pPrice),
      original_price: pOriginalPrice ? Number(pOriginalPrice) : null,
      category_id: pCategoryId || null,
      tier: pTier,
      is_available: pAvailable,
      image_url: imageUrl,
      specs,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(productData).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert(productData));
    }

    setSavingProduct(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingProduct ? "تم التعديل بنجاح" : "تم الإضافة بنجاح" });
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الحذف بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);
    if (!error) queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const totalVisits = stats?.reduce((sum, s) => sum + (s as any).visits, 0) || 0;
  const todayVisits = stats?.find((s) => (s as any).date === new Date().toISOString().split("T")[0]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }

  const tierLabel = (t: string) => t === "economic" ? "اقتصادي" : t === "sport" ? "سبورت" : "متوسط";

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-xl font-black text-gradient">لوحة التحكم</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" dir="rtl">
          <TabsList className="mb-8 bg-secondary flex-wrap">
            <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="h-4 w-4" /> المنتجات
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" /> الإعدادات
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" /> الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <KeyRound className="h-4 w-4" /> الأمان
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
              <Button onClick={openAddProduct} className="gradient-primary text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> إضافة منتج
              </Button>
            </div>
            <div className="grid gap-4">
              {products?.map((product) => (
                <div key={product.id} className="gradient-card rounded-lg border border-border/50 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Image className="h-6 w-6 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.price.toLocaleString("ar-EG")} ج.م
                      {(product.categories as any)?.name && ` • ${(product.categories as any).name}`}
                      {` • ${tierLabel((product as any).tier || "mid")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{product.is_available ? "متوفر" : "غير متوفر"}</span>
                      <Switch checked={product.is_available} onCheckedChange={() => handleToggleAvailability(product as Product)} />
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => openEditProduct(product as Product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!products || products.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">لا توجد منتجات بعد. أضف أول منتج!</div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">إعدادات الموقع</h2>
            <div className="gradient-card rounded-lg border border-border/50 p-6 space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Site Type */}
                <div className="space-y-2 sm:col-span-2">
                  <Label>نوع الموقع</Label>
                  <Select value={siteType} onValueChange={setSiteType}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">بنزين + كهرباء (مشترك)</SelectItem>
                      <SelectItem value="gasoline">بنزين فقط</SelectItem>
                      <SelectItem value="electric">كهرباء فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>اسم الموقع</Label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>اللوجو</Label>
                  <div className="flex items-center gap-4">
                    {settings?.logo_url && <img src={settings.logo_url} alt="Logo" className="h-12 object-contain rounded" />}
                    <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
                  </div>
                </div>

                {/* Hero product */}
                <div className="space-y-2 sm:col-span-2">
                  <Label>المنتج الرئيسي (Hero)</Label>
                  <Select value={heroProductId} onValueChange={setHeroProductId}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="اختر المنتج الرئيسي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">بدون</SelectItem>
                      {products?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary border-border" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>واتساب</Label>
                  <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="bg-secondary border-border" dir="ltr" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>العنوان</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>رابط الموقع على الخريطة (Google Maps)</Label>
                  <Input value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} className="bg-secondary border-border" dir="ltr" placeholder="https://maps.google.com/..." />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>رابط فيسبوك</Label>
                  <Input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className="bg-secondary border-border" dir="ltr" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>رابط Google Drive (تحويل الزوار)</Label>
                  <Input value={googleDriveUrl} onChange={(e) => setGoogleDriveUrl(e.target.value)} className="bg-secondary border-border" dir="ltr" placeholder="https://drive.google.com/..." />
                  <p className="text-xs text-muted-foreground">لو حطيت رابط هنا، أي زائر هيتحول تلقائياً عليه</p>
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="gradient-primary text-primary-foreground font-bold" disabled={savingSettings}>
                {savingSettings ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </Button>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <h2 className="text-2xl font-bold">إحصائيات الزوار</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div className="gradient-card rounded-lg border border-border/50 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">زيارات اليوم</p>
                <p className="text-4xl font-black text-primary">{(todayVisits as any)?.visits || 0}</p>
              </div>
              <div className="gradient-card rounded-lg border border-border/50 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">إجمالي الزيارات (30 يوم)</p>
                <p className="text-4xl font-black text-primary">{totalVisits}</p>
              </div>
            </div>
            {stats && stats.length > 0 && (
              <div className="gradient-card rounded-lg border border-border/50 p-6 max-w-lg">
                <h3 className="font-bold mb-4">آخر الأيام</h3>
                <div className="space-y-2">
                  {stats.slice(0, 10).map((s: any) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{s.date}</span>
                      <span className="font-bold">{s.visits} زيارة</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <h2 className="text-2xl font-bold">الأمان</h2>
            <div className="gradient-card rounded-lg border border-border/50 p-6 space-y-6 max-w-md">
              <h3 className="font-bold text-lg">تغيير كلمة المرور</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-secondary border-border" placeholder="••••••••" minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>تأكيد كلمة المرور</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-secondary border-border" placeholder="••••••••" />
                </div>
                <Button
                  onClick={async () => {
                    if (newPassword !== confirmPassword) {
                      toast({ title: "كلمة المرور غير متطابقة", variant: "destructive" }); return;
                    }
                    if (newPassword.length < 6) {
                      toast({ title: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", variant: "destructive" }); return;
                    }
                    setChangingPassword(true);
                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    setChangingPassword(false);
                    if (error) {
                      toast({ title: "خطأ", description: error.message, variant: "destructive" });
                    } else {
                      toast({ title: "تم تغيير كلمة المرور بنجاح" });
                      setNewPassword(""); setConfirmPassword("");
                    }
                  }}
                  className="gradient-primary text-primary-foreground font-bold"
                  disabled={changingPassword}
                >
                  {changingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg gradient-card border-border/50 max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المنتج *</Label>
              <Input value={pName} onChange={(e) => setPName(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} className="bg-secondary border-border" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>السعر *</Label>
                <Input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>السعر الأصلي</Label>
                <Input type="number" value={pOriginalPrice} onChange={(e) => setPOriginalPrice(e.target.value)} className="bg-secondary border-border" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>القسم</Label>
                <Select value={pCategoryId} onValueChange={setPCategoryId}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select value={pTier} onValueChange={setPTier}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economic">اقتصادي / شعبي</SelectItem>
                    <SelectItem value="mid">فئة متوسطة</SelectItem>
                    <SelectItem value="sport">سبورت / عالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>صورة المنتج</Label>
              {editingProduct?.image_url && !pImageFile && (
                <img src={editingProduct.image_url} alt="" className="h-24 rounded-md object-cover mb-2" />
              )}
              <Input type="file" accept="image/*" onChange={(e) => setPImageFile(e.target.files?.[0] || null)} className="bg-secondary border-border" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={pAvailable} onCheckedChange={setPAvailable} />
              <Label>{pAvailable ? "متوفر" : "غير متوفر"}</Label>
            </div>
            <div className="space-y-2">
              <Label>المواصفات (JSON)</Label>
              <Textarea value={pSpecs} onChange={(e) => setPSpecs(e.target.value)} className="bg-secondary border-border font-mono text-sm" dir="ltr" rows={4} placeholder='{"المحرك": "200cc", "اللون": "أسود"}' />
            </div>
            <Button onClick={handleSaveProduct} className="w-full gradient-primary text-primary-foreground font-bold" disabled={savingProduct}>
              {savingProduct ? "جاري الحفظ..." : editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/site_settings?select=admin_email&limit=1`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              Accept: "application/vnd.pgrst.object+json",
            },
          }
        );
        if (res.ok) {
          const settings = await res.json();
          const email = settings?.admin_email;
          if (email) {
            setAdminEmail(email);
            setIsSetup(false);
          } else {
            // Check user_roles
            const rolesRes = await fetch(
              `${SUPABASE_URL}/rest/v1/user_roles?select=id&role=eq.admin&limit=1`,
              {
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${SUPABASE_KEY}`,
                },
              }
            );
            const roles = rolesRes.ok ? await rolesRes.json() : [];
            if (roles && roles.length > 0) {
              setAdminEmail(null);
              setIsSetup(false);
            } else {
              setIsSetup(true);
            }
          }
        }
      } catch {}
      setCheckingAdmin(false);
    };
    checkExistingAdmin();
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, navigate]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/setup-admin`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      const error = res.ok ? null : data;

      if (error || data?.error) {
        toast({
          title: "خطأ",
          description: data?.error || error?.message || "فشل في إنشاء الحساب",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Sign in with the default email
      const defaultEmail = "admin@olex-motors.local";
      const { error: signInError } = await signIn(defaultEmail, password);
      if (signInError) {
        toast({ title: "تم إنشاء الحساب", description: "سجل دخولك الآن" });
        setIsSetup(false);
        setAdminEmail(defaultEmail);
      }
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);

    // Try with stored admin email, or default
    const email = adminEmail || "admin@olex-motors.local";
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <span className="text-muted-foreground">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <div className="w-full max-w-sm gradient-card rounded-xl border border-border/50 p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
            {isSetup ? <UserPlus className="h-7 w-7 text-primary-foreground" /> : <Lock className="h-7 w-7 text-primary-foreground" />}
          </div>
          <h1 className="text-2xl font-black">
            {isSetup ? "إنشاء حساب الإدمين" : "لوحة التحكم"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSetup ? "أنشئ كلمة مرور للإدمين" : "أدخل كلمة المرور للدخول"}
          </p>
        </div>

        <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary border-border"
              placeholder="••••••••"
              minLength={6}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground font-bold"
            disabled={loading}
          >
            {loading ? "جاري المعالجة..." : isSetup ? "إنشاء الحساب" : "دخول"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

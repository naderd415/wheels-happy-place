import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsSetup(false);
    } else {
      setIsSetup(true);
    }
    setCheckingAdmin(false);
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, navigate]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("setup-admin", {
        body: { email, password },
      });

      if (error || data?.error) {
        toast({
          title: "خطأ",
          description: data?.error || error?.message || "فشل في إنشاء الحساب",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_email", email);
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        toast({ title: "تم إنشاء الحساب", description: "سجل دخولك الآن" });
      }
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginEmail = localStorage.getItem("admin_email") || email;
    const { error } = await signIn(loginEmail, password);
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
            {isSetup ? "أنشئ حساب الإدمين الأول" : "أدخل كلمة المرور للدخول"}
          </p>
        </div>

        <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-4">
          {isSetup && (
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border"
                dir="ltr"
                placeholder="admin@example.com"
              />
            </div>
          )}

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

        {!isSetup && (
          <button
            onClick={() => {
              localStorage.removeItem("admin_email");
              setIsSetup(true);
              setEmail("");
            }}
            className="text-xs text-muted-foreground hover:text-primary transition-colors w-full text-center"
          >
            إنشاء حساب إدمين جديد
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

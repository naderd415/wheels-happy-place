import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { Phone, MapPin, Facebook, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const { data: t } = useSiteTexts();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const phones = [
    settings?.phone,
    (settings as any)?.phone2,
    (settings as any)?.phone3,
  ].filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast({ title: "يرجى ملء الاسم والرسالة", variant: "destructive" });
      return;
    }
    setSending(true);
    // Send via WhatsApp
    const whatsappNumber = settings?.whatsapp || settings?.phone || "";
    if (whatsappNumber) {
      const text = encodeURIComponent(`الاسم: ${name}\nالهاتف: ${phone}\n\n${message}`);
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
    }
    setSending(false);
    toast({ title: "تم إرسال الرسالة بنجاح" });
    setName(""); setPhone(""); setMessage("");
  };

  const locationUrl = (settings as any)?.location_url;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="text-gradient">تواصل معنا</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  {t?.contact_description || "يسعدنا تواصلك معنا، اترك رسالتك وهنرد عليك في أقرب وقت"}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Contact Form */}
              <AnimateOnScroll>
                <form onSubmit={handleSubmit} className="gradient-card rounded-2xl border border-border/50 p-8 space-y-6">
                  <h2 className="text-xl font-bold">أرسل لنا رسالة</h2>
                  <div className="space-y-2">
                    <Label>الاسم *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" placeholder="اسمك الكامل" maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary border-border" dir="ltr" placeholder="01xxxxxxxxx" maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label>الرسالة *</Label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="bg-secondary border-border" rows={5} placeholder="اكتب رسالتك هنا..." maxLength={1000} />
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold gap-2 py-6 text-lg" disabled={sending}>
                    <Send className="h-5 w-5" /> {sending ? "جاري الإرسال..." : "إرسال عبر واتساب"}
                  </Button>
                </form>
              </AnimateOnScroll>

              {/* Contact Info + Map */}
              <AnimateOnScroll delay={150}>
                <div className="space-y-6">
                  <div className="gradient-card rounded-2xl border border-border/50 p-8 space-y-5">
                    <h2 className="text-xl font-bold">معلومات التواصل</h2>
                    <div className="space-y-4">
                      {phones.map((p, i) => (
                        <a key={i} href={`tel:${p}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                            <Phone className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span className="font-medium" dir="ltr">{p}</span>
                        </a>
                      ))}
                      {settings?.whatsapp && (
                        <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">واتساب</span>
                        </a>
                      )}
                      {settings?.address && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground">{settings.address}</span>
                        </div>
                      )}
                      {settings?.facebook_url && (
                        <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <Facebook className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">فيسبوك</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Map */}
                  {locationUrl && (
                    <div className="rounded-2xl overflow-hidden border border-border/50 h-64">
                      <iframe
                        src={locationUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="الموقع على الخريطة"
                      />
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

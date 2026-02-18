import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import defaultHeroImage from "@/assets/hero-motorcycle.jpg";
import AnimateOnScroll from "./AnimateOnScroll";
import { useSiteTexts } from "@/hooks/useSiteTexts";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const HeroSection = () => {
  const { data: t } = useSiteTexts();
  const { data: settings } = useSiteSettings();

  const heroImage = (settings as any)?.hero_image_url || defaultHeroImage;

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="موتوسيكل" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      </div>
      
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, transparent 1px, transparent 80px)",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mr-auto">
          <AnimateOnScroll>
            <span className="inline-block text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4 border border-primary/30 px-4 py-1.5 rounded-full">
              {t?.hero_badge || "أوليكس موتورز"}
            </span>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={150}>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
              {t?.hero_title_line1 || "أقوى"}{" "}
              <span className="text-gradient">{t?.hero_title_highlight || "الموتوسيكلات"}</span>
              <br />
              {t?.hero_title_line2 || "بأفضل الأسعار"}
            </h1>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={300}>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              {t?.hero_description || "موتوسيكلات، اسكوترات، وتروسيكلات لجميع الأغراض. أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع."}
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={450}>
            <div className="flex gap-4">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground font-bold text-lg px-10 py-6 rounded-xl shadow-[0_4px_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_6px_30px_hsl(var(--primary)/0.5)] transition-shadow duration-300">
                <Link to="/shop">{t?.hero_button || "تصفح المعرض"}</Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

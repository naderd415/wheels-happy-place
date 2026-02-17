import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-motorcycle.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="موتوسيكل" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mr-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            أقوى <span className="text-gradient">الموتوسيكلات</span>
            <br />
            بأفضل الأسعار
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            موتوسيكلات، اسكوترات، وتروسيكلات لجميع الأغراض. أحدث الموديلات بأسعار تنافسية مع خدمة ما بعد البيع.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground font-bold text-lg px-8">
              <Link to="/shop">تصفح المعرض</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { Truck, CreditCard, Wrench } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const features = [
  {
    icon: Truck,
    title: "توصيل لجميع المحافظات",
    description: "شحن سريع وآمن لجميع أنحاء الجمهورية",
  },
  {
    icon: CreditCard,
    title: "تقسيط مريح",
    description: "بدون مقدم وفائدة بسيطة",
  },
  {
    icon: Wrench,
    title: "صيانة شاملة",
    description: "قطع غيار أصلية وفنيين محترفين",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">لماذا تختارنا؟</h2>
            <div className="w-20 h-1 gradient-primary mx-auto rounded-full" />
          </div>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <AnimateOnScroll key={i} delay={i * 150}>
              <div className="text-center space-y-4 p-8 rounded-xl gradient-card border border-border/30 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 group">
                <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_4px_20px_hsl(var(--primary)/0.3)] group-hover:shadow-[0_6px_30px_hsl(var(--primary)/0.4)] transition-shadow duration-500">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

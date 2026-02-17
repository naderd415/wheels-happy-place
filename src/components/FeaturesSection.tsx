import { Truck, CreditCard, Wrench } from "lucide-react";

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
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="text-center space-y-3 p-6 rounded-lg gradient-card border border-border/30"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mx-auto w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

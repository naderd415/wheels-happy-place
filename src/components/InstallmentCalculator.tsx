import { useState } from "react";
import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface InstallmentCalculatorProps {
  price: number;
}

const InstallmentCalculator = ({ price }: InstallmentCalculatorProps) => {
  const [months, setMonths] = useState(12);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);

  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const remaining = price - downPayment;
  const monthlyPayment = Math.round(remaining / months);

  return (
    <div className="gradient-card rounded-xl border border-border/50 p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Calculator className="h-5 w-5" />
        <h3 className="font-bold text-lg">حاسبة التقسيط</h3>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">المقدم</span>
            <span className="font-bold">{downPaymentPercent}% — {downPayment.toLocaleString("ar-EG")} ج.م</span>
          </div>
          <Slider
            min={10}
            max={70}
            step={5}
            value={[downPaymentPercent]}
            onValueChange={(v) => setDownPaymentPercent(v[0])}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">عدد الأشهر</span>
            <span className="font-bold">{months} شهر</span>
          </div>
          <Slider
            min={3}
            max={36}
            step={3}
            value={[months]}
            onValueChange={(v) => setMonths(v[0])}
          />
        </div>
      </div>

      <div className="bg-primary/10 rounded-lg p-4 text-center space-y-1">
        <p className="text-sm text-muted-foreground">القسط الشهري</p>
        <p className="text-3xl font-black text-primary">
          {monthlyPayment.toLocaleString("ar-EG")} ج.م
        </p>
        <p className="text-xs text-muted-foreground">
          المقدم: {downPayment.toLocaleString("ar-EG")} ج.م + {months} قسط × {monthlyPayment.toLocaleString("ar-EG")} ج.م
        </p>
      </div>
    </div>
  );
};

export default InstallmentCalculator;

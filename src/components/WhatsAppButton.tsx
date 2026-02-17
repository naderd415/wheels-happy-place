import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();

  const whatsappNumber = settings?.whatsapp || settings?.phone;
  if (!whatsappNumber) return null;

  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن الموتوسيكلات")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      style={{ background: "#25D366" }}
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" style={{ color: "white" }} />
    </a>
  );
};

export default WhatsAppButton;

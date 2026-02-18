import { ReactNode } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useSiteSettings();
  const themeMode = (settings as any)?.theme_mode || "dark";
  const siteType = (settings as any)?.site_type || "both";
  const isElectric = siteType === "electric";

  return (
    <div className={`${themeMode === "light" ? "light-theme" : ""} ${isElectric ? "electric-theme" : ""}`}>
      {children}
      {isElectric && (
        <style>{`
          .electric-theme {
            --primary: 200 85% 55%;
            --primary-foreground: 0 0% 100%;
            --ring: 200 85% 55%;
            --accent: 180 100% 45%;
          }
          .electric-theme .text-gradient {
            background: linear-gradient(135deg, hsl(200, 85%, 55%) 0%, hsl(180, 100%, 55%) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .electric-theme .gradient-primary {
            background: linear-gradient(135deg, hsl(200, 85%, 55%) 0%, hsl(180, 90%, 45%) 100%);
          }
        `}</style>
      )}
    </div>
  );
};

export default ThemeProvider;

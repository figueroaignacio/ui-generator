"use client";

import { useSidebar } from "@/shared/store/use-sidebar";
import { useIsMobile } from "@/shared/hooks/use-mobile";

const recents = [
  "Mejorar componente de login con ...",
  "Rediseño de backend NestJS a Fa...",
  "Explicación de instrucciones conf...",
  "Presentación sobre CSS y diseño ...",
  "Marca de agua personalizada para...",
  "Aumentar tiempo de pantalla acti...",
  "Migración exitosa a Fedora Linux",
  "Grabar pantalla en Fedora Linux c...",
  "Mejores fuentes para Fedora Linux",
];

export function SidebarRecents() {
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  const openStyle = isOpen || isMobile;
  
  if (!openStyle) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 w-[266px]">
      <h3 className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground tracking-tight">
        Recents
      </h3>
      <div className="space-y-0.5 mt-1 overflow-y-auto flex-1 pb-4">
        {recents.map((item, i) => (
          <button
            key={i}
            title={item}
            className="w-full truncate text-left rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

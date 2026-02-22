import { Cpu } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";

/**
 * Navbar Component - "Boutique Experience"
 * Integración de Internacionalización (i18n)
 */
export default function Navbar() {
  return (
    <nav className="border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Lado Izquierdo: Branding */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-none tracking-tight text-slate-900">
              Carmona Studio
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Fintech Solutions
            </span>
          </div>
        </div>
        
        {/* Lado Derecho: Acciones y Configuración */}
        <div className="flex gap-4 items-center">
            {/* Selector de Idioma */}
            <LocaleSwitcher />
            
            <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden md:block" />
            
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              v1.0.0
            </span>
        </div>
      </div>
    </nav>
  );
}
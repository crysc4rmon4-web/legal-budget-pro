import { Cpu } from "lucide-react"; // Icono moderno

/**
 * Navbar Component - "Boutique Experience"
 * Argumento Senior: Usamos sticky y backdrop-blur para dar sensación de App Nativa.
 */
export const Navbar = () => {
  return (
    <nav className="border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-none tracking-tight">Carmona Studio</span>
            <span className="text-[10px] text-slate-500 font-medium">Fintech Solutions</span>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
            {/* Aquí irán las acciones rápidas */}
            <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden md:block" />
            <span className="text-xs font-mono text-slate-400">v1.0.0</span>
        </div>
      </div>
    </nav>
  );
};
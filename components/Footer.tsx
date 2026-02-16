
export const Footer = () => {
  return (
    <footer className="mt-auto border-t bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Lado Izquierdo: Marca */}
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-slate-900 tracking-tight">
              © 2026 Carmona Studio
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sistemas de Facturación Blindados • Cumplimiento Veri*factu
            </p>
          </div>

          {/* Lado Derecho: Firma de Autor */}
          <div className="flex flex-col items-center md:items-end group">
            <span className="text-[9px] tracking-[0.3em] text-slate-400 uppercase font-bold mb-1">
              Desarrollado por
            </span>
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-4 bg-slate-200 group-hover:w-8 transition-all"></span>
              <span className="font-mono text-xs font-black text-black tracking-tighter uppercase italic">
                Crys C4rmon4 Studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
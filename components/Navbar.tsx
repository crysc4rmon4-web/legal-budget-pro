// components/Navbar.tsx
import { Cpu, LogOut, User } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Lado Izquierdo: Branding */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-black/20">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-none tracking-tight text-slate-900">
              Carmona Studio
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Fintech Solutions
            </span>
          </div>
        </div>
        
        {/* Lado Derecho: Acciones y Usuario */}
        <div className="flex gap-4 items-center">
            <LocaleSwitcher />
            
            <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden md:block" />

            {session?.user && (
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-slate-900">{session.user.name}</span>
                  <span className="text-[10px] text-slate-400">Pro Plan</span>
                </div>
                
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}

            <span className="hidden sm:block text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              v1.0.0
            </span>
        </div>
      </div>
    </nav>
  );
}
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Mail, Chrome } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-[2.5rem] border border-zinc-200 bg-white p-8 md:p-12 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg">
            <span className="text-xl font-black italic">C</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900">LegalBudget Pro</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">Fintech Solutions by Carmona Studio</p>
        </div>

        <div className="mt-8 space-y-3">
          {/* BOTONES SOCIALES */}
          <form action={async () => { "use server"; await signIn("github", { redirectTo: "/" }); }}>
            <Button className="w-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-3 h-12 rounded-2xl font-bold transition-all shadow-sm">
              <Github className="w-5 h-5" /> Continuar con GitHub
            </Button>
          </form>

          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
            <Button className="w-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-3 h-12 rounded-2xl font-bold transition-all shadow-sm">
              <Chrome className="w-5 h-5 text-red-500" /> Continuar con Google
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-zinc-400 font-bold tracking-widest">O accede con email</span></div>
          </div>

          {/* FORMULARIO EMAIL (Placeholder funcional) */}
          <div className="space-y-3">
            <Input type="email" placeholder="tu@email.com" className="h-12 rounded-2xl border-zinc-200 focus:ring-zinc-900" />
            <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 rounded-2xl font-bold shadow-md">
              Iniciar Sesión
            </Button>
          </div>
          
          <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-6">
            Infraestructura de Datos SHA-256 Detectada
          </p>
        </div>
      </div>
    </div>
  );
}
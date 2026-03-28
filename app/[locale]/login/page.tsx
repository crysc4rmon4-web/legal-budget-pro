import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            LegalBudget Pro
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Accede para gestionar tus presupuestos legales
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <Button 
              className="w-full bg-black text-white hover:bg-zinc-800 flex items-center justify-center gap-3 h-12 text-base font-bold transition-all"
            >
              <Github className="w-5 h-5" />
              Continuar con GitHub
            </Button>
          </form>
          
          <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            Entorno de Desarrollo Seguro
          </p>
        </div>
      </div>
    </div>
  );
}
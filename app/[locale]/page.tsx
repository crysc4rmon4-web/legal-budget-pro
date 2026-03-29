import { getMyClients } from "@/app/actions/clients"; // Corregido a plural y función correcta
import { getTranslations } from "next-intl/server";
import { BarChart3, Users, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing"; 
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  
  // 1. Seguridad de sesión
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Verificación de Empresa (Onboarding Check)
  const company = await prisma.company.findUnique({
    where: { userId: session.user.id }
  });

  if (!company) {
    redirect("/onboarding");
  }

  // 3. Carga de datos en paralelo
  const t = await getTranslations('Dashboard');
  const clients = await getMyClients(); // Solo trae los clientes de este usuario
  const totalClients = clients.length;

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Dinámico */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
            {t('title')}
          </h1>
          <p className="text-zinc-500 font-medium mt-1">{t('subtitle')}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
              {company.name} — {company.sector}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/presupuestos/nuevo">
            <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50 w-full sm:w-auto shadow-sm">
              <FileText className="w-4 h-4 mr-2 text-zinc-500" />
              {t('createBtn')}
            </Button>
          </Link>
          <Link href="/clientes">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 w-full sm:w-auto shadow-md">
              <Users className="w-4 h-4 mr-2" />
              {t('manageBtn')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid de métricas con diseño escalable */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Card: Ingresos */}
        <div className="group p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-emerald-50 transition-colors">
              <TrendingUp className="w-5 h-5 text-zinc-600 group-hover:text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center border border-emerald-100">
              {t('revenue')} <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Facturación Total</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">0,00€</p>
        </div>

        {/* Card: IVA (Inteligencia Fiscal) */}
        <div className="group p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{t('vat')}</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">0,00€</p>
          <p className="text-[10px] text-zinc-400 mt-2 font-medium italic">Estimación Veri*factu</p>
        </div>

        {/* Card: Clientes */}
        <div className="group p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-zinc-200 transition-colors">
              <Users className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{t('clients')}</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{totalClients}</p>
          <p className="text-xs text-zinc-500 mt-2 font-medium">{t('clientsDesc')}</p>
        </div>
      </div>

      {/* Secciones de Acción Rápida */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 bg-zinc-900 rounded-[2rem] text-white flex flex-col justify-between min-h-[250px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <FileText className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">{t('scaleTitle')}</h3>
            <p className="text-zinc-400 text-sm mb-8 max-w-xs">{t('scaleDesc')}</p>
          </div>
          <Button variant="secondary" className="w-fit font-bold bg-white text-black hover:bg-zinc-200 transition-colors relative z-10">
            <FileText className="w-4 h-4 mr-2" /> {t('emitBtn')}
          </Button>
        </div>
        
        <div className="p-8 bg-zinc-50 border border-zinc-200 border-dashed rounded-[2rem] flex flex-col justify-center items-center text-center min-h-[250px] hover:bg-white transition-all group">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            </div>
            <h3 className="font-bold text-xl text-zinc-900 mb-2">{t('newClientTitle')}</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-xs">{t('newClientDesc')}</p>
            <Link href="/clientes">
              <span className="text-sm font-bold text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-black transition-all">
                {t('goToCrm')}
              </span>
            </Link>
        </div>
      </div>
    </div>
  );
}
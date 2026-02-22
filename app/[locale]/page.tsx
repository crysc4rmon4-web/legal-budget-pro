import { getClients } from "@/app/actions/client";
import { getTranslations } from "next-intl/server";
import { BarChart3, Users, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing"; // Usamos el Link de next-intl
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const t = await getTranslations('Dashboard');
  const clients = await getClients();
  const totalClients = clients.length;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">{t('title')}</h1>
          <p className="text-zinc-500 font-medium">{t('subtitle')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/presupuestos/nuevo">
            <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50 w-full sm:w-auto">
              {t('createBtn')}
            </Button>
          </Link>
          <Link href="/clientes">
            <Button className="bg-black text-white hover:bg-zinc-800 w-full sm:w-auto">
              {t('manageBtn')}
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid de métricas */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-zinc-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
              +0% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{t('revenue')}</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">0,00€</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{t('vat')}</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">0,00€</p>
          <p className="text-[10px] text-zinc-400 mt-2 font-medium italic">{t('vatDesc')}</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <Users className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{t('clients')}</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{totalClients}</p>
          <p className="text-xs text-zinc-500 mt-2">{t('clientsDesc')}</p>
        </div>
      </div>

      {/* Próximos Pasos */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 bg-zinc-900 rounded-3xl text-white flex flex-col justify-between min-h-[200px]">
          <div>
            <h3 className="text-xl font-bold mb-2">{t('scaleTitle')}</h3>
            <p className="text-zinc-400 text-sm mb-6">{t('scaleDesc')}</p>
          </div>
          <Button variant="secondary" className="w-fit font-bold">
            <FileText className="w-4 h-4 mr-2" /> {t('emitBtn')}
          </Button>
        </div>
        
        <div className="p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col justify-center items-center text-center min-h-[200px]">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="font-bold text-zinc-900">{t('newClientTitle')}</h3>
            <p className="text-zinc-500 text-sm mb-4">{t('newClientDesc')}</p>
            <Link href="/clientes">
              <span className="text-sm font-bold underline decoration-zinc-300 hover:decoration-black transition-all">{t('goToCrm')}</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
import { getClients } from "@/app/actions/client";
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  // En el futuro, aquí pediremos métricas reales de la DB
  const clients = await getClients();
  const totalClients = clients.length;

  return (
    <div className="space-y-8">
      {/* Header con Estrategia de Retención */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Panel de Control</h1>
          <p className="text-zinc-500 font-medium">Carmona Studio: Rendimiento y cumplimiento legal.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/presupuestos/nuevo">
            <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50">
              Crear Presupuesto
            </Button>
          </Link>
          <Link href="/clientes">
            <Button className="bg-black text-white hover:bg-zinc-800">
              Gestionar Clientes
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid de métricas de Alto Impacto */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card: Facturación */}
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-zinc-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
              +0% <ArrowUpRight className="w-3 h-3 ml-1" />
            </span>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Facturación Bruta</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">0,00€</p>
        </div>

        {/* Card: IVA (Crítico para el autónomo español) */}
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">IVA Acumulado</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">0,00€</p>
          <p className="text-[10px] text-zinc-400 mt-2 font-medium italic">Pendiente de liquidación trimestral</p>
        </div>

        {/* Card: Clientes (Tu CRM) */}
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <Users className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Cartera de Clientes</p>
          <p className="text-3xl font-bold text-zinc-900 mt-1">{totalClients}</p>
          <p className="text-xs text-zinc-500 mt-2">Activos en plataforma</p>
        </div>
      </div>

      {/* Sección de "Próximos Pasos" (Marketing Interno) */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 bg-zinc-900 rounded-3xl text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Escala tu Agencia</h3>
            <p className="text-zinc-400 text-sm mb-6">Empieza creando tu primer presupuesto legal con trazabilidad SHA-256.</p>
          </div>
          <Button variant="secondary" className="w-fit font-bold">
            <FileText className="w-4 h-4 mr-2" /> Emitir Documento
          </Button>
        </div>
        
        <div className="p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="font-bold text-zinc-900">¿Nuevo cliente?</h3>
            <p className="text-zinc-500 text-sm mb-4">Regístralo en segundos para automatizar sus datos fiscales.</p>
            <Link href="/clientes">
              <span className="text-sm font-bold underline decoration-zinc-300 hover:decoration-black transition-all">Ir al CRM de Clientes</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
import { getMyClients } from "@/app/actions/clients";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, CreditCard, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default async function ClientesPage() {
  const clients = await getMyClients();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* NAVEGACIÓN DE ALTA GAMA (BREADCRUMBS) */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <Link href="/" className="flex items-center gap-1 hover:text-zinc-900 transition-colors">
          <Home className="w-3 h-3" /> Inicio
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900">Gestión de Clientes</span>
      </nav>

      <header>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">Gestión de Clientes</h1>
        <p className="text-sm text-zinc-500">Tu cartera activa de clientes bajo normativa Veri*factu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* COLUMNA FORMULARIO */}
        <Card className="rounded-[2rem] shadow-sm border-zinc-200 h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Nuevo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <AddClientForm />
          </CardContent>
        </Card>

        {/* COLUMNA LISTADO - REFACTORIZADO PARA EVITAR OVERFLOW */}
        <Card className="lg:col-span-2 rounded-[2rem] shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Listado de Clientes</span>
              <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full text-zinc-500">{clients.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {clients.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                <p className="text-zinc-400 text-sm italic">No hay clientes registrados aún.</p>
              </div>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="p-4 border border-zinc-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-zinc-50 transition-all group">
                  <div className="min-w-0 w-full flex-1"> {/* min-w-0 es crítico para que truncate funcione */}
                    <p className="font-bold text-zinc-900 truncate">{client.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                      <span className="flex items-center gap-1 shrink-0"><CreditCard className="w-3 h-3"/> {client.nif}</span>
                      <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3"/> {client.email}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-tighter">Registrado</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
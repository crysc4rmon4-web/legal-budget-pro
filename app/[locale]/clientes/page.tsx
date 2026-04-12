import { getMyClients } from "@/app/actions/clients";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, CreditCard } from "lucide-react";

export default async function ClientesPage() {
  const clients = await getMyClients();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Gestión de Clientes</h1>
        <p className="text-zinc-500">Tu cartera activa de clientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="rounded-2xl shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle className="text-lg">Nuevo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <AddClientForm />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-zinc-200">
          <CardHeader>
            <CardTitle>Listado de Clientes ({clients.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clients.length === 0 ? (
              <p className="text-zinc-500 italic">No hay clientes registrados aún.</p>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="p-4 border border-zinc-100 rounded-xl flex justify-between items-center hover:bg-zinc-50 transition-colors">
                  <div>
                    <p className="font-bold text-zinc-900">{client.name}</p>
                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1"><CreditCard className="w-3 h-3"/> {client.nif}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {client.email}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    Registrado {new Date(client.createdAt).toLocaleDateString()}
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
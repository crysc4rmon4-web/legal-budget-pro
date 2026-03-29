import { getMyClients } from "@/app/actions/clients";
import { AddClientForm } from "@/components/clients/AddClientForm"; // Corregido el nombre
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react"; // Usamos Lucide para ser consistentes

export default async function ClientesPage() {
  const clients = await getMyClients();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Gestión de Clientes</h1>
          <p className="text-zinc-500">Administra tu cartera de clientes para facturación Veri*factu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-zinc-200 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Nuevo Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddClientForm />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-zinc-200 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle>Listado de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí irá la tabla de clientes que haremos luego */}
            <p className="text-sm text-zinc-500 italic">Los clientes registrados aparecerán aquí.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
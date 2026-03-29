import { getMyClients } from "@/app/actions/clients"; // Usando alias @/
import { AddClientForm } from "@/components/clients/AddClientForm"; // Usando alias @/
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function ClientesPage() {
  const clients = await getMyClients();

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <Users className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-blue-700 font-bold text-sm">{clients.length} Clientes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="shadow-lg border-zinc-200">
            <CardHeader className="bg-zinc-900 text-white rounded-t-lg">
              <CardTitle className="text-md">Añadir Nuevo</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AddClientForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-zinc-900">{client.name}</p>
                    <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-500">
                      {client.nif}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 truncate">{client.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
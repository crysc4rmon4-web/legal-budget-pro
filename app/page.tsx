export default function HomePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500">Bienvenido al control financiero de Carmona Studio.</p>
      </header>

      {/* Grid de métricas - Lo llenaremos en el siguiente paso */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Facturación Mes</p>
          <p className="text-2xl font-bold">€0,00</p>
        </div>
        <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-zinc-500">IVA a Liquidar</p>
          <p className="text-2xl font-bold text-blue-600">€0,00</p>
        </div>
        <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Presupuestos Activos</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
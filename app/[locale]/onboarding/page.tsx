import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CompanyForm from "@/components/company/CompanyForm";

export default async function OnboardingPage() {
  const session = await auth();
  
  // Seguridad: Si no hay sesión, al login (aunque el proxy ya debería pararlo)
  if (!session?.user) redirect("/login");

  // Verificamos si ya tiene empresa para no duplicar
  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });

  // Si ya tiene los datos fiscales, no hace falta onboarding, al dashboard
  if (company) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Configuración de Identidad Fiscal</h1>
          <p className="text-slate-600 mt-2">Completa estos datos para que tus presupuestos cumplan con la normativa vigente.</p>
        </div>
        
        <CompanyForm />
        
        <p className="text-center text-xs text-slate-400 mt-8">
          Tus datos se encriptan y almacenan siguiendo el protocolo de trazabilidad SHA-256.
        </p>
      </div>
    </div>
  );
}
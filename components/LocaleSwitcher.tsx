'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    // Lógica para cambiar el idioma en la URL actual
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 text-xs font-bold"
    >
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <span className="uppercase text-slate-700">{locale === 'es' ? 'English' : 'Español'}</span>
    </button>
  );
}
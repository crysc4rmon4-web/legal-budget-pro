/**
 * Carmona Studio - Finanzas y Cálculos Fiscales
 * Aquí vive la matemática que hace que la app valga dinero.
 */

export const calculateBudgetTotals = (lines: { quantity: number; unitPrice: number; taxRate: number }[]) => {
  return lines.reduce((acc, line) => {
    const base = line.quantity * line.unitPrice;
    const tax = base * (line.taxRate / 100);
    
    return {
      subtotal: acc.subtotal + base,
      totalTax: acc.totalTax + tax,
      total: acc.total + base + tax
    };
  }, { subtotal: 0, totalTax: 0, total: 0 });
};

// Función para formatear moneda (español/inglés)
export const formatCurrency = (amount: number, locale: string) => {
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
/**
 * Lógica de alta precisión financiera.
 * Todos los cálculos se realizan en céntimos para evitar errores de punto flotante.
 */

export const toCents = (amount: number): number => Math.round(amount * 100);
export const fromCents = (cents: number): number => cents / 100;

export const calculateBudgetTotals = (lines: { quantity: number; unitPriceInCents: number; taxRate: number }[]) => {
  return lines.reduce((acc, line) => {
    const base = Math.round(line.quantity * line.unitPriceInCents);
    const tax = Math.round(base * (line.taxRate / 100));
    
    return {
      subtotal: acc.subtotal + base,
      totalTax: acc.totalTax + tax,
      total: acc.total + base + tax
    };
  }, { subtotal: 0, totalTax: 0, total: 0 });
};

export const formatCurrency = (cents: number, locale: string = 'es-ES') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(fromCents(cents));
};
import { toCents, fromCents } from "./lib/utils/finance";

// Simulamos 1000 líneas de presupuesto de 0.10€
const lines = 1000;
const unitPrice = 0.10;

// En JS tradicional: 0.10 * 1000 a veces da 99.9999999998
const totalInJS = unitPrice * lines; 

// En nuestro sistema (Carmona Studio Standard):
const unitInCents = Number((unitPrice * 100).toFixed(0)); // 10 céntimos
const totalInCents = unitInCents * lines; // 10000 céntimos
const finalPrice = totalInCents / 100; // 100.00€

console.log(`JS Tradicional: ${totalInJS}€`);
console.log(`Sistema Pro: ${finalPrice}€`);
console.log(totalInJS === finalPrice ? "⚠️ JS tuvo suerte" : "✅ Sistema Pro evitó error de redondeo");
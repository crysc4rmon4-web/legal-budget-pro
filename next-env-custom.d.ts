// Declaración global para que TypeScript entienda las importaciones de CSS
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Específico para tu alias de ruta
declare module "@/app/globals.css" {
  const content: any;
  export default content;
}
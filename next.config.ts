import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aquí irán futuras configuraciones, por ahora vacío y limpio.
};

export default withNextIntl(nextConfig);
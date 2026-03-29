import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* En Next 15/16, si necesitas orígenes permitidos, se hace así: */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.app.github.dev",
        "*.github.dev"
      ]
    }
  }
};

export default withNextIntl(nextConfig);
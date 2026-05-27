import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Salida liviana lista para Docker / hosting standalone
  output: "standalone",
  // Quitar header X-Powered-By: Next.js (menos huella + un byte menos)
  poweredByHeader: false,
  // Comprimir respuestas (en producción se delega normalmente al reverse proxy,
  // pero no estorba si se sirve desde `next start`)
  compress: true,
  reactStrictMode: true,

  // Configuración de imágenes remotas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.magnific.com',
      },
      {
        protocol: 'https',
        hostname: 'skin-fusion.ca',
      },
    ],
  },

  experimental: {
    // Importa sólo los íconos usados de lucide-react (tree-shaking efectivo en Turbopack).
    // Agregar aquí cualquier otra librería pesada con barrel grande.
    optimizePackageImports: ["lucide-react"],
  },

  // Headers básicos de seguridad y caché para assets estáticos.
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const headers: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];

    if (isProd) {
      headers.push({
        // Los assets servidos bajo /_next/static son inmutables (hash en filename)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      });
    } else {
      // En dev: evitar cache agresivo del navegador en páginas HTML
      headers.push({
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      });
    }

    return headers;
  },
};

export default withBundleAnalyzer(nextConfig);

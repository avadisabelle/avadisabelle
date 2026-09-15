/** @type {import('next').NextConfig} */
// NOTE: this app is intentionally NOT a static export (`output: 'export'`).
// The ceremony-key gate relies on middleware + route handlers, which require
// the Next.js runtime on Vercel.
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

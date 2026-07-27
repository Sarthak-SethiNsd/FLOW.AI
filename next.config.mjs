/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Vercel's serverless bundler to include all public/asanas JSON files
  // in the server-rendered route bundles. Without this, fs.readdirSync /
  // fs.readFileSync on public/asanas/ works locally but fails on Vercel because
  // dynamic filesystem reads are not statically traceable by the bundler.
  outputFileTracingIncludes: {
    '/*': ['./public/asanas/**/*', './public/content/**/*'],
  },
};

export default nextConfig;

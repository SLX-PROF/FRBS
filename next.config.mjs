import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  // @react-pdf/renderer (fontkit/yoga) must not be bundled by webpack.
  serverExternalPackages: ['@react-pdf/renderer'],
  // Ensure the bundled Cyrillic fonts ship with the КП route in standalone.
  outputFileTracingIncludes: {
    '/api/deals/[id]/kp': ['./src/lib/pdf/fonts/**'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
    }
    return config
  },
}

export default withPayload(nextConfig)
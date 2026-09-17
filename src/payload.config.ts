import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Leads } from './collections/Leads'
import { Documents } from './collections/Documents'
import { Companies } from './collections/Companies'
import { Deals } from './collections/Deals'
import { Activities } from './collections/Activities'
import { AuditLog } from './collections/AuditLog'
import { KbChunks } from './collections/KbChunks'
import { ChatSessions } from './collections/ChatSessions'
import { withAudit } from './lib/audit'
import { CompanyProfile } from './globals/CompanyProfile'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— FORBSA',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
    },
  },
  routes: {
    admin: '/cp-7k2f9x',
  },
  collections: [
    Users,
    Media,
    Products,
    Documents,
    withAudit(Leads),
    withAudit(Companies),
    withAudit(Deals),
    withAudit(Activities),
    AuditLog,
    KbChunks,
    ChatSessions,
  ],
  globals: [CompanyProfile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: true,
  }),
  sharp,
  plugins: [],
})

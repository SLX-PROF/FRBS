import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { ru } from '@payloadcms/translations/languages/ru'

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
import { pageGlobals } from './globals/PageGlobals'
import { reindexProducts } from './lib/ai/kb'
import { isProductStaff } from './lib/access'

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
  i18n: {
    supportedLanguages: { ru },
    fallbackLanguage: 'ru',
  },
  routes: {
    admin: '/cp-7k2f9x',
  },
  endpoints: [
    {
      // Кнопка «Обновить базу знаний бота» в списке товаров.
      path: '/kb/reindex',
      method: 'post',
      handler: async (req) => {
        if (!isProductStaff(req.user as Parameters<typeof isProductStaff>[0])) {
          return Response.json({ error: 'Нет доступа' }, { status: 403 })
        }
        try {
          const count = await reindexProducts(req.payload as Parameters<typeof reindexProducts>[0])
          return Response.json({ ok: true, count })
        } catch (err) {
          req.payload.logger.error({ msg: 'kb reindex (button) failed', err })
          return Response.json({ error: 'Не удалось обновить базу знаний' }, { status: 500 })
        }
      },
    },
  ],
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
  globals: [...pageGlobals, CompanyProfile],
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

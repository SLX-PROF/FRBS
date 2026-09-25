import type { Field, GlobalConfig } from 'payload'
import { PAGES, type FieldDef, type PageSlug } from '../lib/pageContent'
import { isProductStaff, productStaffOnly } from '../lib/access'

const previewUrl = (path: string) => `/api/preview?path=${encodeURIComponent(path)}`

function toField(name: string, def: FieldDef): Field {
  const common = {
    name,
    label: def.label,
    defaultValue: def.default,
    admin: def.hint ? { description: def.hint } : undefined,
  }
  return def.multiline ? { ...common, type: 'textarea' } : { ...common, type: 'text' }
}

// По одному глобалу на страницу: вкладки без своих групп, поэтому в БД это плоские колонки.
export const pageGlobals: GlobalConfig[] = (Object.keys(PAGES) as PageSlug[]).map((slug) => {
  const page = PAGES[slug]
  const defs = page.fields as Record<string, FieldDef>
  return {
    slug,
    label: page.label,
    admin: {
      group: 'Содержимое сайта',
      description:
        'Сохраните как черновик и нажмите «Предпросмотр», чтобы увидеть страницу до публикации. На сайте изменения появятся после «Опубликовать». Пустое поле вернёт прежний текст.',
      hidden: ({ user }) => !isProductStaff(user as Parameters<typeof isProductStaff>[0]),
      livePreview: { url: previewUrl(page.path) },
      preview: () => previewUrl(page.path),
    },
    access: { read: () => true, update: productStaffOnly },
    versions: { max: 25, drafts: true },
    fields: [
      {
        type: 'tabs',
        tabs: page.sections.map((s) => ({
          label: s.label,
          fields: s.keys.map((k) => toField(k, defs[k])),
        })),
      },
    ],
  }
})

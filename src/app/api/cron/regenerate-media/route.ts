import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import type { Media } from '@/payload-types'

// Одноразовая (и безопасно повторяемая) генерация WebP-версий card/large для файлов,
// загруженных до появления imageSizes. Оригиналы не трогаются.
//   curl -X POST -H "x-cron-key: $CRON_SECRET" http://localhost:3000/api/cron/regenerate-media
export const dynamic = 'force-dynamic'

// Значения должны совпадать с imageSizes в src/collections/Media.ts.
const SIZES = [
  { name: 'card', width: 640, quality: 80 },
  { name: 'large', width: 1600, quality: 82 },
] as const

const SKIP_MIME = new Set(['image/svg+xml', 'image/gif'])

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  const provided = request.headers.get('x-cron-key') || ''
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const dir = payload.collections.media.config.upload.staticDir as string
    const { docs } = await payload.find({
      collection: 'media',
      limit: 1000,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })

    let converted = 0
    let skipped = 0
    const failed: { id: number; filename: string; error: string }[] = []

    for (const doc of docs) {
      const mime = doc.mimeType ?? ''
      if (!doc.filename || !mime.startsWith('image/') || SKIP_MIME.has(mime)) {
        skipped++
        continue
      }
      const missing = SIZES.filter((s) => !doc.sizes?.[s.name]?.filename)
      if (missing.length === 0) {
        skipped++
        continue
      }

      try {
        const input = await fs.readFile(path.join(dir, doc.filename))
        const meta = await sharp(input).metadata()
        const base = path.parse(doc.filename).name
        const sizes: NonNullable<Media['sizes']> = {}

        for (const s of missing) {
          // Как и при загрузке: снимок не шире целевой ширины не увеличиваем, фронтенд берёт оригинал.
          if (!meta.width || meta.width <= s.width) continue
          const outName = `${base}-${s.name}.webp`
          const out = await sharp(input)
            .rotate()
            .resize({ width: s.width })
            .webp({ quality: s.quality })
            .toBuffer({ resolveWithObject: true })
          await fs.writeFile(path.join(dir, outName), out.data)
          sizes[s.name] = {
            filename: outName,
            width: out.info.width,
            height: out.info.height,
            mimeType: 'image/webp',
            filesize: out.info.size,
          }
        }

        if (Object.keys(sizes).length === 0) {
          skipped++
          continue
        }
        await payload.update({ collection: 'media', id: doc.id, data: { sizes }, overrideAccess: true })
        converted++
      } catch (err) {
        failed.push({ id: doc.id, filename: doc.filename, error: err instanceof Error ? err.message : 'error' })
      }
    }

    return NextResponse.json({ ok: failed.length === 0, total: docs.length, converted, skipped, failed })
  } catch (err) {
    console.error('cron/regenerate-media failed:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

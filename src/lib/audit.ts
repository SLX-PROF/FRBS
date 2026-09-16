import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from 'payload'

// Пишем запись журнала в отдельном контексте (без общего req/транзакции):
// журнал аудита не должен ломать основную операцию, а «лишняя» запись при
// откате основной транзакции безопаснее, чем пропущенная.
async function record(
  payload: { create: (a: unknown) => Promise<unknown>; logger: { error: (o: unknown) => void } },
  entry: Record<string, unknown>,
) {
  try {
    await payload.create({
      collection: 'audit-log',
      data: { ...entry, at: new Date().toISOString() },
      overrideAccess: true,
      context: { disableAudit: true },
    })
  } catch (err) {
    payload.logger.error({ msg: 'audit write failed', err })
  }
}

const afterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  if (context?.disableAudit) return doc

  const changedFields: string[] = []
  if (operation === 'update' && previousDoc) {
    for (const key of Object.keys(doc)) {
      if (key === 'updatedAt') continue
      if (JSON.stringify(doc[key]) !== JSON.stringify((previousDoc as Record<string, unknown>)[key])) {
        changedFields.push(key)
      }
    }
  }

  await record(req.payload, {
    action: operation,
    collectionSlug: collection.slug,
    documentId: String(doc.id),
    user: req.user?.id ?? null,
    changedFields,
  })
  return doc
}

const afterDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await record(req.payload, {
    action: 'delete',
    collectionSlug: collection.slug,
    documentId: String(doc?.id),
    user: req.user?.id ?? null,
    changedFields: [],
  })
  return doc
}

/** Навешивает журналирование изменений на коллекцию. */
export function withAudit(config: CollectionConfig): CollectionConfig {
  return {
    ...config,
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(config.hooks?.afterDelete ?? []), afterDelete],
    },
  }
}

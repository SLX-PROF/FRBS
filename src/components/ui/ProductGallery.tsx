import ProductPhotoHover from './ProductPhotoHover'

type PhotoImage = { id?: number | string; url?: string | null; alt?: string | null }

export default function ProductGallery({
  images,
  title,
  variant = 0,
  badge,
}: {
  images: PhotoImage[]
  title: string
  variant?: 0 | 1 | 2
  badge?: string
}) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <ProductPhotoHover images={images} alt={title} variant={variant} />
        {badge && (
          <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {badge}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div
              key={img.id ?? img.url}
              className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-line bg-surface"
            >
              <img src={img.url!} alt={img.alt || title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

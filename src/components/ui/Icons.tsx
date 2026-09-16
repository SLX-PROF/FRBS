type IconProps = { className?: string }

const base = 'h-full w-full'

export function ArchitectIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 28 20 4l8 8-16 16H4v-8Z" />
      <path d="M16 8l8 8" />
      <path d="M9 23l-3 3" />
      <path d="M13 19l2 2" />
    </svg>
  )
}

export function DealerIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="10" r="4" />
      <circle cx="23" cy="10" r="4" />
      <path d="M2 27v-2a6 6 0 0 1 6-6h2a6 6 0 0 1 4 1.5" />
      <path d="M18 20.5A6 6 0 0 1 22 19h2a6 6 0 0 1 6 6v2" />
      <path d="M13 20l3 3 3-3" />
    </svg>
  )
}

export function InstallerIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 5a5.5 5.5 0 0 0-7.4 6.4L4 21l3 3 9.6-9.6A5.5 5.5 0 0 0 23 12l-4-1-1-4 3-2Z" />
    </svg>
  )
}

export function CheckIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function SteelIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="12" width="22" height="8" rx="1.5" />
      <circle cx="16" cy="16" r="2.4" />
      <path d="M9 12v8M23 12v8" />
    </svg>
  )
}

export function LevelIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22c4-9 8-13 12-13s8 4 12 13" />
      <path d="M4 22h24" />
      <path d="M16 9v3" />
    </svg>
  )
}

export function AdjustIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="6" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2M22.5 7.5l-2 2M9.5 22.5l-2 2" />
    </svg>
  )
}

export function NoPlasticIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l20 20" />
      <path d="M12 6h8l2 4H10l2-4Z" />
      <path d="M9 10h14v14a2 2 0 0 1-2 2h-6" />
    </svg>
  )
}

export function CycleIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 12a10 10 0 0 0-17-5.7L6 9" />
      <path d="M6 6v5h5" />
      <path d="M6 20a10 10 0 0 0 17 5.7L26 23" />
      <path d="M26 26v-5h-5" />
    </svg>
  )
}

export function ShieldIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l10 4v8c0 7-4.5 11-10 12-5.5-1-10-5-10-12V8l10-4Z" />
      <path d="M12 16l3 3 5-6" />
    </svg>
  )
}

export function FactoryIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 27V15l7 5v-5l7 5V9l7 5v13H4Z" />
      <path d="M11 21v6M19 21v6" />
      <path d="M25 9V5h3v4" />
    </svg>
  )
}

export function RulerIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="26" height="8" rx="1.5" transform="rotate(-8 16 16)" />
      <path d="M8.5 13.5l1 3M13 12.7l1 3M17.5 12l1 3M22 11.2l1 3" />
    </svg>
  )
}

export function BriefcaseIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="24" height="15" rx="2" />
      <path d="M11 11V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
      <path d="M4 17h24M14 17v2h4v-2" />
    </svg>
  )
}

export function MegaphoneIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8h4l8 6V6l-8 6H4Z" />
      <path d="M22 13a4 4 0 0 1 0 6M26 10a8 8 0 0 1 0 12" />
    </svg>
  )
}

export function GraduationIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12l14-6 14 6-14 6-14-6Z" />
      <path d="M9 15v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
      <path d="M28 12v8" />
    </svg>
  )
}

export function BoxIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l12-6 12 6-12 6-12-6Z" />
      <path d="M4 10v12l12 6 12-6V10" />
      <path d="M16 16v12" />
    </svg>
  )
}

export function WrenchIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 5a5.5 5.5 0 0 0-7.4 6.4L4 21l3 3 9.6-9.6A5.5 5.5 0 0 0 23 12l-4-1-1-4 3-2Z" />
    </svg>
  )
}

export function MapPinIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 29s10-8.6 10-16a10 10 0 0 0-20 0c0 7.4 10 16 10 16Z" />
      <circle cx="16" cy="13" r="3.5" />
    </svg>
  )
}

export function PercentIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="4" />
      <circle cx="22" cy="22" r="4" />
      <path d="M24 8 8 24" />
    </svg>
  )
}

export function BookIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8c-2.5-2-6-3-11-3v19c5 0 8.5 1 11 3 2.5-2 6-3 11-3V5c-5 0-8.5 1-11 3Z" />
      <path d="M16 8v19" />
    </svg>
  )
}

export function ScaleIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4v24M9 28h14" />
      <path d="M16 8 6 10l4 9a5 5 0 0 0 8 0Z" />
      <path d="M16 8l10 2-4 9a5 5 0 0 1-8 0Z" />
    </svg>
  )
}

export function SearchIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="9" />
      <path d="M27 27l-6.5-6.5" />
    </svg>
  )
}

export function PhoneIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h5l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v5a2 2 0 0 1-2 2C13.6 26 6 18.4 6 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function CertificateIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="24" height="17" rx="2" />
      <path d="M8 10h16M8 14h11" />
      <circle cx="16" cy="25" r="3.2" />
      <path d="M13.5 27.5L12 31l4-1.8 4 1.8-1.5-3.5" />
    </svg>
  )
}

export function MailIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="26" height="18" rx="2" />
      <path d="M4 9l12 9 12-9" />
    </svg>
  )
}

export function MessageIcon({ className = '' }: IconProps) {
  return (
    <svg className={className || base} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h24v16H12l-6 6v-6H4Z" />
    </svg>
  )
}

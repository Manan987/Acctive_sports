import Image from "next/image";

export default function Loading() {
  return (
    <div className="container-x grid min-h-[50vh] place-items-center py-20">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse */}
        <div className="relative">
          <Image
            src="https://res.cloudinary.com/rdhqircc/image/upload/v1787571541/WhatsApp_Image_2026-08-24_at_4.48.59_PM-removebg-preview_gabj92.png"
            alt="ACCTIVE Sports"
            width={120}
            height={40}
            className="h-10 w-auto object-contain opacity-60"
            priority
          />
          {/* Animated spinner ring around logo */}
          <span className="absolute -inset-3 rounded-full border-2 border-ink-200 border-t-flame-500 animate-spin dark:border-ink-700 dark:border-t-flame-500" />
        </div>

        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">
          Loading…
        </p>

        {/* Skeleton product grid preview */}
        <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="skeleton aspect-square w-full rounded-2xl bg-ink-100 dark:bg-ink-800" />
              <div className="skeleton h-3 w-3/4 bg-ink-100 dark:bg-ink-800" />
              <div className="skeleton h-3 w-1/2 bg-ink-100 dark:bg-ink-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container-x grid min-h-[50vh] place-items-center py-20">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-flame-500 dark:border-ink-700 dark:border-t-flame-500" />
        <p className="text-sm text-ink-500 dark:text-ink-400">Loading…</p>
      </div>
    </div>
  );
}

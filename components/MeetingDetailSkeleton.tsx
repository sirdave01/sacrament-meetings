export default function MeetingDetailSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading meeting details"
      className="mx-auto max-w-4xl px-4 py-12"
    >
      <article className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="h-2 bg-blue-600" />

        <div className="space-y-8 p-6">
          <header className="space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-blue-100" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {["Leadership", "Opening", "Announcements", "Ward Business", "Sacrament and Speakers", "Closing"].map((section) => (
              <section key={section} className="space-y-3 rounded-md border border-gray-100 p-4">
                <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
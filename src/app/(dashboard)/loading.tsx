export default function DashboardLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Sidebar skeleton */}
      <div className="hidden w-60 shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
        {/* Brand */}
        <div className="border-b border-ink-100 px-3 py-3">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="h-8 w-8 rounded-lg bg-ink-100 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-2 w-16 rounded bg-ink-100 animate-pulse" />
              <div className="h-3 w-24 rounded bg-ink-100 animate-pulse" />
            </div>
          </div>
        </div>
        {/* Nav items */}
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <div className="h-4 w-4 rounded bg-ink-100 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-ink-100 animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar skeleton */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-100 bg-white px-4 sm:px-6">
          <div className="h-4 w-32 rounded bg-ink-100 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-ink-100 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-ink-100 animate-pulse" />
          </div>
        </div>
        {/* Page content skeleton */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded-lg bg-ink-100 animate-pulse" />
            <div className="h-4 w-72 rounded bg-ink-100 animate-pulse" />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-ink-100 animate-pulse" />
              ))}
            </div>
            <div className="mt-2 h-64 rounded-xl bg-ink-100 animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  );
}

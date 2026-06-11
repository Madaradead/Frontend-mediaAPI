import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/20 md:flex min-h-screen">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Streaming Media
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1">
          <Link
            href="/"
            className="flex items-center rounded-lg px-3 py-2 text-foreground bg-muted transition-all hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/media"
            className="flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
          >
            Library
          </Link>
          <Link
            href="/media/upload"
            className="flex items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
          >
            Upload
          </Link>
          <Link
            href="/my-media"
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-md"
          >
            My Uploads
          </Link>
        </nav>
      </div>
    </aside>
  );
}

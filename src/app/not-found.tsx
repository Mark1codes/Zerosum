import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-slate-900 p-6 text-center">
      <h1 className="text-xl font-bold tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-slate-500 mt-1.5">
        The requested workspace route could not be located.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        Return to Workspace
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function TenderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Tender not found</h1>
      <p className="max-w-md text-sm text-slate-500">
        This tender ID is not in the catalogue. It may have been removed or the link is incorrect.
      </p>
      <Link href="/tenders" className="text-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700">
        Back to tenders
      </Link>
    </div>
  );
}

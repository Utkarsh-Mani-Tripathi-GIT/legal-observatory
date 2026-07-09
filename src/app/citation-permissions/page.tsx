import Link from 'next/link';

export const metadata = {
  title: 'Citation Permissions | National Legal Observatory',
  description: 'Citation permissions for the National Legal Observatory website.',
};

export default function CitationPermissionsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
        Citation Permissions
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Short excerpts may be quoted with attribution. For full reproduction requests, republication permissions, or classroom use, please contact the observatory.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Open the contact page</Link> to request permission.
      </p>
    </div>
  );
}

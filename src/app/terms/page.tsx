import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | National Legal Observatory',
  description: 'Terms of service for the National Legal Observatory website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        By using this website, you agree to read and share the observatory&apos;s publications responsibly and to respect attribution, copyright, and editorial standards.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        For permissions or questions, please <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">reach the editorial team</Link>.
      </p>
    </div>
  );
}

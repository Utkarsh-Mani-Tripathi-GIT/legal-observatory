import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | National Legal Observatory',
  description: 'Privacy policy for the National Legal Observatory website.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        The National Legal Observatory respects reader privacy and only collects the information needed to handle subscriptions, submissions, and editorial communication.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        If you have questions about how your information is used, please <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">contact the editors</Link>.
      </p>
    </div>
  );
}

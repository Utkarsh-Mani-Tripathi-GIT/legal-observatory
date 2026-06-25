import { Metadata } from 'next';
import BhoomijaCVClient from './BhoomijaCVClient';

export const metadata: Metadata = {
  title: 'Bhoomija Khanna | Founder & Research Director',
  description:
    'Academic portfolio, legal drafting credentials, and research projects of Bhoomija Khanna — Founder & Research Director, National Legal Observatory.',
};

export default function BhoomijaCVPage() {
  return <BhoomijaCVClient />;
}

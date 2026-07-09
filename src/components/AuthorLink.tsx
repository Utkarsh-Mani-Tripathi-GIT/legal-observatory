import Link from 'next/link';

type AuthorLinkProps = {
  slug?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
};

export function getAuthorHref(slug?: string) {
  if (slug === 'bhoomija-khanna' || slug === 'bhoomija') {
    return '/bhoomija';
  }

  if (slug === 'utkarsh-mani-tripathi') {
    return '/authors/utkarsh-mani-tripathi';
  }

  return slug ? `/authors/${slug}` : '/authors';
}

export default function AuthorLink({ slug, name, className, children }: AuthorLinkProps) {
  const href = getAuthorHref(slug);
  const content = children ?? name ?? 'Observatory Author';

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

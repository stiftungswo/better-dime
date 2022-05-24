import * as React from 'react';

interface Props {
  url: string;
  children: React.ReactNode;
}
// use UnstyledLink for relative frontend links,
// and use UnstyledBackendLink for links to the backend, e.g. for PDF generation.
export default function UnstyledBackendLink({url, children}: Props) {
  return (
    <a
      style={{ textDecoration: 'none', color: 'inherit' }}
      href={url}
      target={'_blank'}
    >
      {children}
    </a>
  );
}

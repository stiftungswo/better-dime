import { useTheme } from '@material-ui/core/styles';
import * as React from 'react';

interface Props {
  url: string;
  showUrl?: boolean;
  children: React.ReactNode;
}
// use UnstyledBackendLink for relative frontend links,
// and use UnstyledBackendLink for links to the backend, e.g. for PDF generation.
export default function UnstyledBackendLink({url, showUrl, children}: Props) {
  const theme = useTheme();
  return (
    <a
      style={{ textDecoration: 'none', color: theme.palette.text.primary }}
      href={url}
      target={showUrl ? undefined : '_blank'}
    >
      {children}
    </a>
  );
}

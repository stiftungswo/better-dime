import { useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export default function UnstyledLink(props: LinkProps) {
  const theme = useTheme();
  return (
    <Link
      style={{ textDecoration: 'none', color: theme.palette.text.primary }}
      {...props}
    />
  );
}

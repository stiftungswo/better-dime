import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export default function UnstyledLink(props: LinkProps) {
  return <Link style={{ textDecoration: 'none', color: 'inherit' }} {...props} />;
}

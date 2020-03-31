import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'clsx';

function NavLink({
  href,
  className,
  activeClassName,
  external,
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
}) {
  const router = useRouter();
  return external ? (
    <a href={href} target={target} rel={rel} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href}>
      <a className={cx(className, router.pathname === href && activeClassName)}>
        {children}
      </a>
    </Link>
  );
}

export default NavLink;

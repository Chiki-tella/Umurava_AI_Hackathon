'use client';

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '@/store/index-simple';

interface HelmetProviderProps {
  children?: React.ReactNode;
}

export function HelmetProvider({ children }: HelmetProviderProps) {
  const { pageTitle, pageDescription } = useAppSelector((state) => state.ui);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      {children}
    </>
  );
}

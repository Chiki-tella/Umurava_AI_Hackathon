'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/index-simple';
import { setPageTitleByRoute } from '@/store/slices/uiSlice-simple';

interface PageTitleProps {
  title?: string;
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  const dispatch = useAppDispatch();
  const { pageTitle, pageDescription } = useAppSelector((state) => state.ui);

  useEffect(() => {
    // Update document title directly (client-side only)
    if (typeof window !== 'undefined') {
      document.title = pageTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', pageDescription);
      
      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', pageTitle);
      
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', pageDescription);
    }
  }, [pageTitle, pageDescription]);

  // Override with props if provided
  useEffect(() => {
    if (title || description) {
      dispatch(setPageTitleByRoute(window.location.pathname));
    }
  }, [title, description, dispatch]);

  return null; // This component doesn't render anything
}

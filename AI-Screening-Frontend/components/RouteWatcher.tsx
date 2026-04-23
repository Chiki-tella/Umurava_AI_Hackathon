'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/index-simple';
import { setPageTitleByRoute } from '@/store/slices/uiSlice-simple';

export function RouteWatcher() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Update page title based on current route
    dispatch(setPageTitleByRoute(pathname));
  }, [pathname, dispatch]);

  return null; // This component doesn't render anything
}

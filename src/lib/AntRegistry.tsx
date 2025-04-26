'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
// Import the patch without using the function
import '@/lib/antd-patch';

export default function AntRegistry({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  
  useServerInsertedHTML(() => {
    // Avoid duplicate insertion
    if (isServerInserted.current) {
      return null;
    }
    isServerInserted.current = true;
    return (
      <style id="antd-registry" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
    );
  });
  
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
} 
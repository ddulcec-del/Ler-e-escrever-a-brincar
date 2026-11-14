'use client';

import dynamic from 'next/dynamic';

// The whole app reads its state from localStorage on first render, so it is
// rendered in the browser only (as it was before the move to Next.js).
// Pre-rendering it on the server would produce HTML that doesn't match.
const App = dynamic(() => import('../App'), { ssr: false });

export default function Page() {
  return <App />;
}

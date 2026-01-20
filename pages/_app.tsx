import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import '../src/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // global app loader visible on first mount (keeps terminal's own boot loader inside component)
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {loading && (
        <div style={{position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#000', zIndex: 9999}}>
          <div style={{textAlign: 'center', color: '#ffd36b', fontFamily: 'monospace'}}>
            <div style={{fontSize: 18, marginBottom: 12}}>Initializing wizli...</div>
            <div style={{width: 320, height: 12, background: '#081018', borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)'}}>
              <div style={{width: '60%', height: '100%', background: 'linear-gradient(90deg,#ffd36b,#ff8a00)'}} />
            </div>
          </div>
        </div>
      )}

      <Component {...pageProps} />
    </>
  )
}

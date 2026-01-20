import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoaderPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.push('/'), 1600)
    return () => clearTimeout(t)
  }, [router])

  return (
    <>
      <Head>
        <title>wizli — Initializing</title>
      </Head>
      <div className="app-loader" aria-hidden>
        <div className="app-loader-inner">
          <div>Initializing wizli...</div>
          <div className="app-loader-bar"><div className="app-loader-fill" /></div>
        </div>
      </div>
    </>
  )
}

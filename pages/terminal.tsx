import dynamic from 'next/dynamic'
import Head from 'next/head'

// Client-only Terminal
const Terminal = dynamic(() => import('../src/components/terminal/Terminal'), { ssr: false })

export default function TerminalPage() {
  return (
    <>
      <Head>
        <title>wizli — Terminal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Terminal />
    </>
  )
}

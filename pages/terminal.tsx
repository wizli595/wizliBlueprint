import dynamic from 'next/dynamic'
import Head from 'next/head'

const Terminal = dynamic(() => import('../src/components/terminal/Terminal'), { ssr: false })

export default function TerminalPage() {
  return (
    <>
      <Head>
        <title>wizli — Terminal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Terminal />
      {/* Fun message when screen is resized too small */}
      <div className="terminal-too-small">
        <pre>{`  _____
 / ____|
| (___  _ __ ___   __ _
 \\___ \\| '_ \` _ \\ / _\` |
 ____) | | | | | | (_| |
|_____/|_| |_| |_|\\__,_|
        _ _
       | | |
       | | |
       |_|_|`}</pre>
        <div className="tts-msg">Terminal too small!</div>
        <div className="tts-sub">
          Your viewport is below the minimum<br />
          resolution for this terminal session.
        </div>
        <div className="tts-cmd">
          <span>$</span> resize --width 320 --height 400
        </div>
      </div>
    </>
  )
}

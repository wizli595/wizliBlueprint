import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

const spring = { type: 'spring' as const, stiffness: 120, damping: 14 };

const ASCII = `
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═══██╗██║  ██║
 ███████║██║   ██║███████║
 ╚════██║██║   ██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝`;

export default function Custom404() {
  return (
    <>
      <Head>
        <title>wizli — 404</title>
      </Head>
      <div className="page-404">
        <motion.pre
          className="ascii-404"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
        >
          {ASCII}
        </motion.pre>
        <motion.div
          className="text-404"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.15 }}
        >
          <p className="msg-404">Page not found</p>
          <p className="sub-404">The path you requested does not exist on this system.</p>
          <div className="links-404">
            <Link href="/" className="link-404 link-primary">Home</Link>
            <Link href="/terminal" className="link-404">Terminal</Link>
            <Link href="/resume" className="link-404">Resume</Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

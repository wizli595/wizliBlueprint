import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import '../src/styles/global.css'
import '../src/styles/terminal.css'
import '../src/styles/home.css'
import '../src/styles/resume.css'
import '../src/styles/windows.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" as="style" />
        <meta name="description" content="Abdessalam Ouazri — Full Stack Engineer & Freelancer. Interactive portfolio with terminal, 3D canvas, and resume. Specializing in MERN, Laravel, DevOps." />
        <meta property="og:title" content="wizli — Abdessalam Ouazri" />
        <meta property="og:description" content="Full Stack Engineer portfolio — interactive terminal, 3D WebGL experience, and resume. MERN, Laravel, Docker, Kubernetes." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/Images/Banner.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="wizli — Abdessalam Ouazri" />
        <meta name="twitter:description" content="Full Stack Engineer portfolio with interactive terminal and 3D canvas experience." />
        <meta name="theme-color" content="#060609" />
      </Head>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  )
}

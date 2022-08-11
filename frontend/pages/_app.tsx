import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import TransactionToastProvider from '../providers/TransactionToastProvider'
import { Toaster } from 'react-hot-toast'
import StacksProvider from '../providers/StacksProvider'

import Head from 'next/head'
import dynamic from 'next/dynamic'
import Auth from '../components/Auth'
import Panel from '../components/Panel'

const Cesium = dynamic(() => import('../components/cesium/Cesium'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
      </Head>
      <StacksProvider>
        <TransactionToastProvider>
          <Toaster position="bottom-right" />
          <Cesium />
          { true ? <Panel /> : null }
        </TransactionToastProvider>
      </StacksProvider>
    </>
  )
}

export default MyApp

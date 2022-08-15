import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import TransactionToastProvider from '../providers/TransactionToastProvider'
import { Toaster } from 'react-hot-toast'
import StacksProvider from '../providers/StacksProvider'

import Head from 'next/head'
import dynamic from 'next/dynamic'
import MainPanel from '../components/MainPanel'
import SQueryPanel from '../components/SQueryPanel'
import { useState } from 'react'

const Cesium = dynamic(() => import('../components/cesium/Cesium'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {

  const [isVisibleSQueryPanel, setisVisibleSQueryPanel] = useState('none')


  return (
    <>
      <Head>
        <link rel="stylesheet" href="cesium/Widgets/widgets.css" />
      </Head>
      <StacksProvider>
        <TransactionToastProvider>
          <Toaster position="bottom-right" />
          <Cesium />
          <MainPanel changeSqueryVisibility={setisVisibleSQueryPanel}/>
          <SQueryPanel isVisible={isVisibleSQueryPanel} changeSqueryVisibility={setisVisibleSQueryPanel}/>
        </TransactionToastProvider>
      </StacksProvider>
    </>
  )
}

export default MyApp

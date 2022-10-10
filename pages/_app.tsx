import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {SWRConfig} from 'swr'
import fetcher from "../swr-fetcher";

function EarningsReportWeb({Component, pageProps}: AppProps) {
    return <SWRConfig value={{refreshInterval: 30000, fetcher: fetcher}}>
        <Component {...pageProps} />
    </SWRConfig>
}

export default EarningsReportWeb

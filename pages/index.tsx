import type {NextPage} from 'next'
import {useState} from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from 'moment';

// internationalization
import de from 'date-fns/locale/de'
import EarningsTable from "./components/earnings/EarningsTable";
import StockExchangesClosedBanner from "./components/banners/StockExchangesClosedBanner";
import useSWR from "swr";

registerLocale('de', de);

const Home: NextPage = () => {
    const [date, setDate] = useState(new Date())

    const dateFormat = 'dd.MM.yyyy'

    const [minimumPreviousClosing, setMinimumPreviousClosing] = useState(40.0)
    const {
        data: earningsData,
        error: earningsError
    } = useSWR(`/api/stocks/earnings/${moment(date).format('yyyy-MM-DD')}`);

    if (earningsError) {
        return <div className="container mx-auto h-screen">
            <StockExchangesClosedBanner/>
            <span>Datum:
                <DatePicker locale="de" selected={date} onChange={(date: Date) => setDate(date)}
                            dateFormat={dateFormat}/>
            </span>
            <span>Minimum Previous Closing Price:<br/>
                USD <input
                    className="px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    type="number" step="0.01"
                    value={minimumPreviousClosing}
                    onChange={event => setMinimumPreviousClosing(Number.parseFloat(event.target.value))}/>
            </span>
        </div>
    }
    if (!earningsData) {
        return <div className="container mx-auto h-screen">
            <StockExchangesClosedBanner/>
            <span>Datum (einfach klicken, dann erscheint eine Auswahl):
                <DatePicker locale="de" selected={date} onChange={(date: Date) => setDate(date)}
                            dateFormat={dateFormat}/>
            </span>
            <span>Minimum Schlusspreis:<br/>
                USD <input
                    className="px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    type="number" step="0.01"
                    value={minimumPreviousClosing}
                    onChange={event => setMinimumPreviousClosing(Number.parseFloat(event.target.value))}/>
            </span>
            <p>Loading...</p>
        </div>
    }
    return <div className="container mx-auto h-screen">
        <StockExchangesClosedBanner/>
        <span>Datum (einfach klicken, dann erscheint eine Auswahl):
                <DatePicker locale="de" selected={date} onChange={(date: Date) => setDate(date)}
                            dateFormat={dateFormat}/>
            </span>
            <span>Minimum Schlusspreis:<br/>
                USD <input
                className="px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="number" step="0.01"
                value={minimumPreviousClosing}
                onChange={event => setMinimumPreviousClosing(Number.parseFloat(event.target.value))}/>
            </span>
        <EarningsTable earnings={earningsData} minimumPreviousClosing={minimumPreviousClosing}/>
    </div>
}

export default Home

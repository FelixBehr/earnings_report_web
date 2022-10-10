import type {NextApiRequest, NextApiResponse} from 'next'

import {JSDOM} from 'jsdom';
import Earning from "../../../../types/Earning";

type ResponseData = {
    afterMarketClose: Earning[]
    beforeMarketOpen: Earning[]
}

type RequestData = {
    date: string
}

type StockEarningsData = {
    Symbol: string,
    OptionsType: string,
    PreviousClosingPrice: string,
    ESTEPS: string,
    EarningTime: string,
    HighestChangeAfterEarning?: number
}

interface EarningsRequest extends NextApiRequest {
    query: RequestData
}

function intoEarning(stockEarningsData: StockEarningsData): Earning {
    return {
        ticker: stockEarningsData.Symbol,
        previousClosingPrice: Number.parseFloat(stockEarningsData.PreviousClosingPrice)
    }
}

async function getStockEarnings(date: string): Promise<StockEarningsData[]> {

    const stockEarningsURL = "https://stocksearning.com/Service/ResearchToolService.asmx/GetEarningsCalendar";
    const requestData = {
        EarningDate: date,
        strBasicMarketCap: "ALL",
        Slider1_Max: "0",
        Slider1_Min: "7",
        Slider2_Max: "0",
        Slider2_Min: "5",
        Slider3_Max: "0",
        Slider3_Min: "11"
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }
    const data = await fetch(stockEarningsURL, requestOptions)
    const earnings = await data.json()
    return earnings['d'];
}

export default async function handler(
    req: EarningsRequest,
    res: NextApiResponse<ResponseData>
) {
    const {date} = req.query;
    const earnings = await getStockEarnings(date)
    console.log(earnings);
    const validEarnings = earnings
        .filter(earning => earning.OptionsType === 'Weekly')
        .filter(earning => earning.ESTEPS !== '')

    const beforeMarketOpen = validEarnings.filter(earning => earning.EarningTime === 'Before Market Open').map(intoEarning);

    const afterMarketClose = validEarnings.filter(earning => earning.EarningTime === 'After Market Close').map(intoEarning);

    res.status(200).json({beforeMarketOpen, afterMarketClose})
}

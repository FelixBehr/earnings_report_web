import type {NextApiRequest, NextApiResponse} from 'next'
import yahooFinance from 'yahoo-finance2';

type ResponseData = {
    name: string,
    price?: number
}

type RequestData = {
    ticker: string
}

interface StockPriceTickerRequest extends NextApiRequest {
    query: RequestData
}

export default async function handler(
    req: StockPriceTickerRequest,
    res: NextApiResponse<ResponseData>
) {
    const {ticker} = req.query;

    const quote = await yahooFinance.quote(ticker)

    res.status(200).json({name: ticker, price: quote?.ask})
}

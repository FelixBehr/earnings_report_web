// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
    name: string
}

type RequestData = {
    ticker: string
}

interface StockPriceTickerRequest extends NextApiRequest {
    query: RequestData
}

export default function handler(
    req: StockPriceTickerRequest,
    res: NextApiResponse<Data>
) {
    const {ticker} = req.query;

    res.status(200).json({name: ticker})
}

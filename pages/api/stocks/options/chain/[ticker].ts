import type {NextApiRequest, NextApiResponse} from 'next'
import yahooFinance from 'yahoo-finance2';
import {Option} from "yahoo-finance2/dist/cjs/src/modules/options";

// @ts-ignore
import greeks from 'greeks';
import moment from "moment";

type ResponseData = {
    options: Option[]
}

type RequestData = {
    ticker: string
}

interface OptionChainRequest extends NextApiRequest {
    query: RequestData
}

export default async function handler(
    req: OptionChainRequest,
    res: NextApiResponse<ResponseData>
) {
    const {ticker} = req.query;

    const queryOptions = {lang: 'en-US', formatted: false, region: 'US'};

    const options = await yahooFinance.options(ticker, queryOptions)
    const optionsWithGreeks = options.options.map(option => {
        const yearsUntilExpiration = moment(option.expirationDate);
        const now = moment();
        const differenceInSeconds = yearsUntilExpiration.diff(now, 'seconds');
        const differenceInDays = differenceInSeconds / 86400.0;
        const differenceInYears = differenceInDays / 365.0;
        const dividendRate = options.quote.trailingAnnualDividendRate / 100.0;
        option.puts = option.puts.map(put => {
            put.greeks = {
                delta: greeks.getDelta(options.quote.ask, put.strike, differenceInYears, put.impliedVolatility, dividendRate, "put"),
                gamma: greeks.getGamma(options.quote.ask, put.strike, differenceInYears, put.impliedVolatility, dividendRate, "put"),
                vega: greeks.getVega(options.quote.ask, put.strike, differenceInYears, put.impliedVolatility, dividendRate, "put"),
                theta: greeks.getTheta(options.quote.ask, put.strike, differenceInYears, put.impliedVolatility, dividendRate, "put"),
                rho: greeks.getRho(options.quote.ask, put.strike, differenceInYears, put.impliedVolatility, dividendRate, "put"),
            }
            put.dividendPercentage = (((put.ask + put.bid) / 2)/ put.strike) * 100
            return put;
        })

        option.calls = option.calls.map(call => {
            call.greeks = {
                delta: greeks.getDelta(options.quote.ask, call.strike, differenceInYears, call.impliedVolatility, dividendRate, "call"),
                gamma: greeks.getGamma(options.quote.ask, call.strike, differenceInYears, call.impliedVolatility, dividendRate, "call"),
                vega: greeks.getVega(options.quote.ask, call.strike, differenceInYears, call.impliedVolatility, dividendRate, "call"),
                theta: greeks.getTheta(options.quote.ask, call.strike, differenceInYears, call.impliedVolatility, dividendRate, "call"),
                rho: greeks.getRho(options.quote.ask, call.strike, differenceInYears, call.impliedVolatility, dividendRate, "call"),
            }
            call.dividendPercentage = (((call.ask + call.bid) / 2) / call.strike) * 100
            return call;
        })
        return option;
    });

    res.status(200).json({options: optionsWithGreeks})
}

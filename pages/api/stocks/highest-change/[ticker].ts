import type {NextApiRequest, NextApiResponse} from 'next'

import {JSDOM} from 'jsdom';

import * as _ from "lodash";

type HighestChanges = {
    highestChangeLast4?: number
    highestChangeLast6?: number
}

type RequestData = {
    ticker: string
}

interface HighestChangeRequest extends NextApiRequest {
    query: RequestData
}

async function getHighestRateChange(ticker: string): Promise<HighestChanges> {
    const url = `https://stocksearning.com/stocks/${ticker}/historical-earnings-date`
    const doc = await fetch(url);
    const body = await doc.text();
    const dom = new JSDOM(`${body}`)

    const numbers = Array.prototype.slice.call(dom.window.document.querySelectorAll("ul li .headblr_two span")).map(p => p.textContent);
    const groupedNumbers = _.chunk(numbers, 6);
    const changes = groupedNumbers.map(group => group[3]).map(change => change.replace('%', '')).map(change => Number.parseFloat(change))
    const absoluteChanges = changes.map(change => Math.abs(change));
    const last4AbsoluteChanges = _.take(absoluteChanges, 4);
    const last6AbsoluteChanges = _.take(absoluteChanges, 6);

    return {
        highestChangeLast4: Math.max(...last4AbsoluteChanges),
        highestChangeLast6: Math.max(...last6AbsoluteChanges)
    }
}

export default async function handler(
    req: HighestChangeRequest,
    res: NextApiResponse<HighestChanges>
) {
    const {ticker} = req.query;
    const highestChanges = await getHighestRateChange(ticker)

    res.status(200).json(highestChanges)
}

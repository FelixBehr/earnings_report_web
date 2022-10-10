import type {NextApiRequest, NextApiResponse} from 'next'
import yahooFinance from 'yahoo-finance2';
import moment from "moment-timezone";

export interface TimeAPIResponse {
    abbreviation: string;
    client_ip: string;
    datetime: string;
    day_of_week: number;
    day_of_year: number;
    dst: boolean;
    dst_from: string;
    dst_offset: number;
    dst_until: string;
    raw_offset: number;
    timezone: string;
    unixtime: number;
    utc_datetime: string;
    utc_offset: string;
    week_number: number;
}

interface StockExchangeOpenRequest extends NextApiRequest {
}

interface StockExchangeOpenResponse extends NextApiResponse {
    body: {
        isOpen: boolean
    }
}

export default async function handler(
    req: StockExchangeOpenRequest,
    res: StockExchangeOpenResponse
) {

    const data = await fetch("https://worldtimeapi.org/api/timezone/America/New_York")
    const timeData: TimeAPIResponse = await data.json()
    const dayOfWeek = timeData.day_of_week;

    console.log(timeData);

    const isBetweenMondayAndFriday = dayOfWeek >= 1 && dayOfWeek <= 5;

    const currentTime = moment().tz('America/New_York')
    const opening = moment().tz('America/New_York').hour(9).minute(30).second(0).millisecond(0)
    const closing = moment().tz('America/New_York').hour(16).minute(0).second(0).millisecond(0)

    console.log(currentTime)
    console.log(opening)
    console.log(closing)

    res.status(200).json({isOpen: currentTime.isBetween(opening, closing)})
}

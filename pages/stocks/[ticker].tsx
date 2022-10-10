import type {NextPage, GetServerSideProps} from 'next'
import useSWR from 'swr';
import fetcher from "../../swr-fetcher";

type TickerPageProps = {
    ticker: string
}

function getUpperBound(highestChangeLast4?: number, currentPrice?: number): number {
    return currentPrice + ((highestChangeLast4 / 100) * currentPrice)
}

function getLowerBound(highestChangeLast4?: number, currentPrice?: number): number {
    return currentPrice - ((highestChangeLast4 / 100) * currentPrice)
}


const OptionsTable = (props) => {
    return <div>
        <p>{props.label}</p>
        <table className="table-auto w-full">
            <thead className="border-b">
            <tr className="bg-gray-100">
                <th className="text-left p-4 font-medium text-black">Basispreis</th>
                <th className="text-left p-4 font-medium text-black">Geldkurs</th>
                <th className="text-left p-4 font-medium text-black">Briefkurs</th>
                <th className="text-left p-4 font-medium text-black">Rendite in %</th>
            </tr>
            </thead>
            <tbody>

            {
                props.options?.map(option => {
                    const green = option.dividendPercentage >= 0.2 && option.dividendPercentage <= 0.5
                    console.log(green);

                    const greenClass = green ? 'p-4 bg-green-300' : 'p-4 bg-red-300'

                    return <tr key={option.contractSymbol} className="border-b hover:bg-gray-50">
                        <td className="p-4">{option.strike.toFixed(2)}</td>
                        <td className="p-4">{option.ask.toFixed(2)}</td>
                        <td className="p-4">{option.bid.toFixed(2)}</td>
                        <td className={greenClass}>{option.dividendPercentage.toFixed(2)}%</td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}

const TickerPage: NextPage<TickerPageProps> = (props) => {
    const {data: chainData, error: chainError} = useSWR(`/api/stocks/options/chain/${props.ticker}`);
    const {data: priceData, error: priceError} = useSWR(`/api/stocks/price/${props.ticker}`);
    const {
        data: highestChangeData,
        error: highestChangeError
    } = useSWR(`/api/stocks/highest-change/${props.ticker}`);

    const lowerBound = getLowerBound(highestChangeData?.highestChangeLast4, priceData?.price)
    const upperBound = getUpperBound(highestChangeData?.highestChangeLast4, priceData?.price)

    const fittingCallOptions = chainData?.options[0].calls.filter(call => call.strike > upperBound);
    const fittingPutOptions = chainData?.options[0].puts.filter(put => put.strike < lowerBound).reverse();

    return <div className="container mx-auto h-screen">

        <div>Aktueller Aktienpreis: USD {priceData?.price.toFixed(2)}</div>
        <div>Höchste Ausschlag Earnings: {highestChangeData?.highestChangeLast4.toFixed(2)} %</div>
        <div>Minimaler berechter Call Basispreis: USD {upperBound?.toFixed(2)}</div>
        <div>Maximal berechnter Put Basispreis: USD {lowerBound?.toFixed(2)}</div>

        <OptionsTable options={fittingCallOptions} label="Call"/>
        <OptionsTable options={fittingPutOptions} label="Put"/>

    </div>
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    // @ts-ignore
    const ticker = context.params['ticker']
    return {
        props: {
            ticker
        }
    }
}

export default TickerPage
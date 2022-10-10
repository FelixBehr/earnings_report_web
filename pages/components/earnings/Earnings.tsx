import Earning from "../../../types/Earning";
import EarningRow from "./EarningRow";

type EarningsProps = {
    earnings: Earning[],
    minimumPreviousClosing: number
    label: string
}

const Earnings = (props: EarningsProps) => {
    return <div>
        <p>{props.label}</p>
        <table className="table-auto w-full">
            <thead className="border-b">
            <tr className="bg-gray-100">
                <th className="text-left p-4 font-medium text-black">Ticker</th>
                <th className="text-left p-4 font-medium text-black">Früherer Schlusspreis</th>
                <th className="text-left p-4 font-medium text-black">Höchste Ausschlag Earnings</th>
                <th className="text-left p-4 font-medium text-black">Aktueller Aktienpreis</th>
            </tr>
            </thead>
            <tbody>
            {props.earnings.filter(earning => earning.previousClosingPrice >= props.minimumPreviousClosing).map(earning =>
                <EarningRow key={earning.ticker} earning={earning}/>
            )}
            </tbody>
        </table>
    </div>
}

export default Earnings
import Earning from "../../../types/Earning";
import Earnings from "./Earnings";

type EarningsTableProps = {
    earnings: {
        beforeMarketOpen: Earning[],
        afterMarketClose: Earning[]
    },
    minimumPreviousClosing: number
}

const EarningsTable = (props: EarningsTableProps) => {
    return <div className="mt-4">
        <div className="mt-4">
            <Earnings earnings={props.earnings.beforeMarketOpen} minimumPreviousClosing={props.minimumPreviousClosing}
                      label="Vor Marktöffnung"/>
        </div>
        <div className="mt-4">
            <Earnings earnings={props.earnings.afterMarketClose} minimumPreviousClosing={props.minimumPreviousClosing}
                      label="Nach Marktschluss"/>
        </div>
    </div>
}

// This also gets called at build time
export async function getStaticProps({}) {

    // Pass post data to the page via props
    return {
        props: {
            earnings: {beforeMarketOpen: [], afterMarketClose: []}
        }
    }
}

export default EarningsTable;
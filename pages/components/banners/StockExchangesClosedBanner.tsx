import {useEffect, useState} from "react";

const StockExchangesClosedBanner = () => {
    const [isOpen, setIsOpen] = useState(null);

    useEffect(() => {
        fetch('/api/exchanges/open')
            .then(data => {
                return data.json()
            })
            .then(data => {
                setIsOpen(data.isOpen)
            })
    })

    if (isOpen === true) {
        return <div className="w-100 bg-green-300 text-center">
            NYSE is opened. Shown Prices are Realtime.
        </div>
    }
    if (isOpen === false) {
        return <div className="w-100 bg-red-300 text-center">
            NYSE is closed. Shown Prices might be inaccurate.
        </div>
    }
    return null
}
export default StockExchangesClosedBanner;
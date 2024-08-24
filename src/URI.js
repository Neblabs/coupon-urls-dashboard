import { useSelector } from "react-redux";
import { urls } from "./CouponURLs";
import QueryParameters from "./QueryParameters";
import URIPath from "./URIPath";

import URITypeMenu from "./URITypeMenu";
import ClipboardJS from 'clipboard';
import { useEffect } from "react";
import Enabled from "./Enabled";

const URI = () => {
    const queryParameters = useSelector(state => state.queryParameters)
    const uri = useSelector(state => state.uri)
    const fullURL = `${urls.homepage}${uri.type === 'path'? '/'+uri.value:''}${stringifyQueryParameters(queryParameters)}`

    useEffect(() => {
        new ClipboardJS('#coupon–urls–copy–button', {
            text: () => fullURL
        });
    }, [fullURL])

    return <div className="relative flex flex-row justify-center">
                <div className="flex flex-row relative rounded-3 bg-gray-100 p-3 shadow-card mb-6 z-10">
                    <URITypeMenu />
                    <p className="flex flex-col items-end justify-center mt-0">
                        <p className="text-smaller-2 text-transparent">t</p>
                        <p className="text-gray-400 text-3x pl-1">/</p>
                    </p>
                    <URIPath />
                    <QueryParameters />
                </div>
                <div className="absolute flex flex-col items-center justify-end w-[92%] h-full  rounded-3 top-0 bg-[#eceff1] text-smaller-1 text-gray-300 pb-[2px]">
                    <p className="flex flex-row items-center space-x-1 whitespace-nowrap">
                        <span>{fullURL}</span>
                        <button 
                            id="coupon–urls–copy–button" 
                            className="px-2 bg-gray-350 text-gray-100 rounded-6 uppercase text-smaller-2 group"

                            >
                            <span className="group-focus:hidden">{__('copy')}</span>
                            <span className="hidden group-focus:inline">{__('Copied!')}</span>
                        </button>
                    </p>
                </div>
                <Enabled />
           </div>;
}

const stringifyQueryParameters = queryParameters => {
    if (!queryParameters.length) {
        return ''
    }

    return '?'+queryParameters.map(
        ({key, value}) => `${key}${value? '='+value : ''}`
    ).reduce((previous, current) => `${previous}&${current}`)

}


export default URI;
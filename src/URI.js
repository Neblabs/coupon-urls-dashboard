import { useSelector } from "react-redux";
import { __, initialState, urls } from "./CouponURLs";
import QueryParameters from "./QueryParameters";
import URIPath from "./URIPath";
import URITypeMenu from "./URITypeMenu";
import { useEffect, useState } from "react";
import Enabled from "./Enabled";
import classNames from "classnames";
import {isEqual} from 'lodash';
const canClickURI = (uri) => {
    if (initialState.uri.type === 'path' && !initialState.uri.value?.trim()) {
        return false
    }

    return isEqual(initialState.uri, uri)
}

const URI = () => {
    const queryParameters = useSelector(state => state.queryParameters)
    const uri = useSelector(state => state.uri)
    const fullURL = `${urls.homepage}${uri.type === 'path'? '/'+uri.value:''}${stringifyQueryParameters(queryParameters)}`
    const [isCopying, setIsCopying] = useState(false)

    useEffect(() => {
        if (isCopying) {
            setTimeout(() => setIsCopying(false), 4*100)
        }
    }, [isCopying])

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
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(fullURL)
                                } catch(error) {
                                    console.log('error copying url:', error)
                                }

                                setIsCopying(true)
                            }}
                            >
                            <span className={classNames({
                                'hidden': isCopying
                            })}>{__('copy')}</span>
                            <span className={classNames({
                                'hidden': !isCopying
                            })}>{__('Copied!')}</span>
                        </button>
                        {canClickURI(uri)? <a  href={fullURL}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 px-2 bg-[#6c90e0] text-gray-100 rounded-6 uppercase text-smaller-2 group h-4"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-4 max-w-4 min-h-4 max-h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </a> : null}

                    </p>
                </div>
                {!canClickURI(uri) && <span className="absolute flex text-smaller-2 text-gray-400 -bottom-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-3 max-w-3 min-h-3 max-h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.99 7.5 8.24 3.75m0 0L4.49 7.5m3.75-3.75v16.499h11.25" />
                    </svg>
                    <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="min-w-3 max-w-3 min-h-3 max-h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span>{__('Save before testing')}</span>
                    </div>
                </span>}
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
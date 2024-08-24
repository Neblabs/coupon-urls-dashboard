import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "./actions/Actions";

const URIPath = () => {
    const uri = useSelector(state => state.uri);
    const [value, setvalue] = useState(uri.value);
    const dispatch = useDispatch();
    const inputRef = useRef(null)

    useEffect(() => {
        if (uri.type === 'path') {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [uri.type])

    if (uri.type === 'homepage') {
        return '';
    }

    return <p className="flex flex-col items-end justify-center mt-0">
                <p className="text-smaller-2 text-transparent">t</p>
                <input ref={inputRef} type="text" className="text-2x p-0 text-gray-650 border-none focus:outline-none focus:shadow-none bg-transparent" placeholder="custom/path/" value={value} onChange={(event) => setvalue(formatPath(event.target.value, true))} onBlur={dispatch.bind(this, actions.updateURIValue(formatPath(value, false)))}/>
            </p>;
}

const formatPath = (path, leaveLast = false) => {
    path = path.replace(/\s/, '')
    if (path[0] === '/') {
        path = path.substring(1)
    }

    if (leaveLast) {
        return path;
    }

    if(path[path.length-1] === '/') {
        path = path.substring(0, path.length-1)
    }

    return path;
}
export default URIPath;
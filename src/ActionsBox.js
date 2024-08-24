import { useDispatch, useSelector } from "react-redux";
import { __, components } from "./CouponURLs";
import NoActions from "./NoActions";
import { TipMenu } from "./TipMenu";
import { CouponURLs } from "./globals";
import actions from "./actions/Actions";
import ActionsList from "./ActionsList";

const ActionsBox = () => {
    const currentActions = useSelector(state => state.actions);
    const dispatch = useDispatch();

    return <div className="w-full flex-row items-center justify-center mt-10">
                <div className="flex flex-col items-center text-gray-500">
                    <NoActions actions={currentActions}/>  
                    <ActionsList actions={currentActions} />
                    <TipMenu 
                        button={
                            <button className={"flex flex-row space-x-1 items-center justify-center mt-3 bg-blue-normal text-gray-100 px-12 h-8 rounded-1"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                <span className="flex h-4">{__('Add action', CouponURLs.textDomain)}</span>
                            </button>
                        } 
                        components={components.actions}
                        selectedIds={currentActions.map(({type}) => type)}
                        idKey="type"
                        onSelection={id => dispatch(actions.addAction(id))}
                    />
                </div>
           </div>;
}

export default ActionsBox;
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../store/reducers/combinedReducers";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

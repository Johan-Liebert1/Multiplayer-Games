import { History } from "history";
import { useEffect } from "react";
import { useTypedSelector } from "./useTypedSelector";

const useUserPresent = (history: History<unknown>) => {
    const { user } = useTypedSelector((state) => state);

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            history.push("/");
        }
    }, [history, user]);
};

export default useUserPresent;

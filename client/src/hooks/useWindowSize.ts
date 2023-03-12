import { useState, useEffect } from "react";

const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    const resetWindowSize = (e: UIEvent) => {
        e.preventDefault();
        setSize([window.innerWidth, window.innerHeight]);
    };

    useEffect(() => {
        window.addEventListener("resize", resetWindowSize);
        return () => {
            window.removeEventListener("resize", resetWindowSize);
        };
    }, []);

    return size;
};

export default useWindowSize;

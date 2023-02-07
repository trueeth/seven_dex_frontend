import React, { useState, useEffect } from 'react';

const INSTANT_INTERVAL = 1000
const FAST_INTERVAL = 10000;
const SLOW_INTERVAL = 60000;

export const RefreshContext = React.createContext({ slow: 0, fast: 0, instant: 0 });

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
export const RefreshContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [slow, setSlow] = useState(0);
    const [fast, setFast] = useState(0);
    const [instant, setInstant] = useState(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            setFast((prev) => prev + 1);
        }, FAST_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            setSlow((prev) => prev + 1);
        }, SLOW_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            setInstant((prev) => prev + 1)
        }, INSTANT_INTERVAL)
        return () => clearInterval(interval)
    }, [])

    return <RefreshContext.Provider value={{ slow, fast, instant }}>{children}</RefreshContext.Provider>;
};

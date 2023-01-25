import { useContext } from 'react';
import { RefreshContext } from '../context';

const useRefresh = () => {
    const { fast, slow, instant } = useContext(RefreshContext);
    return { fastRefresh: fast, slowRefresh: slow, instantRefresh: instant };
};

export default useRefresh;
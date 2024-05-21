import { useCallback, useEffect, useState } from "react";
import useStore, { Store } from "../../src/context/store/useStore";

type TKeys = Pick<Store, 'chats' | 'messages'>;
type TCachedData = TKeys[keyof TKeys];

interface IResponse {
    data: TCachedData;
    status: number;
}

interface IUseCache {
    getData: () => Promise<IResponse>;
    storeKey: string;
    storeData: (data: TCachedData) => void;
}

export default function useCache({ getData, storeKey, storeData }: IUseCache) {

    const cachedData = useStore((state) => state[storeKey]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const compareData = useCallback((newData: TCachedData) => {
        const isDataEqual = JSON.stringify(newData) === JSON.stringify(cachedData);

        if (!isDataEqual) {
            storeData(newData);
        }
    }, [cachedData, storeData])

    const retrieveData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getData();
            compareData(response.data);
        } catch (error) {
            setHasError(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [getData, compareData])

    useEffect(() => {
        if (!isLoading && !cachedData && !hasError) {
            retrieveData();
        }
    } , [isLoading, cachedData, hasError, retrieveData])

    return {
        data: cachedData,
        isLoading,
    }
}
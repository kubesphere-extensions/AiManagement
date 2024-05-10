import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';

import { request } from '@ks-console/shared';
import { transformRequestParams } from './utils';
import { State } from './reducer';

export function useDidUpdate(fn: () => void, dependencies?: any[]) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      fn();
    } else {
      mounted.current = true;
    }
  }, dependencies);
}

export const useData = (
  url: string,
  params: State,
  queryKey?: string,
  transformParamsFn?: (params: any) => any,
) => {
  const requestParams = (transformParamsFn || transformRequestParams)(params);
  return useQuery(
    [
      'key',
      queryKey,
      params.pageIndex,
      params.pageSize ?? 10,
      params.filters,
      params.sortBy,
      params.parameters,
      url,
    ],
    async () => {
      const data = await request(url, { params: requestParams });
      return data as any;
    },
    {
      keepPreviousData: true,
      staleTime: 15000,
    },
  );
};

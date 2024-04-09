import { useStore, mutate } from '@kubed/stook';
import { request, useList, UseListOptions, FormattedCluster, FormattedNode, OriginalNode, getBaseInfo } from '@ks-console/shared';
import { get } from 'lodash'

import { formatFetchListParams } from '../utils';
import type { FetchListParams } from '../types';

export interface BaseStore {
  pageHeaderHeight: number;
  globalNavOpen: boolean;
}

const initialBseStore: BaseStore = {
  pageHeaderHeight: 0,
  globalNavOpen: false,
};

export const useBaseStore = () => {
  const [baseStore, setBaseStore] = useStore<BaseStore>('BaseStore', initialBseStore);

  const setPageHeaderHeight = (height: number) =>
    mutate('BaseStore', (state: BaseStore) => {
      state.pageHeaderHeight = height;
    });

  return {
    baseStore,
    setBaseStore,
    setPageHeaderHeight
  }

}

export const defaultUrl = "kapis/tenant.kubesphere.io/v1beta1";

export const getResourceUrl = (module: string) => {
  return `${defaultUrl}/${module}`
}

const mapper = (item: OriginalNode): any => ({
  ...getBaseInfo(item),
  label: get(item, 'metadata.name'),
  value: get(item, 'metadata.name'),
});

const fetchList = (
  params: Record<string, any>,
  options?: Omit<UseListOptions<FormattedCluster>, 'url' | 'params' | 'format'>,
) => {

  if (params.limit === Infinity || params.limit === -1) {
    params.limit = -1;
    params.page = 1;
  }

  params.limit = params.limit ?? 10;


  const url = getResourceUrl('clusters');

  return useList<FormattedCluster>({
    url,
    params,
    format: mapper,
    ...options,
  });
};

function useFetchClusterList(options?: Partial<UseListOptions<FormattedCluster>>) {
  const params = options?.params ?? {};
  const mode = options?.mode;
  const result = fetchList(params, { mode });
  const formattedClusters = result.data ?? [];
  return { ...result, formattedClusters };
}

function useFetchGPUMonitorList(options?: UseListOptions<any>) {
  const params = options?.params ?? {};
  const mode = options?.mode;
  // params.url = 'aicp/gpu/list_gpu_dev_info';
  const result = fetchList(params, { mode });
  const formattedClusters = result.data ?? [];
  return { ...result, formattedClusters };
}

const BaseStore = {
  defaultUrl,
  fetchList,
  useFetchClusterList,
  useFetchGPUMonitorList
}

export default BaseStore;
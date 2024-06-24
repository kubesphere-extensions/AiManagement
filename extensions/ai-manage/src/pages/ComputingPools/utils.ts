import { nodeStore } from '@ks-console/shared';

export const transformRequestParams = (params: Record<string, any>) => {
  const { withTypeSelectParams } = nodeStore;
  const { type = 'node', pageIndex, pageSize, parameters, ...rest } = params;
  const requestParams = withTypeSelectParams({ ...parameters, ...rest }, type);
  // requestParams.labelSelector = '!aicp.group/aipods_type';

  requestParams.limit = pageSize;
  requestParams.page = pageIndex ?? 0;
  return requestParams;
};

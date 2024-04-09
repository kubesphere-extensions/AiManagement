export type PathParams = {
  cluster?: string;
  namespace?: string;
  apiVersion?: string;
  module?: string;
  dryRun?: boolean;
  name?: string;
  workspace?: string;
  devops?: string;
  labelSelector?: string;
  appName?: string;
  versionID?: string;
  annotation?: string;
};

type FilterParams = {
  sortBy?: string;
  ascending?: string;
  limit?: number;
  page?: number;
};

export type FetchListParams = PathParams & FilterParams;
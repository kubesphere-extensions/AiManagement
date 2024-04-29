import React from 'react';
import { Resource } from '@kubed/icons';
import { Banner } from '@kubed/components';

import EntryList from './entry-list';

const ComputingPools = () => (
  <>
    <Banner
      className="mb12"
      icon={<Resource />}
      title={t('Computing pools manage')}
      description={t('COMPUTING_POOLS_DESC')}
    />
    <EntryList />
  </>
);

export default ComputingPools;

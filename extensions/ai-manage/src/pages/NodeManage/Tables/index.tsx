import React, { useState } from 'react';
import { useStore } from '@kubed/stook';

import MonitorTable from './monitorTable';
import GpuTable from './gpuTable';
import IbNetworkTable from './ibNetworkTable';
import VGPUTable from './vGPUTable';
import { TableContent, StyledNav, HiddendNav } from './styles';

function TableWrap() {
  const [tab, setTab] = useStore('current_tab', 'monitor');
  const [showTab, setShowTab] = useState(true);

  function generatePageTabs(): Array<{ id: string; label: string }> {
    const pageTabs: Array<{ id: string; label: string }> = [
      { id: 'monitor', label: t('Node Monitor') },
      { id: 'list', label: t('Node List') },
      { id: 'gpu', label: t('GPU Monitor') },
      { id: 'vGPU', label: t('vGPU Monitor') },
    ];

    if (globals?.config?.enable_infiniband_grafana) {
      pageTabs.push({ id: 'ib', label: t('IB Network Card Monitor') });
    }

    return pageTabs;
  }

  const pageTabs = generatePageTabs();

  const navs = pageTabs.map(item => ({
    label: item.label,
    value: item.id,
  }));

  const defaultTabs = () => <HiddendNav className="mr12" data={navs} />;

  return (
    <TableContent>
      {showTab && <StyledNav data={navs} value={tab} onChange={v => setTab(v)} />}
      {tab === 'gpu' && <GpuTable renderTabs={defaultTabs} />}
      {(tab === 'monitor' || tab === 'list') && (
        <MonitorTable renderTabs={defaultTabs} setShowTab={setShowTab} tab={tab} />
      )}
      {tab === 'vGPU' && <VGPUTable renderTabs={defaultTabs} />}
      {tab === 'ib' && <IbNetworkTable renderTabs={defaultTabs} />}
    </TableContent>
  );
}

export default TableWrap;

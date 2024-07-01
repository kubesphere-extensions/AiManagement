import React, { useState, useCallback, useMemo } from 'react';
import { useStore } from '@kubed/stook';

import MonitorTable from './monitorTable';
import GpuTable from './gpuTable';
import IbNetworkTable from './ibNetworkTable';
import VGPUTable from './vGPUTable';
import NpuTable from './npuTable';
import { TableContent, StyledNav, HiddendNav } from './styles';

function TableWrap() {
  const [tab, setTab] = useStore('current_tab', 'monitor');
  const [showTab, setShowTab] = useState(true);
  const [configs] = useStore('configs');

  const getpageTabs = useCallback(() => {
    const pageTabs: Array<{ id: string; label: string }> = [
      { id: 'monitor', label: t('Node Monitor') },
      { id: 'list', label: t('Node List') },
    ];
    if (configs?.length) {
      configs.forEach((item: any) => {
        if (item.enable_table_view === '1') {
          switch (item?.dashboard_id) {
            case '1':
              pageTabs.push({ id: 'gpu', label: t('GPU Monitor') });
              break;
            case '6':
              pageTabs.push({ id: 'vGPU', label: t('vGPU Monitor') });
              break;
            case '3':
              pageTabs.push({ id: 'npu', label: t('NPU 监控') });
              break;
            case '4':
              pageTabs.push({ id: 'ib', label: t('Network Card Monitor') });
              break;
            default:
              break;
          }
        }
      });
    }
    return pageTabs;
  }, [configs]);

  const navs = useMemo(() => {
    return getpageTabs()?.map(item => ({
      label: item.label,
      value: item.id,
    }));
  }, [getpageTabs]);

  const defaultTabs = () => <HiddendNav className="mr12" data={navs} />;

  return (
    <TableContent>
      {showTab && <StyledNav data={navs} value={tab} onChange={v => setTab(v)} />}
      {tab === 'gpu' && <GpuTable renderTabs={defaultTabs} />}
      {(tab === 'monitor' || tab === 'list') && (
        <MonitorTable renderTabs={defaultTabs} setShowTab={setShowTab} tab={tab} />
      )}
      {tab === 'vGPU' && <VGPUTable renderTabs={defaultTabs} />}
      {tab === 'npu' && <NpuTable renderTabs={defaultTabs} />}
      {tab === 'ib' && <IbNetworkTable renderTabs={defaultTabs} />}
    </TableContent>
  );
}

export default TableWrap;

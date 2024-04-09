import React, { useRef } from 'react';
import { useDisclosure } from '@kubed/hooks';
import {
  Panel,
  DataTable,
  Icon,
  formatTime,
  transformRequestParams,
  TableRef,
} from '@ks-console/shared';
import { Button } from '@kubed/components';
import { useParams } from 'react-router-dom';

import CreateLogModal from './createLogModal';

function MaintenanceLog() {
  const { name } = useParams();
  const createSecretModal = useDisclosure();
  const tableRef = useRef<TableRef>();

  const columns = [
    {
      title: t('时间'),
      field: 'created_at',
      render: (v: string) => (v ? formatTime(v) : '-'),
    },
    {
      title: t('记录人'),
      field: 'search_word',
      searchable: true,
      canHide: true,
      render: (_v: string, row: any) => row?.maintainer_name ?? '-',
    },
    {
      title: t('描述'),
      field: 'description',
      width: '40%',
      canHide: true,
    },
  ];

  const renderTableActions = () => {
    return (
      <Button className="ml12" color="secondary" onClick={createSecretModal.open}>
        {t('Create New Log')}
      </Button>
    );
  };

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: serverData.data || [],
      totalItems: serverData.counts,
    };
  };

  return (
    <>
      <Panel title={t('Maintenance Log')}>
        <DataTable
          ref={tableRef}
          tableName="maintenance-log"
          rowKey="ml_id"
          url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_node_maintain_log"
          columns={columns}
          toolbarRight={renderTableActions()}
          transformRequestParams={params => {
            const p = transformRequestParams(params as any);
            return {
              ...p,
              gpu_node_id: name,
            };
          }}
          serverDataFormat={formatServerData}
          hideSettingMenu
          emptyOptions={{
            withoutTable: true,
            image: <Icon name="log" size={48} />,
            title: t('No maintenance logs found'),
            description: t('Please create a new log'),
            createButton: true,
            clickCreateButtonFn: () => createSecretModal.open(),
          }}
          showFooter={false}
        />
      </Panel>
      <CreateLogModal
        visible={createSecretModal.isOpen}
        nodeID={name as string}
        onCancel={createSecretModal.close}
        onSuccess={() => {
          tableRef.current?.refetch();
          createSecretModal.close();
        }}
      />
    </>
  );
}

export default MaintenanceLog;

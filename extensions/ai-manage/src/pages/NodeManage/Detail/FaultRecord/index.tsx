import React, { useRef, useState } from 'react';
import {
  Panel,
  DataTable,
  formatTime,
  StatusIndicator,
  Icon,
  transformRequestParams,
  Column,
  TableRef,
} from '@ks-console/shared';
import { More, Hammer } from '@kubed/icons';
import { useDisclosure } from '@kubed/hooks';
import { Button, Dropdown, Menu, MenuItem } from '@kubed/components';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import TroubleshootingModal from '../../../FaultLog/TroubleshootingModal';

export const FieldLabel = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  font-weight: 400;
  color: #79879c;
  max-width: 300px;
`;

function FaultRecord() {
  const { name } = useParams();
  const [id, setID] = useState('');
  const tableRef = useRef<TableRef>();
  const createModal = useDisclosure();

  const MoreActions = ({ row }: { row: any }) => {
    const handle = () => {
      if (row.fault_status === '1') return;
      createModal.open();
      setID(row?.records_id);
    };

    return (
      <Menu>
        <MenuItem icon={<Hammer />} onClick={handle} disabled={row.fault_status === '1'}>
          {t('Troubleshooting')}
        </MenuItem>
      </Menu>
    );
  };

  const columns: Column[] = [
    {
      title: t('Fault ID'),
      field: 'records_id',
    },
    {
      title: t('Fault Severity'),
      canHide: true,
      field: 'fault_priority',
      render: (v: string) => {
        const type = v === 'Critical' ? 'Warning' : v === 'Warning' ? 'ready' : 'error';
        return (
          <div>
            <StatusIndicator type={type}>{t(v)}</StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('Fault Time'),
      field: 'search_word',
      searchable: true,
      render: (_v: string, row: any) => (row?.created_at ? formatTime(row?.created_at) : '-'),
    },
    {
      title: t('GPU UUID'),
      field: 'dev_gpu_uuid',
      canHide: true,
      width: 200,
      render: (v, row) => v || '-',
    },
    {
      title: t('Error Code'),
      field: 'gpu_err_id',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('XID'),
      canHide: true,
      field: 'gpu_xid',
      render: v => v ?? '-',
    },
    {
      title: t('Error Description'),
      field: 'gpu_err_desc',
      canHide: true,
      width: 200,
      render: v => v || '-',
    },
    {
      title: t('Fault Status'),
      canHide: true,
      field: 'fault_status',
      render: (v: string) => (
        <StatusIndicator type={v === '1' ? 'ready' : 'deleted'}>
          {v === '1' ? t('Processed') : t('Unprocessed')}
        </StatusIndicator>
      ),
    },
    {
      title: t('Fault Resolution'),
      field: 'fault_treatment',
      canHide: true,
      render: (value: string) => (value ? value : '-'),
    },
    {
      title: t('Fault Advice'),
      canHide: true,
      width: 200,
      field: 'gpu_suggestions',
      render: (v: string) => (v ? v : '-'),
    },
    {
      id: 'more',
      title: ' ',
      render: (_, row) => (
        <Dropdown placement="bottom-end" content={<MoreActions row={row} />}>
          <Button variant="text" radius="lg">
            <More size={16} />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: serverData?.data?.[0]?.fault_records || [],
      totalItems: serverData?.data?.[0]?.counts || 0,
    };
  };

  return (
    <>
      <Panel title={t('Fault Log')}>
        <DataTable
          ref={tableRef}
          tableName="record"
          rowKey="dev_gpu_uuid"
          url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_fault_record"
          transformRequestParams={params => {
            const p = transformRequestParams(params as any);
            return {
              ...p,
              gpu_node_id: name,
            };
          }}
          placeholder={t('Fault placeholder')}
          parameters={{ gpu_node_id: name }}
          columns={columns}
          serverDataFormat={formatServerData}
          simpleSearch
          emptyOptions={{
            withoutTable: true,
            image: <Icon name="record" size={48} />,
            title: t('No record of faults found'),
          }}
          showFooter={false}
        />
      </Panel>
      <TroubleshootingModal
        faultID={id}
        onCancel={() => createModal.close()}
        visible={createModal.isOpen}
        onSuccess={() => {
          tableRef.current?.refetch();
          createModal.close();
        }}
      />
    </>
  );
}

export default FaultRecord;

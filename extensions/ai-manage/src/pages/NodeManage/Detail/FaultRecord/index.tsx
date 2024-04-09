import React from 'react';
import {
  Panel,
  DataTable,
  formatTime,
  StatusIndicator,
  Icon,
  transformRequestParams,
  Column,
} from '@ks-console/shared';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

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
  const columns: Column[] = [
    {
      title: t('Fault ID'),
      field: 'records_id',
    },
    {
      title: t('Fault Severity'),
      canHide: true,
      field: 'fault_priority',
      render: v => v ?? '-',
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
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: serverData?.data?.[0]?.fault_records || [],
      totalItems: serverData?.data?.[0]?.counts || 0,
    };
  };

  return (
    <Panel title={t('Fault Log')}>
      <DataTable
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
  );
}

export default FaultRecord;

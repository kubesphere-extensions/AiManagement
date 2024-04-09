import React, { useState } from 'react';
import { Banner } from '@kubed/components';
import { Nodes } from '@kubed/icons';
import { Card, Field } from '@kubed/components';
import { get } from 'lodash';
import {
  DataTable,
  formatTime,
  StatusIndicator,
  transformRequestParams,
  Column,
} from '@ks-console/shared';
import { useParams, Link } from 'react-router-dom';

import { FullRow, FullCol, StyledEntity, StyledField, FieldLabel } from './styles';
import { Waring } from '../../icons';

function FaultLog() {
  const [unprocessed, setUnprocessed] = useState(0);
  const [processed, setProcessed] = useState(0);

  const { name } = useParams();
  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'gpu_node_id',
      sortable: false,
      render: (_v, row) => (
        <Field
          value={
            <Link to={`/ai-manage/host/nodes/${row?.gpu_node_id}`}>{row?.gpu_node_id ?? '-'}</Link>
          }
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.gpu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'gpu_node_compute_group',
      canHide: true,
      render: (v, row) => v || '-',
    },
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
    const data = get(serverData, 'data[0]');
    setProcessed(data?.fault_treated ?? 0);
    setUnprocessed(data?.fault_untreated ?? 0);

    return {
      items: data?.fault_records || [],
      totalItems: data?.counts || 0,
    };
  };

  return (
    <div>
      <Banner
        className="mb12"
        icon={<Waring />}
        title={t('Fault Log')}
        description={t('Fault Desc')}
      />
      <Card className="mb12">
        <StyledEntity bordered={false}>
          <FullRow>
            <FullCol span={3}>
              <StyledField
                avatar={<Waring size={40} />}
                label={t('Unprocessed')}
                value={unprocessed}
              />
            </FullCol>
            <FullCol span={8}>
              <Field label={t('Processed')} value={processed} />
            </FullCol>
          </FullRow>
        </StyledEntity>
      </Card>
      <DataTable
        tableName="record"
        rowKey="dev_gpu_uuid"
        placeholder={t('Fault placeholder')}
        url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_fault_record"
        parameters={{ gpu_node_id: name }}
        columns={columns}
        serverDataFormat={formatServerData}
        simpleSearch
        transformRequestParams={params => {
          const p = transformRequestParams(params as any);
          return {
            ...p,
          };
        }}
        emptyOptions={{
          withoutTable: true,
          image: <Waring size={48} />,
          title: t('No record of faults found'),
        }}
        showFooter={false}
      />
    </div>
  );
}

export default FaultLog;

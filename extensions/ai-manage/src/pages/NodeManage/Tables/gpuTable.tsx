import React from 'react';
import { Field } from '@kubed/components';
import { Nodes, Exclamation } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { Column, DataTable, StatusIndicator } from '@ks-console/shared';
import { toPercentage } from './contants';
import { FieldLabel, Resource } from '../style';

interface StatusMap {
  [key: string]: string;
}

interface Props {
  renderTabs: () => React.ReactNode;
}

const statusMap: StatusMap = {
  '0': 'Normal',
  '2': 'Abnormal',
  '1': 'Unknown',
};

function GpuTable({ renderTabs }: Props) {
  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'search_word',
      searchable: true,
      sortable: false,
      render: (_v, row) => (
        <Field
          value={<Link to={row?.gpu_node_id}>{row?.gpu_node_id ?? '-'}</Link>}
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.gpu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'gpu_node_status',
      canHide: true,
      render: (value, row) => {
        const status = value === 'Ready' ? 'Running' : 'Warning';
        return (
          <div>
            <StatusIndicator type={status}>
              {t(`NODE_STATUS_${status?.toUpperCase()}`)}
            </StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'gpu_node_compute_group',
      canHide: true,
      render: (v, row) => v || '-',
    },
    {
      title: t('GPU UUID'),
      field: 'dev_gpu_uuid',
      canHide: true,
      render: (v, row) => v || '-',
    },
    {
      title: t('GPU Status'),
      field: 'dev_gpu_status',
      canHide: true,
      render: (value: string, row) => {
        const status = statusMap?.[value] ?? 'Unknown';
        const type = +value === 0 ? 'Running' : 'Warning';
        return (
          <div>
            <StatusIndicator type={type}>{t(status)}</StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('GPU utilization'),
      field: 'dev_gpu_util',
      canHide: true,
      render: v => (
        <Field
          value={
            <Resource>
              <span>{toPercentage(+v / 100)}</span>
            </Resource>
          }
        />
      ),
    },
    {
      title: t('GPU memory utilization'),
      field: 'dev_gpu_mem_copy_util',
      canHide: true,
      render: (value, row) => {
        return (
          <Field
            value={
              <Resource>
                <span>{toPercentage(+value / 100)}</span>
                {value >= 90 && <Exclamation />}
              </Resource>
            }
            label={`${row.dev_gpu_mem_used}/${row.dev_gpu_mem_total} GiB`}
          />
        );
      },
    },
    {
      title: t('命名空间'),
      field: 'exported_namespace',
      render: value => (value ? value : '-'),
    },
    {
      title: t('容器'),
      field: 'exported_container',
      render: value => (value ? value : '-'),
    },
    {
      title: t('Pod'),
      field: 'exported_pod',
      render: value => (value ? value : '-'),
    },
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: serverData?.data || [],
      totalItems: serverData?.counts,
    };
  };

  return (
    <DataTable
      tableName="gpu_table"
      rowKey="dev_gpu_uuid"
      url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_dev_info"
      toolbarLeft={renderTabs()}
      columns={columns}
      serverDataFormat={formatServerData}
    />
  );
}

export default GpuTable;

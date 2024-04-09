import React from 'react';
import { Field } from '@kubed/components';
import { Nodes, Exclamation } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { Column, DataTable, StatusIndicator } from '@ks-console/shared';
import { FieldLabel } from '../style';

interface Props {
  renderTabs: () => React.ReactNode;
}

function ListTable({ renderTabs }: Props) {
  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'search_word',
      searchable: true,
      sortable: false,
      render: (_v, row) => (
        <Field
          value={<Link to={row?.node_id}>{row?.node_id ?? '-'}</Link>}
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.gpu_node_ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'node_status',
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
    // {
    //   title: t('Belonging Compute Pool'),
    //   field: 'gpu_node_resource',
    //   canHide: true,
    //   render: (v, row) => (
    //     <Field
    //       value={v}
    //       label={<FieldLabel>{row.gpu_node_resource_id || '-'}</FieldLabel>}
    //     />
    //   ),
    // },
    {
      title: t('CPU Model'),
      field: 'node_cpu_model',
      canHide: true,
      render: value => (value ? value : '-'),
    },
    {
      title: t('CPU cores'),
      field: 'node_cpu',
      canHide: true,
      render: value => (value ? `${value} ${t('Core')}` : '-'),
    },
    {
      title: t('Memory'),
      field: 'node_memory',
      canHide: true,
      render: value => (value ? `${value} G` : '-'),
    },
    {
      title: t('GPU Model'),
      field: 'node_gpu_model',
      render: value => (value ? value : '-'),
    },
    {
      title: t('GPU Memory'),
      field: 'node_gpu_memory',
      canHide: true,
      render: value => (value ? `${value} G` : '-'),
    },
    {
      title: t('Number of GPU Cards'),
      field: 'node_gpu',
      render: value => (value ? value : '-'),
    },
    {
      title: t('Compute IB Network Card Configuration'),
      field: 'node_ib_bw_compute',
      canHide: true,
      render: value => (value ? `${value} G` : '-'),
    },
    {
      title: t('Number of Compute IB Network Cards'),
      field: 'node_ib_count_compute',
      render: value => (value ? value : '-'),
    },
    {
      title: t('Storage IB Network Card Configuration'),
      field: 'node_ib_bw_storage',
      canHide: true,
      render: value => (value ? `${value} G` : '-'),
    },
    {
      title: t('Number of Storage IB Network Cards'),
      field: 'node_ib_count_storage',
      canHide: true,
      render: value => (value ? `${value}G` : '-'),
    }
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
      url="/kapis/aicp.kubesphere.io/v1/gpu/list_node_static_info"
      toolbarLeft={renderTabs()}
      columns={columns}
      serverDataFormat={formatServerData}
    />
  );
}

export default ListTable;

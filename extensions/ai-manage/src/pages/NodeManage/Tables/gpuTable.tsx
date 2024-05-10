import React from 'react';
import { Field } from '@kubed/components';
import { Nodes, Exclamation } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { StatusIndicator } from '@ks-console/shared';
import { toPercentage } from './contants';
import { FieldLabel, Resource } from '../style';
import { DataTable, Column } from '../../../components/DataTable';

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
      rowSpan: true,
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
      render: (v, row) => v || '共享计算池',
    },
    {
      title: t('GPU UUID'),
      field: 'dev_gpu_uuid',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('GPU Status'),
      field: 'dev_gpu_status',
      canHide: true,
      render: (value: string) => {
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
      render: (v, row) =>
        row?.dev_gpu_status === '0' ? (
          <Field
            value={
              <Resource>
                <span>{toPercentage(+v / 100)}</span>
              </Resource>
            }
          />
        ) : (
          '-'
        ),
    },
    {
      title: t('GPU memory utilization'),
      field: 'dev_gpu_mem_copy_util',
      canHide: true,
      render: (value, row) =>
        row?.dev_gpu_status === '0' ? (
          <Field
            value={
              <Resource>
                <span>{toPercentage(+value / 100)}</span>
                {value >= 90 && <Exclamation />}
              </Resource>
            }
            label={`${row.dev_gpu_mem_used}/${row.dev_gpu_mem_total} GiB`}
          />
        ) : (
          '-'
        ),
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
    const data = serverData?.data || [];
    const dataGroup = new Map();

    // 合并数据，处理单元格合并
    data.forEach((item: any) => {
      if (dataGroup.has(item.gpu_node_id)) {
        const group = dataGroup.get(item.gpu_node_id);
        if (group[0].rowspan) {
          group[0].rowspan++;
        }
        group.push(item);
      } else {
        dataGroup.set(item.gpu_node_id, [{ ...item, rowspan: 1 }]);
      }
    });
    const newArray = Array.from(dataGroup.values());
    const result = [].concat(...newArray);

    return {
      items: result || [],
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
      showFooter={false}
    />
  );
}

export default GpuTable;

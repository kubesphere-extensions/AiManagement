import React, { useState } from 'react';
import { Field } from '@kubed/components';
import { Nodes, ChevronDown, ChevronUp } from '@kubed/icons';
import { Link } from 'react-router-dom';
import { StatusIndicator } from '@ks-console/shared';
import { toPercentage } from './contants';
import { FieldLabel, Resource } from '../style';
import { DataTable, Column } from '../../../components/DataTable';
import { CollapseWrap, BaseTable } from './styles';

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

function VGpuTable({ renderTabs }: Props) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(['']);

  const handleExpand = (row: any) => {
    if (!row?.vgpu_core_list?.length) {
      return;
    }
    const keySet = new Set<string>([...expandedRowKeys]);
    if (keySet.has(row?.dev_gpu_uuid)) {
      keySet.delete(row?.dev_gpu_uuid);
    } else {
      keySet.add(row?.dev_gpu_uuid);
    }
    setExpandedRowKeys(Array.from(keySet));
  };

  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'search_word',
      searchable: true,
      sortable: false,
      rowSpan: true,
      width: 200,
      fixed: 'left',
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
      rowSpan: true,
      width: 100,
      fixed: 'left',
      render: value => {
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
      rowSpan: true,
      width: 120,
      fixed: 'left',
      render: v => v || '共享计算池',
    },
    {
      title: t('GPU 数量'),
      field: 'gpu_num',
      canHide: true,
      rowSpan: true,
      width: 80,
      fixed: 'left',
      render: v => v || '-',
    },
    {
      title: t('GPU UUID / 型号'),
      field: 'dev_gpu_name',
      canHide: true,
      render: (v, row) => (
        <Field value={<Resource>{row?.dev_gpu_uuid || '-'}</Resource>} label={v || '-'} />
      ),
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
      title: t('vGPU 数量'),
      field: 'gpu_device_shared_num',
      canHide: true,
      render: (v, row: any) => {
        return (
          <CollapseWrap onClick={() => handleExpand(row)}>
            <span className="num">{v || '-'}</span>
            {!!row?.vgpu_core_list?.length && (
              <>
                {expandedRowKeys?.includes(row?.dev_gpu_uuid) ? (
                  <ChevronUp size={18} cursor="pointer" />
                ) : (
                  <ChevronDown size={18} cursor="pointer" />
                )}
              </>
            )}
          </CollapseWrap>
        );
      },
    },
    {
      title: t('GPU 显存使用率'),
      field: 'gpu_node_memory_percentage',
      canHide: true,
      render: v => (
        <Field
          value={
            <Resource>
              <span>{toPercentage(+v)}</span>
            </Resource>
          }
        />
      ),
    },
    {
      title: t('可分配显存'),
      field: 'gpu_device_memory_limit',
      canHide: true,
      render: (value, row) => (
        <Field
          value={
            <Resource>{`${(value || 0) - (row?.gpu_device_memory_allocated || 0)} GB`}</Resource>
          }
          label={`${row?.gpu_device_memory_allocated}/${value || 0} GB`}
        />
      ),
    },
    {
      title: t('可分配算力'),
      field: 'gpu_device_core_limit',
      render: (value, row) => (
        <Field
          value={<Resource>{`${(value || 0) - (row?.gpu_device_core_allocated || 0)}`}</Resource>}
          label={`${row?.gpu_device_core_allocated || 0}/${value || 0}`}
        />
      ),
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
        if (group[0]?.dev_gpu_uuid) {
          group[0].gpu_num++;
        }
        group.push(item);
      } else {
        dataGroup.set(item.gpu_node_id, [{ ...item, rowspan: 1, gpu_num: 1 }]);
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
      url="/kapis/aicp.kubesphere.io/v1/gpu/list_vgpu_dev_info"
      toolbarLeft={renderTabs()}
      columns={columns}
      serverDataFormat={formatServerData}
      showFooter={false}
      expandedRowKeys={expandedRowKeys}
      expandedRowRender={row => {
        return (
          <BaseTable>
            <table>
              <thead>
                <tr>
                  <th>已分配显存</th>
                  <th>占卡总显存</th>
                  <th>占卡总算力</th>
                  <th>命名空间</th>
                  <th>pod</th>
                </tr>
              </thead>
              <tbody>
                {row?.original?.vgpu_core_list?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      {item?.vgpu_pods_device_allocated
                        ? `${item?.vgpu_pods_device_allocated}G`
                        : '-'}
                    </td>
                    <td>
                      {item?.vgpu_memory_percentage
                        ? toPercentage(+item?.vgpu_memory_percentage)
                        : '-'}
                    </td>
                    <td>
                      {item?.vgpu_core_percentage ? toPercentage(+item?.vgpu_core_percentage) : '-'}
                    </td>
                    <td>{item?.podnamespace}</td>
                    <td>{item?.podname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BaseTable>
        );
      }}
    />
  );
}

export default VGpuTable;

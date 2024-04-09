import React, { useRef, useState, ReactNode, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { isEmpty, get } from 'lodash';

import { Tooltip, Field, notify } from '@kubed/components';
import {
  request,
  ClusterDetail,
  Column,
  DataTable,
  StatusIndicator,
  cpuFormat,
  memoryFormat,
  TableRef,
  nodeStore,
  kubekeyStore,
  FormattedNode,
  monitorStore,
  useBatchActions,
  useTableActions,
  getNodeStatus,
  getDisplayName,
  getValueByUnit,
  hideGPUByLicense,
  KubectlModal,
  useItemActions,
  useCommonActions,
  hasClusterModule,
} from '@ks-console/shared';
import { useStore } from '@kubed/stook';
import { Nodes, Exclamation, Start, Stop, Trash, Terminal } from '@kubed/icons';
import { FieldLabel, Resource, Taints } from './styles';
import { TaintBatchModal } from '../TaintModal/TaintBatchModal';
import AddNodeModal from '../AddNode';
import {
  authKey,
  MetricTypes,
  transformRequestParams,
  toPercentage,
  getUnschedulable,
  getReady,
} from './contants';

interface Props {
  renderTabs: () => React.ReactNode;
  setShowTab: (v: boolean) => void;
  tab: string;
}

const hasExtensionModuleAnnotation = (module: string, annotation: string) => {
  return (
    get(
      globals,
      `ksConfig.enabledExtensionModulesStatus.${module}.annotations['${annotation}']`,
      'false',
    ) === 'true'
  );
};

const {
  getResourceUrl,
  mapper: nodeMapper,
  nodeCordon,
  nodeUncordon,
  useBatchPatchTaints,
  fetchList,
} = nodeStore;

const { useKubeKeyUpdateMutation } = kubekeyStore;
const { useMonitorStore, apiVersion } = monitorStore;

const renderTaintsTip = (data: Record<string, string>[]) => (
  <div>
    <div>{t('TAINTS')}:</div>
    <div>
      {data.map(item => {
        const text = `${item.key}=${item.value || ''}:${item.effect}`;
        return (
          <div style={{ wordBreak: 'break-all' }} key={text}>
            {text}
          </div>
        );
      })}
    </div>
  </div>
);

function Node({ renderTabs, setShowTab, tab }: Props) {
  const params: Record<string, any> = useParams();
  const { cluster } = params;
  const [currentCluster] = useStore<ClusterDetail>('cluster');
  const [, setNodeCount] = useStore('nodeCount', 0);

  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [taintVisible, setTaintVisible] = useState<boolean>(false);
  const [kubeCtlVisible, setKubeCtlVisible] = useState<boolean>(false);

  const [kubeCtlParams, setKubeCtlParams] = useState<Record<string, any>>({});
  const [selectedNodes, setSelectedNodes] = useState<FormattedNode[]>([]);

  const url = getResourceUrl(params);
  const getApi = () => `${apiVersion({})}/node_metrics`;
  const { fetchMetrics } = useMonitorStore({ getApiFn: getApi });

  const { data: { data: tableList = [], total: totalCount } = {} } = useQuery(
    [`cluster-${cluster}-nodes`],
    () => {
      const queryParams = transformRequestParams({ ...params, filters: [], pageIndex: -1 });
      return fetchList(queryParams);
    },
  );

  const tableRef = useRef<TableRef>();

  const { data: computedGroup, refetch: computedGroupRefetch } = useQuery(
    ['computed_group', tableList],
    () => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/get_compute_group_by_node_ids?';
      const ids = (tableList || [])?.map((node: any) => node.name);
      const idsStr = ids?.map((id: string) => `&node_ids=${id}`).join('');
      return request(`${url}${idsStr}`).then(res => {
        if ((res as any)?.ret_code === 0) {
          const transformedData = (res?.data ?? []).reduce((result: any, item: any) => {
            const { gpu_node_id, ...rest } = item;
            result[gpu_node_id] = { gpu_node_id, ...rest };
            return result;
          }, {});
          return transformedData;
        }
      });
    },
    { enabled: !!tableList?.length },
  );

  const { data: listData, refetch: listRefetch } = useQuery(
    ['listdata', tableList],
    () => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/list_node_static_info';
      return request(url).then(res => {
        if ((res as any)?.ret_code === 0) {
          const transformedData = (res?.data ?? []).reduce((result: any, item: any) => {
            const { node_id, ...rest } = item;
            result[node_id] = { node_id, ...rest };
            return result;
          }, {});
          return transformedData;
        }
      });
    },
    { enabled: tab === 'list' },
  );

  const { data: monitorData } = useQuery(
    ['monitor', tableList],
    () => {
      if (hasClusterModule(cluster, 'whizard-monitoring') && !isEmpty(tableList)) {
        return fetchMetrics({
          cluster,
          resources: tableList.map((node: any) => node.name),
          metrics: Object.values(hideGPUByLicense(MetricTypes, cluster)),
          last: true,
        });
      } else {
        return {
          data: undefined,
          isLoading: false,
        };
      }
    },
    {
      staleTime: 60 * 1000,
    },
  );

  const getLastValue = (node: any, type: string, unit: string) => {
    const metricsData: Record<string, string> = monitorData || {};
    const result = get(metricsData[type], 'data.result') || [];
    const metrics = result.find((item: any) => get(item, 'metric.node') === node.name);
    return getValueByUnit(get(metrics, 'value[1]', 0), unit);
  };

  const getRecordMetrics = (record: any, configs: Record<string, any>[]) => {
    const metrics: Record<string, any> = {};
    configs.forEach(cfg => {
      metrics[cfg.type] = getLastValue(
        record,
        hideGPUByLicense(MetricTypes, cluster)[cfg.type],
        cfg.unit,
      );
    });
    return metrics;
  };

  const renderCPUTooltip = (record: any) => {
    const metrics = getRecordMetrics(record, [
      { type: 'allocatable_cpu_total' },
      { type: 'allocatable_cpu_utilisation' },
      { type: 'limit_cpu_total' },
      { type: 'limit_cpu_utilisation' },
    ]);
    const content = (
      <p>
        {cpuFormat(metrics.limit_cpu_total) === 1
          ? t('CPU_LIMIT_SI', {
              core: cpuFormat(metrics.limit_cpu_total),
              percent: toPercentage(metrics.limit_cpu_utilisation),
            })
          : t('CPU_LIMIT_PL', {
              core: cpuFormat(metrics.limit_cpu_total),
              percent: toPercentage(metrics.limit_cpu_utilisation),
            })}
      </p>
    );
    return (
      <Tooltip content={content} placement="top">
        <Field
          value={
            cpuFormat(metrics.allocatable_cpu_total) === 1
              ? t('CPU_REQUEST_SI', {
                  core: cpuFormat(metrics.allocatable_cpu_total),
                  percent: toPercentage(metrics.allocatable_cpu_utilisation),
                })
              : t('CPU_REQUEST_PL', {
                  core: cpuFormat(metrics.allocatable_cpu_total),
                  percent: toPercentage(metrics.allocatable_cpu_utilisation),
                })
          }
          label={t('RESOURCE_REQUEST')}
        />
      </Tooltip>
    );
  };

  const renderMemoryTooltip = (record: any) => {
    const metrics = getRecordMetrics(record, [
      { type: 'allocatable_memory_total' },
      { type: 'allocatable_memory_utilisation' },
      { type: 'limits_memory_total' },
      { type: 'limits_memory_utilisation' },
    ]);
    const content = (
      <p>
        {t('MEMORY_LIMIT_VALUE', {
          gib: memoryFormat(metrics.limits_memory_total, 'Gi'),
          percent: toPercentage(metrics.limits_memory_utilisation),
        })}
      </p>
    );
    return (
      <Tooltip content={content} placement="top">
        <Field
          value={t('MEMORY_REQUEST_VALUE', {
            gib: memoryFormat(metrics.allocatable_memory_total, 'Gi'),
            percent: toPercentage(metrics.allocatable_memory_utilisation),
          })}
          label={t('RESOURCE_REQUEST')}
        />
      </Tooltip>
    );
  };

  const callback = () => {
    tableRef?.current?.refetch();
    computedGroupRefetch();
    if (tab === 'list') {
      listRefetch();
    }
  };

  const { del } = useCommonActions({
    store: nodeStore,
    params: { cluster },
    callback,
  });

  const renderItemAction = useItemActions({
    authKey,
    params,
    actions: [
      {
        key: 'uncordon',
        icon: <Start />,
        text: t('UNCORDON'),
        action: 'edit',
        show: record => record.importStatus === 'success' && getUnschedulable(record),
        onClick: (e, record) => {
          nodeUncordon(record).then(() => callback());
        },
      },
      {
        key: 'cordon',
        icon: <Stop />,
        text: t('CORDON'),
        action: 'edit',
        show: record => record.importStatus === 'success' && !getUnschedulable(record),
        onClick: (e, record) => {
          nodeCordon(record).then(() => callback());
        },
      },
      {
        key: 'terminal',
        icon: <Terminal />,
        text: t('OPEN_TERMINAL'),
        action: 'edit',
        show: record => record.importStatus === 'success' && getReady(record),
        onClick: (e, record) => {
          setKubeCtlParams({ cluster, nodename: record.name, isEdgeNode: true });
          setKubeCtlVisible(true);
        },
      },
      {
        key: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        action: 'delete',
        show: item => item.importStatus === 'failed',
        onClick: (e, record: any) => {
          del({ ...record, type: 'CLUSTER_NODE' });
        },
      },
    ],
  });

  const renderTableAction = useTableActions({
    authKey,
    params,
    actions: [
      {
        key: 'add',
        text: t('ADD'),
        action: 'create',
        props: {
          color: 'secondary',
          shadow: true,
        },
        onClick: () => {
          setAddVisible(true);
        },
      },
    ],
  });

  const renderBatchAction = useBatchActions({
    authKey,
    params,
    actions: [
      {
        key: 'taint',
        text: t('EDIT_TAINTS'),
        action: 'edit',
        onClick: () => {
          const selectedFlatRows = tableRef?.current?.getSelectedFlatRows() || [];
          setSelectedNodes(selectedFlatRows as FormattedNode[]);
          setTaintVisible(true);
        },
      },
    ],
  });

  const { mutate: mutateNodesTaint, isLoading: isNodesTaintLoading } = useBatchPatchTaints({
    onSuccess: () => {
      callback();
      notify.success(t('UPDATE_SUCCESSFUL'));
      setTaintVisible(false);
    },
  });

  const { mutate: mutateKKUpdate, isLoading: isKKUpdateLoading } = useKubeKeyUpdateMutation({
    detail: {
      name: currentCluster.kkName,
      ...params,
    },
    onSuccess: () => {
      callback();
      setAddVisible(false);
      notify.success(t('UPDATE_SUCCESSFUL'));
    },
  });

  function renderMonitorColumns(): Column[] {
    if (hasClusterModule(cluster, 'whizard-monitoring')) {
      return [
        {
          title: t('CPU_USAGE'),
          field: 'cpu',
          canHide: true,
          render: (value, row) => {
            const metrics = getRecordMetrics(row, [
              {
                type: 'cpu_used',
                unit: 'Core',
              },
              {
                type: 'cpu_total',
                unit: 'Core',
              },
              {
                type: 'cpu_utilisation',
              },
            ]);
            return (
              <Field
                value={
                  <Resource>
                    <span>{toPercentage(metrics.cpu_utilisation)}</span>
                    {metrics.cpu_utilisation >= 0.9 && <Exclamation />}
                  </Resource>
                }
                label={`${metrics.cpu_used}/${metrics.cpu_total} ${t('CORE_PL')}`}
              />
            );
          },
        },
        {
          title: t('MEMORY_USAGE'),
          field: 'memory',
          canHide: true,
          render: (value, row) => {
            const metrics = getRecordMetrics(row, [
              {
                type: 'memory_used',
                unit: 'Gi',
              },
              {
                type: 'memory_total',
                unit: 'Gi',
              },
              {
                type: 'memory_utilisation',
              },
            ]);
            return (
              <Field
                value={
                  <Resource>
                    <span>{toPercentage(metrics.memory_utilisation)}</span>
                    {metrics.memory_utilisation >= 0.9 && <Exclamation />}
                  </Resource>
                }
                label={`${metrics.memory_used}/${metrics.memory_total} GiB`}
              />
            );
          },
        },
        ...(hasExtensionModuleAnnotation(
          'whizard-monitoring',
          'monitoring.kubesphere.io/enable-gpu-monitoring',
        ) && hasClusterModule(cluster, 'whizard-monitoring')
          ? ([
              {
                title: t('GPU utilization'),
                field: 'gpu',
                canHide: true,
                render: (value, row) => {
                  const metrics = getRecordMetrics(row, [
                    {
                      type: 'gpu_used',
                      unit: 'Core',
                    },
                    {
                      type: 'gpu_total',
                      unit: 'Core',
                    },
                    {
                      type: 'gpu_utilization',
                    },
                  ]);
                  return (
                    <Field
                      value={
                        <Resource>
                          <span>{toPercentage(metrics.gpu_utilization)}</span>
                          {metrics.gpu_utilization >= 0.9 && <Exclamation />}
                        </Resource>
                      }
                      // label={`${metrics.gpu_used}/${metrics.gpu_total} GPU`}
                    />
                  );
                },
              },
              {
                title: t('GPU_MEMORY_USAGE'),
                field: 'gpu_memory',
                canHide: true,
                render: (value, row) => {
                  const metrics = getRecordMetrics(row, [
                    {
                      type: 'gpu_memory_used',
                      unit: 'Gi',
                    },
                    {
                      type: 'gpu_memory_total',
                      unit: 'Gi',
                    },
                    {
                      type: 'gpu_memory_utilization',
                    },
                  ]);
                  return (
                    <Field
                      value={
                        <Resource>
                          <span>{toPercentage(metrics.gpu_memory_utilization)}</span>
                          {metrics.gpu_memory_utilization >= 0.9 && <Exclamation />}
                        </Resource>
                      }
                      label={`${metrics.gpu_memory_used}/${metrics.gpu_memory_total} GiB`}
                    />
                  );
                },
              },
              {
                title: t('Physical disk utilization'),
                field: 'disk',
                canHide: true,
                render: (value, row) => {
                  const metrics = getRecordMetrics(row, [
                    {
                      type: 'node_disk_size_capacity',
                      unit: 'GiB',
                    },
                    {
                      type: 'node_disk_size_usage',
                      unit: 'GiB',
                    },
                    {
                      type: 'node_disk_size_utilisation',
                    },
                  ]);
                  return (
                    <Field
                      value={
                        <Resource>
                          <span>{toPercentage(metrics.node_disk_size_utilisation)}</span>
                          {metrics.node_disk_size_utilisation >= 0.9 && <Exclamation />}
                        </Resource>
                      }
                      label={`${getValueByUnit(
                        metrics.node_disk_size_usage,
                        'GB',
                      )}/${getValueByUnit(metrics.node_disk_size_capacity, 'GB')} GiB`}
                    />
                  );
                },
              },
            ] as Column[])
          : []),
        {
          title: t('POD_PL'),
          field: 'pods',
          canHide: true,
          render: (value, row) => {
            const metrics = getRecordMetrics(row, [
              {
                type: 'pod_used',
              },
              {
                type: 'pod_total',
              },
            ]);
            const uitilisation = metrics.pod_total ? metrics.pod_used / metrics.pod_total : 0;
            return (
              <Field
                value={`${toPercentage(uitilisation)}`}
                label={`${metrics.pod_used}/${metrics.pod_total}`}
              />
            );
          },
        },
        {
          title: t('ALLOCATED_CPU'),
          field: 'allocated_resources_cpu',
          canHide: true,
          render: (value, row) => renderCPUTooltip(row),
        },
        {
          title: t('ALLOCATED_MEMORY'),
          field: 'allocated_resources_memory',
          canHide: true,
          render: (value, row) => renderMemoryTooltip(row),
        },
      ] as Column[];
    }

    return [] as Column[];
  }

  const renderListColumns = () => {
    return [
      {
        title: t('CPU Model'),
        field: 'node_cpu_model',
        canHide: true,
        render: (_v, row) => get(listData, [row.name, 'node_cpu_model'], '-'),
      },
      {
        title: t('CPU cores'),
        field: 'node_cpu',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_cpu']);
          return value ? `${value} ${t('Core')}` : '-';
        },
      },
      {
        title: t('Memory'),
        field: 'node_memory',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_memory']);
          return value ? `${value}G` : '-';
        },
      },
      {
        title: t('GPU Model'),
        field: 'node_gpu_model',
        render: (_v, row) => get(listData, [row.name, 'node_gpu_model'], '-'),
      },
      {
        title: t('GPU Memory'),
        field: 'node_gpu_memory',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_gpu_memory']);
          return value ? `${value}G` : '-';
        },
      },
      {
        title: t('Number of GPU Cards'),
        field: 'node_gpu',
        render: (_v, row) => get(listData, [row.name, 'node_gpu'], '-'),
      },
      {
        title: t('Compute IB Network Card Configuration'),
        field: 'node_ib_bw_compute',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_ib_bw_compute']);
          return value ? `${value}G` : '-';
        },
      },
      {
        title: t('Number of Compute IB Network Cards'),
        field: 'node_ib_count_compute',
        render: (_v, row) => get(listData, [row.name, 'node_ib_count_compute'], '-'),
      },
      {
        title: t('Storage IB Network Card Configuration'),
        field: 'node_ib_bw_storage',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_ib_bw_storage']);
          return value ? `${value}G` : '-';
        },
      },
      {
        title: t('Number of Storage IB Network Cards'),
        field: 'node_ib_count_storage',
        canHide: true,
        render: (_v, row) => {
          const value = get(listData, [row.name, 'node_ib_count_storage']);
          return value ? `${value}G` : '-';
        },
      },
    ] as Column[];
  };

  const renderColumns = () => {
    if (tab === 'monitor') {
      return renderMonitorColumns();
    }
    return renderListColumns();
  };

  const columns: Column[] = [
    {
      title: t('Node Name'),
      field: 'name',
      searchable: true,
      sortable: true,
      render: (value, row) => (
        <Field
          value={<Link to={value}>{getDisplayName(row)}</Link>}
          avatar={<Nodes size={40} />}
          label={<FieldLabel>{row.ip || '-'}</FieldLabel>}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'status',
      canHide: true,
      render: (value, row) => {
        const status = getNodeStatus(row);
        const taints = row.taints;
        return (
          <div>
            <StatusIndicator type={status}>
              {t(`NODE_STATUS_${status.toUpperCase()}`)}
            </StatusIndicator>
            {!isEmpty(taints) && row.importStatus === 'success' && (
              <Tooltip content={renderTaintsTip(taints)}>
                <Taints>{taints.length}</Taints>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: t('ROLE'),
      field: 'role',
      canHide: true,
      render: roles => (roles.indexOf('master') === -1 ? t('WORKER') : t('CONTROL_PLANE')),
    },
    {
      title: t('Belonging Compute Pool'),
      field: 'gpu_node_compute_group',
      canHide: true,
      render: (_v, row) => {
        return computedGroup?.[row?.name]?.gpu_node_compute_group || '-';
      },
    },
    ...renderColumns(),
    {
      id: 'more',
      title: ' ',
      render: (value, row) => renderItemAction(value, row),
    },
  ];

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      ...serverData,
      totalItems: serverData.totalItems,
    };
  };

  useEffect(() => {
    if (totalCount !== undefined) {
      setNodeCount(totalCount);
    }
  }, [totalCount]);

  return (
    <>
      <DataTable
        ref={tableRef}
        url={url}
        columns={hideGPUByLicense(columns, cluster)}
        tableName="nodes"
        rowKey="name"
        transformRequestParams={transformRequestParams}
        serverDataFormat={formatServerData}
        batchActions={renderBatchAction() as ReactNode}
        toolbarRight={currentCluster.kkName ? renderTableAction() : null}
        format={(item: any) => ({ ...params, ...nodeMapper(item) })}
        initialState={{ sortBy: [{ id: 'name', desc: false }] }}
        toolbarLeft={renderTabs()}
        onSelect={(_v: any, rows: any) => {
          setShowTab?.(!rows?.length);
        }}
      />

      {taintVisible && (
        <TaintBatchModal
          visible={taintVisible}
          nodes={selectedNodes}
          onOk={mutateNodesTaint}
          confirmLoading={isNodesTaintLoading}
          onCancel={() => setTaintVisible(false)}
        />
      )}
      {addVisible && (
        <AddNodeModal
          visible={addVisible}
          onOk={mutateKKUpdate}
          confirmLoading={isKKUpdateLoading}
          addAfterCreate={true}
          onCancel={() => setAddVisible(false)}
        />
      )}
      {kubeCtlVisible && (
        <KubectlModal
          visible={kubeCtlVisible}
          title={kubeCtlParams.nodename}
          params={kubeCtlParams}
          onCancel={() => setKubeCtlVisible(false)}
        />
      )}
    </>
  );
}

export default Node;

import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import {
  request,
  Column,
  DataTable,
  TableRef,
  nodeStore,
  useItemActions,
  useCommonActions,
  KubectlModal,
} from '@ks-console/shared';
import { Start, Stop, Terminal, Substract, Trash } from '@kubed/icons';
import { Button } from '@kubed/components';

import AddNodes from '../../add-nodes';
import RemoveNodes from './remove';
import getColumns from './constants';
import { useDetailPage } from '../provider';
import {
  authKey,
  getReady,
  getUnschedulable,
  transformRequestParams,
} from '../../../NodeManage/contants';

const {
  mapper,
  nodeCordon,
  nodeUncordon,
  getResourceUrl,
} = nodeStore;

function NodeManage() {
  const ref = useRef<TableRef>();
  const params: Record<string, any> = useParams();
  const { pool, getPool } = useDetailPage();
  const { cluster } = params;

  const [record, setRecord] = React.useState<any>();
  const [visible, setVisible] = React.useState('');
  const [kubeCtlParams, setKubeCtlParams] = React.useState<Record<string, any>>({});

  /**
   * 获取监控信息
   */
  const { data: listData, refetch: listNodeStatic } = useQuery(
    ['list_data', []],
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
  );

  const onRefresh = () => {
    getPool();
    listNodeStatic();
    ref?.current?.refetch();
  };

  const onClose = (refresh?: boolean) => {
    setVisible('');
    setRecord(undefined);
    setKubeCtlParams({});
    refresh && onRefresh();
  };

  const { del } = useCommonActions({
    store: nodeStore,
    params: { cluster },
    callback: onRefresh,
  });

  const renderItemAction = useItemActions({
    authKey,
    params,
    actions: [
      {
        key: 'remove',
        icon: <Substract />,
        text: t('Remove nodes'),
        action: 'remove',
        show: true,
        onClick: (e, record) => {
          setRecord(record);
          setVisible('remove');
        },
      },
      {
        key: 'uncordon',
        icon: <Start />,
        text: t('UNCORDON'),
        action: 'edit',
        show: record => record.importStatus === 'success' && getUnschedulable(record),
        onClick: (e, record) => nodeUncordon(record).then(onRefresh),
      },
      {
        key: 'cordon',
        icon: <Stop />,
        text: t('CORDON'),
        action: 'edit',
        show: record => record.importStatus === 'success' && !getUnschedulable(record),
        onClick: (e, record) => nodeCordon(record).then(onRefresh),
      },
      {
        key: 'terminal',
        icon: <Terminal />,
        text: t('OPEN_TERMINAL'),
        action: 'edit',
        show: record => record.importStatus === 'success' && getReady(record),
        onClick: (e, record) => {
          setKubeCtlParams({ cluster: cluster, nodename: record.name, isEdgeNode: true });
          setVisible('terminal');
        },
      },
      {
        key: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        action: 'delete',
        show: item => item.importStatus === 'failed',
        onClick: (e, record: any) => del({ ...record, type: 'CLUSTER_NODE' }),
      },
    ],
  });

  const columns: Column[] = [
    ...getColumns(listData, cluster),
    {
      id: 'more',
      title: ' ',
      field: 'actions',
      render: renderItemAction,
    },
  ];

  if (!pool) return null;

  return (
    <>
      <DataTable
        ref={ref}
        url={getResourceUrl(params)}
        rowKey="name"
        tableName="nodes"
        parameters={{
          labelSelector: `aicp.group/aipods_type=${pool?.aipods_type}`,
        }}
        columns={columns}
        transformRequestParams={transformRequestParams}
        format={(item: any) => ({ ...params, ...mapper(item) })}
        toolbarRight={(
          <Button color="secondary" onClick={() => setVisible('create')} shadow>
            {t('Add nodes')}
          </Button>
        )}
      />
      {
        visible === 'create' ? (
          <AddNodes pool={pool} onClose={onClose} />
        ) : visible === 'remove' ? (
          <RemoveNodes pool={pool} node_name={record?.name || ''} onClose={onClose} />
        ) : visible === 'terminal' ? (
          <KubectlModal
            visible
            title={kubeCtlParams.nodename}
            params={kubeCtlParams}
            onCancel={() => onClose()}
          />
        ) : null
      }
    </>
  );
};

export default NodeManage;

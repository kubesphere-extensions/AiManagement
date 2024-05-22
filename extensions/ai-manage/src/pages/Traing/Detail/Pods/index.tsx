import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { get, orderBy } from 'lodash';
import { useStore } from '@kubed/stook';
import { Topology } from '@kubed/icons';
import {
  DataTable,
  TableRef,
  Column,
  formatTime,
  StatusIndicator,
  transformRequestParams,
} from '@ks-console/shared';
import { Field } from '@kubed/components';

function Pods() {
  const { id, endpoint } = useParams();
  const [detail] = useStore('trainingDetail');
  const tableRef = useRef<TableRef>();

  const userId = detail?.user_id?.toLocaleLowerCase?.();

  const formatServerData = (serverData: Record<string, any>) => {
    return {
      items: get(serverData, 'data', []),
      totalItems: get(serverData, 'counts', 0),
    };
  };

  const handleTransformRequestParams = (params: any) => {
    const sortBy = get(params.sortBy, [0], {});
    const sortParams = {
      order_by: sortBy?.id !== 'createTime' ? sortBy?.id : undefined,
      reverse: sortBy?.id !== 'createTime' ? sortBy?.desc : undefined,
    };
    const p = transformRequestParams(params);
    return {
      ...p,
      ascending: undefined,
      sortBy: undefined,
      offset: ((p?.page ?? 1) - 1) * (p?.limit ?? 10),
      ...sortParams,
    };
  };

  const columns: Column[] = [
    {
      title: t('容器组名称 / IP地址'),
      field: 'name',
      canHide: true,
      render: (v, row) => {
        const name = get(row, 'metadata.name', '-');
        const ID = get(row, 'status.podIP', '-');
        return <Field value={name} label={ID}></Field>;
      },
    },
    {
      title: t('STATUS'),
      field: 'status',
      canHide: true,
      render: (v, row) => {
        const status = get(row, 'status.phase');
        return <StatusIndicator type={status}>{t(`${status.toUpperCase()}`)}</StatusIndicator>;
      },
    },
    {
      title: t('Node Name'),
      field: 'nodeName',
      render: (_v, row) => {
        const nodeName = get(row, 'spec.nodeName', '-');
        return nodeName;
      },
    },
    {
      title: t('Create time'),
      field: 'create_time',
      render: (_v, row) => {
        const time = get(row, 'metadata.creationTimestamp', '');
        return time ? formatTime(time) : '-';
      },
    },
    {
      title: t('更新时间'),
      field: 'update_time',
      render: (_v, row) => {
        const [condition] = orderBy(row.status.conditions, ['lastTransitionTime'], ['desc']);
        const time = get(condition, 'lastTransitionTime', '');
        return time ? formatTime(time) : '-';
      },
    },
  ];

  return (
    <div>
      <DataTable
        ref={tableRef}
        showToolbar={false}
        tableName="trains"
        rowKey="uuid"
        placeholder={t('Please enter the task name to search')}
        // eslint-disable-next-line max-len
        url={`/kapis/aicp.kubesphere.io/v1/trains/namespaces/${userId}/endpoints/${endpoint}/trains/${id}/pods`}
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Topology size={48} />,
          // title: t('No distributed training tasks found'),
        }}
      />
    </div>
  );
}

export default Pods;

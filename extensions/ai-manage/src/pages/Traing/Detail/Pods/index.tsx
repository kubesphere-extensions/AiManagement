import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash';
import { Topology } from '@kubed/icons';
import {
  DataTable,
  TableRef,
  Column,
  formatTime,
  StatusIndicator,
  transformRequestParams,
} from '@ks-console/shared';

function Pods() {
  const { id, endpoint } = useParams();
  const tableRef = useRef<TableRef>();

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
      title: t('Image'),
      field: 'image',
      canHide: true,
      render: v => v || '-',
    },
  ];

  return (
    <div>
      <DataTable
        ref={tableRef}
        tableName="trains"
        rowKey="uuid"
        placeholder={t('Please enter the task name to search')}
        // eslint-disable-next-line max-len
        url={`/kapis/aicp.kubesphere.io/v1/trains/namespaces/ALL/endpoints/${endpoint}/trains/${id}/pods`}
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Topology size={48} />,
          title: t('No distributed training tasks found'),
        }}
      />
    </div>
  );
}

export default Pods;

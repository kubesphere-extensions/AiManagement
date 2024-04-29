import React, { useRef } from 'react';
import { Banner } from '@kubed/components';
import { get } from 'lodash';
import {
  DataTable,
  TableRef,
  Column,
  StatusIndicator,
  transformRequestParams,
} from '@ks-console/shared';
import { Waring2 } from '../../icons';

const getColumns = (): Column[] => {
  return [
    {
      title: t('Error Code'),
      field: 'gpu_err_id',
      canHide: true,
      searchable: true,
      render: v => v || '-',
    },
    {
      title: t('XID'),
      field: 'gpu_xid',
      canHide: true,
      render: v => v || '-',
    },
    {
      title: t('Error level'),
      field: 'gpu_err_priority',
      canHide: true,
      render: (v: string) => {
        const status = v === 'Critical' ? 'Warning' : v === 'Warning' ? 'default' : 'error';
        return (
          <div>
            <StatusIndicator type={status}>{t(v)}</StatusIndicator>
          </div>
        );
      },
    },
    {
      title: t('Error Description'),
      field: 'gpu_err_desc',
      canHide: true,
      render: v => v || '-',
      width: 500,
    },
    {
      title: t('Recommendations and measures'),
      field: 'gpu_suggestions',
      canHide: true,
      render: v => v || '-',
      width: 400,
    },
  ];
};

function Xid() {
  const tableRef = useRef<TableRef>();
  const columns = getColumns();

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
      gpu_err_id: undefined,
      offset: ((p?.page ?? 1) - 1) * (p?.limit ?? 10),
      search_word: p.gpu_err_id,
      ...sortParams,
    };
  };

  return (
    <div>
      <Banner
        className="mb12"
        icon={<Waring2 />}
        title="Error Code & NVIDIA XidError & Violations"
        description={t('Xid Desc')}
      />
      <DataTable
        ref={tableRef}
        tableName="xid"
        rowKey="gpu_err_id"
        placeholder={t('Please enter a description of the error to search')}
        url="/kapis/aicp.kubesphere.io/v1/gpu/list_gpu_error_codes"
        transformRequestParams={handleTransformRequestParams}
        columns={columns}
        simpleSearch
        serverDataFormat={formatServerData}
        emptyOptions={{
          withoutTable: true,
          image: <Waring2 size={48} />,
          title: t('No error message'),
        }}
        showFooter={false}
      />
    </div>
  );
}

export default Xid;

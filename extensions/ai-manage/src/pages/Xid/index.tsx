import React, { useRef, useState } from 'react';
import { Banner, Button, Dropdown, Menu, MenuItem } from '@kubed/components';
import { get } from 'lodash';
import { createGlobalStyle } from 'styled-components';
import { More, Pen } from '@kubed/icons';
import {
  DataTable,
  TableRef,
  Column,
  StatusIndicator,
  transformRequestParams,
} from '@ks-console/shared';
import { useDisclosure } from '@kubed/hooks';
import { Waring2 } from '../../icons';
import { getStrategy } from '../../utils';
import ModifyXid from './ModifyXid';

const GlobalStyle = createGlobalStyle`
  body .kubed-select-dropdown {
    z-index: 3000 !important;
  }
`;

const getColumns = ({ MoreActions }: any): Column[] => {
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
      title: t('故障策略'),
      field: 'gpu_err_strategy',
      canHide: true,
      render: v => (v ? getStrategy(v) : '-'),
    },
    {
      title: t('Error level'),
      field: 'gpu_err_priority',
      canHide: true,
      render: (v: string) => {
        const status = v === 'Critical' ? 'Warning' : v === 'Warning' ? 'ready' : 'error';
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
    {
      id: 'more',
      title: ' ',
      render: (_, row) => (
        <Dropdown placement="bottom-end" content={<MoreActions row={row} />}>
          <Button variant="text" radius="lg">
            <More size={16} />
          </Button>
        </Dropdown>
      ),
    },
  ];
};

function Xid() {
  const tableRef = useRef<TableRef>();
  const createModal = useDisclosure();
  const [info, setInfo] = useState({});

  const MoreActions = ({ row }: { row: any }) => {
    const handle = () => {
      if (row.fault_status === '1') return;
      createModal.open();
      setInfo(row);
    };

    return (
      <Menu>
        <MenuItem icon={<Pen />} onClick={handle}>
          {t('编辑错误码')}
        </MenuItem>
      </Menu>
    );
  };

  const columns = getColumns({ MoreActions });

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
      <GlobalStyle />
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
      {createModal.isOpen && (
        <ModifyXid
          info={info}
          onCancel={() => createModal.close()}
          visible={createModal.isOpen}
          onSuccess={() => {
            tableRef.current?.refetch();
            createModal.close();
          }}
        />
      )}
    </div>
  );
}

export default Xid;

import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { Nodes } from '@kubed/icons';
import { Button, Field } from '@kubed/components';
import {
  Column,
  DataTable,
  StatusIndicator,
  nodeStore,
  getNodeStatus,
  getDisplayName,
} from '@ks-console/shared';

import { PlaceHolder } from './style';
import { transformRequestParams } from '../utils';

interface Props {
  loading: boolean;
  setCurrent?: (current: number) => void;
  onCancel: () => void;
  onSubmit: (node: string[]) => void;
  okText?: string;
  parameters?: Record<string, any>;
};

const FormWrapper = styled.div`
  padding: 12px 20px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
`;

const getColumns = (): Column[] => {
  return [
    {
      title: t('Node Name'),
      field: 'name',
      searchable: true,
      sortable: true,
      render: (_, row) => (
        <Field
          value={getDisplayName(row)}
          avatar={<Nodes size={40} />}
          label={<PlaceHolder>{row.ip || '-'}</PlaceHolder>}
        />
      ),
    },
    {
      title: t('STATUS'),
      field: 'status',
      canHide: true,
      render: (_, row) => {
        const status = getNodeStatus(row);

        return (
          <StatusIndicator type={status}>
            {t(`NODE_STATUS_${status.toUpperCase()}`)}
          </StatusIndicator>
        );
      },
    },
    {
      title: t('ROLE'),
      field: 'role',
      canHide: true,
      render: roles => (roles.indexOf('master') === -1 ? t('WORKER') : t('CONTROL_PLANE')),
    },
  ];
};

const NodeSelectors = ({
  loading, parameters, okText = 'CREATE', onCancel, setCurrent, onSubmit,
}: Props) => {
  const params = useParams() || {};
  const [nodes, setNodes] = React.useState<string[]>([]);

  const { mapper, getResourceUrl } = nodeStore;

  return (
    <>
      <FormWrapper>
        <DataTable
          rowKey="name"
          selectType="checkbox"
          tableName="select_nodes"
          url={getResourceUrl()}
          columns={getColumns()}
          parameters={parameters}
          format={(item: any) => ({ ...params, ...mapper(item) })}
          onSelect={(rowKeys) => setNodes(Object.keys(rowKeys))}
          transformRequestParams={transformRequestParams}
        />
      </FormWrapper>
      <div className="kubed-modal-footer">
        <Wrapper>
          {
            setCurrent ? (
              <Button onClick={() => setCurrent(0)}>
                {t('PREVIOUS')}
              </Button>
            ) : <div />
          }
          <div />
          <Button onClick={onCancel}>{t('CANCEL')}</Button>
          <Button
            color="secondary"
            loading={loading}
            onClick={() => onSubmit(nodes)}
          >
            {t(okText)}
          </Button>
        </Wrapper>
      </div>
    </>
  );
};

export default NodeSelectors;

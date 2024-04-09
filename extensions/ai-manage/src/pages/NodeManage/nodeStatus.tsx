import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Icon, Text } from '@ks-console/shared';
import { nodeStore, request } from '@ks-console/shared';
import { useParams } from 'react-router-dom';
import { useStore } from '@kubed/stook';

import { Card, Row, Field, Tooltip } from '@kubed/components';
import { GPU, Service } from '../../icons';

import {
  StyledCol,
  Columns,
  ColumnItem,
  BgColor,
  TextName,
  StatusColor,
  ProgressBarContainer,
  ProgressBlock,
  IconWrap,
} from './style';

interface ItemData {
  [key: string]: string | number;
}

const { fetchCount } = nodeStore;

const ProgressBar = ({ data }: any) => {
  return (
    <ProgressBarContainer>
      {data.map((item: any, index: number) => (
        <ProgressBlock key={index} percentage={item.percentage} color={item.color} />
      ))}
    </ProgressBarContainer>
  );
};

function NodeStatus() {
  const { cluster } = useParams();

  const statusMap: ItemData[] = [
    { key: 'Ready', value: 96, label: t('Normal'), className: '' },
    { key: 'NotReady', value: 5, label: t('Abnormal'), className: 'err' },
    { key: 'Unavailable', value: 2, label: t('Not ready'), className: 'off' },
  ];

  const [nodeTotlaCount] = useStore('nodeCount');

  const { data: nodeCount } = useQuery(['fetchCount'], () => {
    return fetchCount({ cluster });
  });

  const { data } = useQuery(['fetchStatus'], async () => {
    return await request.get('/kapis/aicp.kubesphere.io/v1/gpu/get_total_node_status').then(res => {
      if ((res as any)?.ret_code === 0) {
        return res?.data ?? {};
      }
    });
  });

  const percentages = useMemo(() => {
    const result: ItemData = {};
    if (data) {
      let total: number = 0;

      // 计算总量
      for (const key in data) {
        if (key && key !== 'NumGpu') {
          total += data[key];
        }
      }

      // 计算每个项的百分比

      for (const key in data) {
        const percentage = data[key] / total;
        result[key] = percentage;
      }
    }
    return result;
  }, [data]);

  const renderStatusTip = () => {
    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <div>
          {t('Normal')}：{t('Green')}
        </div>
        <div>{'Ready (就绪)'}</div>
        <div className="mt12">
          {t('Not ready')}：{t('Gray')}
        </div>
        <div>{'NotReady (未就绪)'}</div>
        <div className="mt12">
          {t('Abnormal')}：{t('Red')}
        </div>
        <div>{'Unreachable (不可达)'}</div>
        <div>{'OutofDisk (磁盘空间不足)'}</div>
        <div>{'MemoryPressure (内存压力)'}</div>
        <div>{'DiskPressure (磁盘压力)'}</div>
        <div>{'NetworkUnavailable (网络不可用)'}</div>
      </div>
    );
  };

  return (
    <Columns>
      <ColumnItem>
        <Card className="flex">
          <TextName>{t('Number of nodes')}</TextName>
          <Row>
            <StyledCol span={4}>
              <BgColor>
                <Text icon="nodes" title={nodeTotlaCount ?? 0} description={t('Node')} />
              </BgColor>
            </StyledCol>
            <StyledCol span={4}>
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <GPU />
                    </IconWrap>
                  )}
                  title={data?.NumGpu ?? 0}
                  description="GPU"
                />
              </BgColor>
            </StyledCol>
            <StyledCol span={4}>
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <Service />
                    </IconWrap>
                  )}
                  title={nodeCount?.masterNum ?? 0}
                  description={t('Control plane node')}
                />
              </BgColor>
            </StyledCol>
          </Row>
        </Card>
      </ColumnItem>
      <ColumnItem>
        <Card>
          <TextName>
            <span className="mr4">{t('STATUS')}</span>
            <Tooltip content={renderStatusTip()}>
              <Icon name="question" />
            </Tooltip>
          </TextName>
          <Row>
            {statusMap.map((item: any, index) => (
              <StyledCol key={index} span={4}>
                <BgColor className="padding4">
                  <Field
                    value={data?.[item.key] ?? 0}
                    label={<StatusColor className={item.className}>{item.label}</StatusColor>}
                  />
                </BgColor>
              </StyledCol>
            ))}
          </Row>
          <ProgressBar
            data={[
              { percentage: percentages?.Ready ?? 0, color: '#55BC8A' },
              { percentage: percentages?.NotReady ?? 0, color: '#CA2621' },
              { percentage: percentages?.Unavailable ?? 0, color: '#79879C' },
            ]}
          />
        </Card>
      </ColumnItem>
    </Columns>
  );
}

export default NodeStatus;

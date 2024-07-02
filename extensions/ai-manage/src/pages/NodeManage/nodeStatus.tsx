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
  StyleWrap,
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
    { key: 'NoSchedule', value: 9, label: t('Critical'), className: 'waring' },
    { key: 'NotReady', value: 5, label: t('Abnormal'), className: 'err' },
    { key: 'Unavailable', value: 2, label: t('Not ready'), className: 'off' },
  ];

  const [nodeTotlaCount] = useStore('nodeCount');
  const [configs] = useStore('configs');

  const { data: nodeCount } = useQuery(['fetchCount'], () => {
    return fetchCount({ cluster });
  });

  const { data } = useQuery(['fetchStatus'], async () => {
    return request.get('/kapis/aicp.kubesphere.io/v1/gpu/get_total_node_status').then(res => {
      if ((res as any)?.ret_code === 0) {
        return res?.data ?? {};
      }
    });
  });

  const percentages = useMemo(() => {
    const result: ItemData = {};
    const totleData = {
      NoSchedule: data?.NoSchedule ?? 0,
      NotReady: data?.NotReady ?? 0,
      Ready: data?.Ready ?? 0,
      Unavailable: data?.Unavailable ?? 0,
    };
    if (data) {
      let total: number = 0;

      // 计算总量
      for (const key in totleData) {
        if (key) {
          total += totleData?.[key as 'NoSchedule'];
        }
      }

      // 计算每个项的百分比

      for (const key in totleData) {
        const percentage = totleData?.[key as 'NoSchedule'] / total;
        result[key] = percentage;
      }
    }
    return result;
  }, [data]);

  const [enableGPU, enableNPU, enableHFK, enableVGPU] = useMemo(() => {
    const showGPU =
      configs?.find?.((item: any) => item?.dashboard_id === '1')?.enable_table_view === '1';
    const showNPU =
      configs?.find?.((item: any) => item?.dashboard_id === '3')?.enable_table_view === '1';
    const showHFK =
      configs?.find?.((item: any) => item?.dashboard_id === '5')?.enable_table_view === '1';
    const showVGPU =
      configs?.find?.((item: any) => item?.dashboard_id === '6')?.enable_table_view === '1';
    return [showGPU, showNPU, showHFK, showVGPU];
  }, [configs]);

  const renderStatusTip = () => {
    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <div>
          {t('Normal')}：{t('Green')}
        </div>
        <div>{'Ready (就绪)'}</div>
        <div className="mt12">
          {t('警告')}：{t('黄')}
        </div>
        <div>{'NoSchedule (禁止调度)'}</div>
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
          <StyleWrap>
            <BgColor>
              <Text icon="nodes" title={nodeTotlaCount ?? 0} description={t('Node')} />
            </BgColor>
            {enableGPU && (
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <GPU />
                    </IconWrap>
                  )}
                  className="text"
                  title={data?.num_gpu ?? 0}
                  description="GPU"
                />
                <Text
                  className={data?.num_unavailable_gpu ? 'text-err' : 'text'}
                  title={data?.num_unavailable_gpu ?? 0}
                  description="异常"
                />
              </BgColor>
            )}

            {enableNPU && (
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <GPU />
                    </IconWrap>
                  )}
                  title={data?.num_npu ?? 0}
                  description="NPU"
                />
                <Text
                  className={data?.num_unavailable_npu ? 'text-err' : 'text'}
                  title={data?.num_unavailable_npu ?? 0}
                  description="异常"
                />
              </BgColor>
            )}

            {enableHFK && (
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <GPU />
                    </IconWrap>
                  )}
                  title={data?.num_hfk ?? 0}
                  description="Hexaflake"
                />
                <Text
                  className={data?.num_unavailable_hfk ? 'text-err' : 'text'}
                  title={data?.num_unavailable_hfk ?? 0}
                  description="异常"
                />
              </BgColor>
            )}

            {enableVGPU && (
              <BgColor>
                <Text
                  icon={() => (
                    <IconWrap>
                      <GPU />
                    </IconWrap>
                  )}
                  title={data?.num_vgpu ?? 0}
                  description="vGPU"
                />
              </BgColor>
            )}

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
          </StyleWrap>
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
              <StyledCol key={index} span={3}>
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
              { percentage: percentages?.NoSchedule ?? 0, color: '#f5a623' },
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

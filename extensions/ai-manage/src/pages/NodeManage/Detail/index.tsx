import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, isNil } from 'lodash';
import {
  request,
  StatusIndicator,
  DetailPagee,
  nodeStore,
  formatTime,
  getDisplayName,
  getNodeStatus,
  getNodeRoles,
  FormattedNode,
  hasClusterModule,
} from '@ks-console/shared';
import { Nodes, Start, Stop, Wrench, Pen } from '@kubed/icons';
import { Loading, notify, Descriptions } from '@kubed/components';
import { useStore } from '@kubed/stook';
import { useQuery } from 'react-query';

import { authKey } from '../contants';
import { TaintSingleModal } from '../TaintModal/TaintSingleModal';
import ObjectEditModal from '../ObjectEdit';
import { AttributesTitle } from './styles';

const { nodeCordon, nodeUncordon, useGetMutation, useLabelMutation, useBatchPatchTaints } =
  nodeStore;

const PATH = '/ai-manage/:cluster/nodes/:name';

function NodeDetail() {
  const { name, cluster } = useParams();
  const [taintVisible, setTaintVisible] = useState<boolean>(false);
  const [labelVisible, setLabelVisible] = useState<boolean>(false);
  const {
    data: detail = {} as FormattedNode,
    refetch,
    isLoading,
    isError,
  } = useGetMutation({ name, cluster });

  const [, setDetailProps] = useStore('detailProps', detail);

  const { data: node } = useQuery(
    ['fetchNodeInfo'],
    async () => {
      return await request
        .get(`/kapis/aicp.kubesphere.io/v1/gpu/get_node_static_info?node_id=${name}`)
        .then(res => {
          if ((res as any)?.ret_code === 0) {
            return res?.data ?? {};
          }
        });
    },
    { enabled: !!name },
  );

  useEffect(() => {
    if (detail.name) {
      setDetailProps(detail);
    }
  }, [detail]);

  const tabs =
    cluster && hasClusterModule(cluster, 'whizard-monitoring')
      ? [
          { path: `${PATH}/status`, title: t('RUNNING_STATUS') },
          { path: `${PATH}/pods`, title: t('PODS') },
          { path: `${PATH}/metadata`, title: t('METADATA') },
          { path: `${PATH}/monitors`, title: t('MONITORING') },
          { path: `${PATH}/events`, title: t('EVENT_PL') },
          { path: `${PATH}/record`, title: t('Fault Log') },
          { path: `${PATH}/log`, title: t('Maintenance Log') },
        ]
      : [
          { path: `${PATH}/status`, title: t('RUNNING_STATUS') },
          { path: `${PATH}/pods`, title: t('PODS') },
          { path: `${PATH}/metadata`, title: t('METADATA') },
          { path: `${PATH}/events`, title: t('EVENT_PL') },
          { path: `${PATH}/record`, title: t('Fault Log') },
          { path: `${PATH}/log`, title: t('Maintenance Log') },
        ];

  const status = useMemo(() => {
    const statusStr = getNodeStatus(detail);
    return (
      <StatusIndicator type={statusStr}>
        {t(`NODE_STATUS_${statusStr.toUpperCase()}`)}
      </StatusIndicator>
    );
  }, [detail]);

  const { mutate: mutateNodesTaint, isLoading: isNodesTaintLoading } = useBatchPatchTaints({
    onSuccess: () => {
      refetch();
      notify.success(t('UPDATE_SUCCESSFUL'));
      setTaintVisible(false);
    },
  });

  const { mutate: mutateNodesLabel, isLoading: isNodesLabelLoading } = useLabelMutation({
    detail,
    onSuccess: () => {
      refetch();
      setLabelVisible(false);
      notify.success(t('UPDATE_SUCCESSFUL'));
    },
  });

  const attrs = () => {
    const nodeInfo = detail.nodeInfo || {};
    return [
      {
        label: t('STATUS'),
        value: status,
      },
      {
        label: t('IP_ADDRESS'),
        value: detail ? get(detail, 'status.addresses[0].address', '-') : '',
      },
      {
        label: t('ROLE'),
        value:
          getNodeRoles(detail.labels).indexOf('master') === -1 ? t('WORKER') : t('CONTROL_PLANE'),
      },
      {
        label: t('OS_VERSION'),
        value: nodeInfo.osImage || '',
      },
      {
        label: t('OS_TYPE'),
        value: nodeInfo.operatingSystem ? t(nodeInfo.operatingSystem.toUpperCase()) : '',
      },
      {
        label: t('KERNEL_VERSION'),
        value: nodeInfo.kernelVersion || '',
      },
      {
        label: t('CONTAINER_RUNTIME'),
        value: nodeInfo.containerRuntimeVersion || '',
      },
      {
        label: t('KUBELET_VERSION'),
        value: nodeInfo.kubeletVersion || '',
      },
      {
        label: t('KUBE_PROXY_VERSION'),
        value: nodeInfo.kubeProxyVersion || '',
      },
      {
        label: t('ARCHITECTURE'),
        value: nodeInfo.architecture ? nodeInfo.architecture.toUpperCase() : '',
      },
      {
        label: t('CREATION_TIME_TCAP'),
        value: detail?.createTime ? formatTime(detail?.createTime) : '',
      },
    ];
  };

  const getBaseInfoAttrs = () => {
    return [
      {
        label: t('Cluster'),
        value: node?.node_cluster ?? '-',
      },
      {
        label: t('Belonging Compute Pool'),
        value: node?.node_compute_group ?? '-',
      },
      {
        label: 'IPM IP',
        value: node?.node_ipmi_ip ?? '-',
      },
      {
        label: t('Server Manufacturer'),
        value: node?.node_product_company ?? '-',
      },
      {
        label: t('Server Model'),
        value: node?.node_hardware_model ?? '-',
      },
      {
        label: t('Server Serial Number'),
        value: node?.node_serial_number ?? '-',
      },
      {
        label: t('Computer room'),
        value: node?.node_zone ?? '-',
      },
      {
        label: t('Cabinet'),
        value: node?.node_location_number ?? '-',
      },
    ];
  };

  const getConfigInfoAttrs = () => {
    return [
      {
        label: t('CPU Model'),
        value: node?.node_cpu_model ?? '-',
      },
      {
        label: t('CPU cores'),
        value: !isNil(node?.node_cpu) ? node?.node_cpu : '-',
      },
      {
        label: t('Memory'),
        value: !isNil(node?.node_memory) ? `${node?.node_memory} G` : '-',
      },
      {
        label: t('GPU Model'),
        value: node?.node_gpu_model ?? '-',
      },
      {
        label: t('GPU Memory'),
        value: node?.node_gpu_memory ?? '-',
      },
      {
        label: t('Number of GPU Cards'),
        value: node?.node_gpu ?? '-',
      },
      {
        label: t('Availability of NVLINK'),
        value: !isNil(node?.nvlink) ? (node?.nvlink ? t('YES') : t('NO')) : '-',
      },
      {
        label: t('Compute IB Network Card Configuration'),
        value: !isNil(node?.node_ib_count_compute) ? `${node?.node_ib_count_compute} G` : '-',
      },
      {
        label: t('Number of Compute IB Network Cards'),
        value: node?.node_ib_bw_storage ?? '-',
      },
      {
        label: t('Storage IB Network Card Configuration'),
        value: !isNil(node?.node_ib_bw_storage) ? `${node?.node_ib_bw_storage} G` : '-',
      },
      {
        label: t('Number of Storage IB Network Cards'),
        value: node?.node_ib_count_storage ?? '-',
      },
    ];
  };

  const getOperations = () => {
    const { unschedulable } = detail;
    return [
      {
        key: 'cordon',
        icon: unschedulable ? <Start /> : <Stop />,
        text: unschedulable ? t('UNCORDON') : t('CORDON'),
        action: 'edit',
        props: { color: unschedulable ? 'secondary' : 'error' },
        onClick: () => {
          if (unschedulable) {
            nodeUncordon(detail).then(() => refetch?.());
          } else {
            nodeCordon(detail).then(() => refetch?.());
          }
        },
      },
      {
        key: 'eidtLabel',
        icon: <Pen />,
        text: t('EDIT_LABELS'),
        action: 'edit',
        onClick: () => {
          setLabelVisible(true);
        },
      },
      {
        key: 'taintManagement',
        icon: <Wrench />,
        text: t('EDIT_TAINTS'),
        action: 'edit',
        onClick: () => {
          setTaintVisible(true);
        },
      },
    ];
  };

  return isLoading || isError ? (
    <Loading className="page-loading" />
  ) : (
    <>
      <DetailPagee
        tabs={tabs}
        cardProps={{
          params: { cluster, name },
          name: getDisplayName<FormattedNode>(detail),
          authKey,
          actions: getOperations(),
          attrs: attrs(),
          icon: <Nodes size={28} />,
          breadcrumbs: {
            label: t('Node Manage'),
            url: `/ai-manage/${cluster}/nodes`,
          },
          desc: detail?.description,
          customAttrs: (
            <>
              <AttributesTitle>{t('Basic Information')}</AttributesTitle>
              <Descriptions variant="unstyled" data={getBaseInfoAttrs()} />
              <AttributesTitle>{t('Configuration Information')}</AttributesTitle>
              <Descriptions variant="unstyled" data={getConfigInfoAttrs()} />
            </>
          ),
        }}
      />
      {taintVisible && (
        <TaintSingleModal
          visible={taintVisible}
          detail={detail}
          onOk={mutateNodesTaint}
          onCancel={() => setTaintVisible(false)}
          confirmLoading={isNodesTaintLoading}
        />
      )}
      {labelVisible && (
        <ObjectEditModal
          title={t('LABEL_PL')}
          visible={labelVisible}
          detail={detail}
          onOk={mutateNodesLabel}
          onCancel={() => setLabelVisible(false)}
          confirmLoading={isNodesLabelLoading}
        />
      )}
    </>
  );
}
export default NodeDetail;

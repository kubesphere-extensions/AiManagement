import React from 'react';
import styled from 'styled-components';
import { useForm, Modal, FormItem, Textarea, Form } from '@kubed/components';
import type { ModalProps } from '@kubed/components';
import { merge } from 'lodash';
import { useMutation } from 'react-query';
import { request } from '@ks-console/shared';

const StyledForm = styled(Form)`
  padding: 20px;
`;

const StyledTextarea = styled(Textarea)`
  &&& {
    max-width: none;
  }

  textarea {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 12px;
    line-height: 1.4;
  }
`;

interface EnterLicenseModalProps extends Pick<ModalProps, 'visible' | 'title'> {
  onCancel: () => void;
  onSuccess?: () => void;
  nodeID: string;
}

function CreateLogModal({ visible, onSuccess, onCancel, nodeID, ...rest }: EnterLicenseModalProps) {
  const [form] = useForm<any>();

  const defaultProps = {
    title: t('Create New Log'),
  };

  const finalProps = merge({}, defaultProps, rest);

  const { mutate, isLoading } = useMutation(
    (fetchParams: any) => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/create_gpu_node_maintain_log?';
      const _url = `${url}gpu_node_id=${nodeID}&description=${fetchParams.description}`
      return request.post(_url,);
    },
    {
      onSuccess: () => {
        form.resetFields();
        onSuccess?.();
      },
    },
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      wrapClassName="enter-license-modal-wrap"
      confirmLoading={isLoading}
      onOk={form.submit}
      {...finalProps}
    >
      <StyledForm
        form={form}
        onFinish={(formValues: Record<string, string>) => {
          console.log(formValues);
          mutate(formValues);
        }}
      >
        <FormItem
          name="description"
          label={t('Descriptions')}
          rules={[{ required: true, message: t('Please enter the description点击并应用') }]}
        >
          <StyledTextarea />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}

export default CreateLogModal;

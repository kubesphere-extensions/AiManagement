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

interface Props extends Pick<ModalProps, 'visible' | 'title'> {
  onCancel: () => void;
  onSuccess?: () => void;
  faultID: string;
}

function TroubleshootingModal({ visible, onSuccess, onCancel, faultID, ...rest }: Props) {
  const [form] = useForm<any>();

  const defaultProps = {
    title: t('Troubleshooting'),
  };

  const finalProps = merge({}, defaultProps, rest);

  const { mutate, isLoading } = useMutation(
    (fetchParams: any) => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/update_gpu_fault_record';
      const paramUrl = `${url}?gpu_fault_id=${faultID}&description=${fetchParams.description}`;
      return request.post(paramUrl);
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
          mutate(formValues);
        }}
      >
        <FormItem
          name="description"
          label={t('Treatment')}
          rules={[{ required: true, message: t('Please enter the description') }]}
        >
          <StyledTextarea />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}

export default TroubleshootingModal;

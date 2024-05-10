import React from 'react';
import styled from 'styled-components';
import { useForm, Modal, FormItem, Textarea, Form, Input, Select } from '@kubed/components';
import type { ModalProps } from '@kubed/components';
import { merge } from 'lodash';
import { useMutation } from 'react-query';
import { request } from '@ks-console/shared';

import { getStrategy } from '../../utils';

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
    height: 100px;
  }
`;

interface Props extends Pick<ModalProps, 'visible' | 'title'> {
  onCancel: () => void;
  onSuccess?: () => void;
  info: any;
}

function ModifyXid({ visible, onSuccess, onCancel, info, ...rest }: Props) {
  const [form] = useForm<any>();

  const defaultProps = {
    title: t('编辑错误码'),
  };

  const finalProps = merge({}, defaultProps, rest);

  const { mutate, isLoading: submiting } = useMutation(
    (fetchParams: any) => {
      const url = '/kapis/aicp.kubesphere.io/v1/gpu/update_gpu_error_code';
      // eslint-disable-next-line max-len
      const paramUrl = `${url}?code_id=${fetchParams?.code_id}&gpu_err_strategy=${fetchParams?.gpu_err_strategy}&gpu_err_priority=${fetchParams?.gpu_err_priority}&gpu_err_desc=${fetchParams?.gpu_err_desc}&gpu_suggestions=${fetchParams?.gpu_suggestions}`;
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
      confirmLoading={submiting}
      onOk={form.submit}
      loading={true}
      {...finalProps}
    >
      <StyledForm
        form={form}
        initialValues={info}
        onFinish={(formValues: Record<string, string>) => {
          mutate(formValues);
        }}
      >
        <FormItem label={t('Error Code')} name="code_id">
          <Input readOnly disabled />
        </FormItem>
        <FormItem label={t('XID')} name="gpu_xid">
          <Input readOnly disabled />
        </FormItem>
        <FormItem label={t('Error level')} name="gpu_err_priority">
          <Select
            options={[
              { label: t('Critical'), value: 'Critical' },
              { label: t('Warning'), value: 'Warning' },
              { label: t('Error'), value: 'Error' },
            ]}
          />
        </FormItem>
        <FormItem label={t('故障策略')} name="gpu_err_strategy">
          <Select options={['0', '1', '2'].map(key => ({ label: getStrategy(key), value: key }))} />
        </FormItem>
        <FormItem
          name="gpu_err_desc"
          label={t('Error Description')}
          rules={[{ required: true, message: t('Please enter the description') }]}
        >
          <StyledTextarea row={4} />
        </FormItem>
        <FormItem
          name="gpu_suggestions"
          label={t('Recommendations and measures')}
          rules={[{ required: true, message: t('Please enter the description') }]}
        >
          <StyledTextarea row={4} />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}

export default ModifyXid;

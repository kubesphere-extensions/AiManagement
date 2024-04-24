import React from 'react';
import styled from 'styled-components';

import { request } from '@ks-console/shared';
import {
  Modal, Form, FormItem, Input, Textarea, useForm,
} from '@kubed/components';

interface Props {
  pool: Pool;
  onClose: (refresh?: boolean) => void;
};

const FormWrapper = styled.div`
  padding: 12px 20px;
`;

const EditModal = ({ pool, onClose }: Props) => {
  const [form] = useForm();
  const [loading, setLoading] = React.useState(false);

  /**
   * 表单提交
   * @param params
   * @returns
   */
  const onSubmit = async (params: any) => {
    setLoading(true);

    const res: any = await request.put('/kapis/aicp.kubesphere.io/v1/resource_pool', {
      pool_id: pool.pool_id,
      ...params,
    });

    if (res?.ret_code) {
      return setLoading(false);
    }

    onClose(true);
  };

  return (
    <Modal
      title={t('Edit pool')}
      onOk={form.submit}
      onCancel={() => onClose()}
      okText={t('EDIT')}
      visible
    >
      <FormWrapper>
        <Form form={form} initialValues={pool} onFinish={onSubmit}>
          <FormItem
            name="pool_name"
            label={t('Name')}
            rules={[{ required: true, message: t('Please input name.') }]}
          >
            <Input />
          </FormItem>
          <FormItem name="description" label={t('Description')}>
            <Textarea />
          </FormItem>
        </Form>
      </FormWrapper>
    </Modal>
  );
};

export default EditModal;

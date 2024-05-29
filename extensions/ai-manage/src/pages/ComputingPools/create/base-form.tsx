import React from 'react';
import styled from 'styled-components';

import {
  Form, FormItem, Input, Select, Textarea, Button, useForm,
} from '@kubed/components';

export interface BasePool {
  pool_name: string;
  aipods_type: string;
  description?: string;
};

interface Props {
  params?: BasePool;
  aiPodFilters: AiPodFilter[];
  onCancel: () => void;
  onSubmit: (params: BasePool) => void;
};

const FormWrapper = styled.div`
  padding: 12px 20px;
`;

const BaseForm = ({
  params, aiPodFilters, onCancel, onSubmit,
}: Props) => {
  const [form] = useForm();

  return (
    <>
      <FormWrapper>
        <Form form={form} initialValues={params} onFinish={onSubmit}>
          <FormItem
            name="pool_name"
            label={t('Name')}
            rules={[
              { required: true, message: t('Please input name.') },
              {
                validator: async (rule, value) => {
                  if (value?.length > 64) {
                    return Promise.reject(t('The length cannot exceed {len}', { len: 64 }));
                  }
                },
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="aipods_type"
            label={t('Ai pods type')}
            rules={[{ required: true, message: t('Please select ai pods type.') }]}
          >
            <Select
              options={aiPodFilters?.map(({ name, attr_value }) => ({
                label: name, value: attr_value,
              }))}
            />
          </FormItem>
          <FormItem
            name="description"
            label={t('Description')}
            rules={[
              {
                validator: async (rule, value) => {
                  if (value?.length > 128) {
                    return Promise.reject(t('The length cannot exceed {len}', { len: 128 }));
                  }
                },
              },
            ]}
          >
            <Textarea />
          </FormItem>
        </Form>
      </FormWrapper>
      <div className="kubed-modal-footer">
        <Button onClick={onCancel}>{t('CANCEL')}</Button>
        <Button color="secondary" onClick={() => form.submit()}>
          {t('NEXT')}
        </Button>
      </div>
    </>
  );
};

export default BaseForm;

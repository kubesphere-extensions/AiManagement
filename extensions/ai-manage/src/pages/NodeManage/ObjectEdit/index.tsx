import React, { useState, useEffect, useMemo } from 'react';
import { cloneDeep, get, isEmpty } from 'lodash';
import {
  FormItem,
  Select,
  Input,
  InputPassword,
  InputNumber,
  Textarea,
  Modal,
  Row,
  useForm,
} from '@kubed/components';
import { Pen } from '@kubed/icons';
import { PropertiesInput } from '@ks-console/shared';
import { Wrapper, Title, Content } from './styles';

export interface Props {
  visible: boolean;
  title: string;
  detail: Record<string, any>;
  confirmLoading?: boolean;
  onOk: (data: any) => void;
  onCancel: () => void;
}
function ObjectEdit({ visible, title, detail = {}, confirmLoading, onCancel, onOk }: Props) {
  const [selfValue, setSelfValue] = useState(detail?.labels || {});
  const [enableSave, setEnableSave] = useState<boolean>(true);
  useEffect(() => {
    setSelfValue(detail?.labels || {});
  }, [visible]);
  const handleChange = (key: Record<string, any>) => {
    setSelfValue(key);
  };
  const handleError = (error: any) => {
    setEnableSave(isEmpty(error));
  };
  return (
    <Modal
      width={1162}
      visible={visible}
      titleIcon={<Pen size={20} />}
      title={t('EDIT_TITLE', { title })}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okButtonProps={{ disabled: !enableSave }}
      onOk={() => {
        onOk(selfValue);
      }}
    >
      <Wrapper>
        <Title>{t(title)}</Title>
        <Content>
          <PropertiesInput
            addText={t('ADD')}
            value={selfValue}
            onChange={handleChange}
            onError={handleError}
          />
        </Content>
      </Wrapper>
    </Modal>
  );
}
export default ObjectEdit;

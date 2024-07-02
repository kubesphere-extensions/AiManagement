import React, { useEffect, useState } from 'react';
import { Input } from '@kubed/components';
import { Check, Close, Pen } from '@kubed/icons';

import { FlexCenter, Address } from './styles';

interface Props {
  defaultValue: string;
  placeholder?: string;
  onSubmit: (v: string) => void;
  haveBg?: boolean;
}

function ModifyInput({
  defaultValue,
  placeholder = '请输入',
  onSubmit,
  haveBg,
}: Props): JSX.Element {
  const [isModify, setModify] = useState(false);
  const [oldValue, setOldValue] = useState(defaultValue ?? '');
  const [value, setValue] = useState(defaultValue ?? '');

  const handleSubmit = () => {
    onSubmit?.(value);
    setModify(false);
  };

  useEffect(() => {
    setValue(defaultValue);
    setOldValue(defaultValue);
  }, [defaultValue]);

  if (isModify) {
    return (
      <FlexCenter>
        <Input
          size="xs"
          value={value}
          width={240}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <Check size={20} cursor="pointer" onClick={handleSubmit} color="#55bc8a" />
        <Close
          size={20}
          cursor="pointer"
          onClick={() => {
            setModify(false);
            setValue(oldValue);
          }}
        />
      </FlexCenter>
    );
  }
  return (
    <FlexCenter>
      {haveBg ? <Address>{value}</Address> : <div className="sub_title">{value}</div>}
      <Pen size={16} cursor="pointer" onClick={() => setModify(true)} />
    </FlexCenter>
  );
}

export default ModifyInput;

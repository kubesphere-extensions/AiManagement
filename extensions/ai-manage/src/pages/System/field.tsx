import React from 'react';
import { FieldWrap } from './styles';

function Field({ label, children }: { label: string; children: string | React.ReactNode }) {
  return (
    <FieldWrap>
      <span className="mr12">{label}</span>
      <span>{children}</span>
    </FieldWrap>
  );
}

export default Field;

import React from 'react';
import { Icon } from '@ks-console/shared';

import { Wrapper, Step, Current } from './style';

export interface StepProps {
  icon: string;
  title: string;
}

interface Props {
  current: number;
  steps: StepProps[];
};

const CreateSteps = ({ steps, current }: Props) => (
  <Wrapper>
    {
      steps.map((step, index) => {
        if (index === current) {
          return (
            <Current key={step.title}>
              <Icon name={step.icon} type="light" size={40} />
              <span>{t(step.title)}</span>
            </Current>
          );
        }

        return (
          <Step key={step.title}>
            <Icon name={step.icon} type="light" size={40} />
            <span>{t(step.title)}</span>
          </Step>
        );
      })
    }
  </Wrapper>
);

export default CreateSteps;

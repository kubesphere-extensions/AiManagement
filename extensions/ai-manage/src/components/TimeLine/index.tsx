import React from 'react';
import { Wrap, Title, Date, Desc, Item, Border, Circle } from './styles';

type Items = {
  title: string;
  desc: string;
  time: string;
  status: string;
};

interface Props {
  data: Items[];
}

function TimeLine({ data }: Props): JSX.Element {
  return (
    <Wrap>
      {data.map((item, index) => (
        <Item>
          <Title>
            <Circle />
            {item?.title}
          </Title>
          <Border isLast={index === data.length - 1}>
            <Date>{item?.time}</Date>
            <Desc>{item?.desc}</Desc>
          </Border>
        </Item>
      ))}
    </Wrap>
  );
}

export default TimeLine;

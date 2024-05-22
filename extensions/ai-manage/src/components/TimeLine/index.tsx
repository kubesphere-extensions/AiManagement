import React from 'react';
import { Loading } from '@kubed/components';
import { Wrap, Title, Date, Desc, Item, Border, Circle, Empty } from './styles';

type Items = {
  title: string;
  desc: string;
  time: string;
  status: string;
};

interface Props {
  data: Items[];
  loading?: boolean;
}

function TimeLine({ data, loading }: Props): JSX.Element {
  if (loading) {
    return (
      <Empty>
        <Loading />
      </Empty>
    );
  }

  return (
    <Wrap>
      {data?.length ? (
        data.map((item, index) => (
          <Item key={index}>
            <Title>
              <Circle />
              {item?.title}
            </Title>
            <Border isLast={index === data.length - 1}>
              <Date>{item?.time}</Date>
              <Desc>{item?.desc}</Desc>
            </Border>
          </Item>
        ))
      ) : (
        <Empty>{t('NO_DATA')}</Empty>
      )}
    </Wrap>
  );
}

export default TimeLine;

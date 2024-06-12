import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  type: string;
  id: string;
  namespace?: string;
}

const LinkWrap = styled.span`
  cursor: pointer;
  & .link-color {
    color: #55bc8a;
  }
`;

function ResourceLink({ type, id, namespace }: Props) {
  const { cluster } = useParams();
  if (type === 'pool') {
    return id ? (
      <LinkWrap>
        <Link className="link-color" to={`/ai-manage/${cluster}/pools/${id}/nodes`}>
          {id}
        </Link>
      </LinkWrap>
    ) : (
      <>{'共享计算池'}</>
    );
  }
  if (type === 'pod' && namespace) {
    return (
      <LinkWrap>
        <Link
          className="link-color"
          to={`/clusters/${cluster}/projects/${namespace}/pods/${id}/resource-status`}
        >
          {id}
        </Link>
      </LinkWrap>
    );
  }
  return <span>{id || '-'}</span>;
}

export default ResourceLink;

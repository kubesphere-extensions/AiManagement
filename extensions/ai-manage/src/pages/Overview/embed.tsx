import React from 'react';
import WujieReact from 'wujie-react';
import { useParams } from 'react-router-dom';

export default function Embed(): JSX.Element {
  const { cluster } = useParams<'cluster'>();

  const url = `//${window.location.host}/consolev3/clusters/${cluster}/overview`;

  return (
    <div>
      {/* {new WujieReact({ width: '100%', height: '100%', name: 'consolev3', url, sync: false })} */}
      {/* @ts-expect-error Server Component */}
      <WujieReact width="100%" height="100%" name="consolev3" url={url} sync={false} />
    </div>
  );
}

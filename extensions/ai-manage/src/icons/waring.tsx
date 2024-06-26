import React from 'react';

interface Props {
  size?: number;
}

function Waring({ size = 48 }: Props) {
  return (
    <svg width={size} height={size} viewBox={`0 0 48 48`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.8654 5.49481C24.4802 4.82953 23.5197 4.82953 23.1345 5.49481L2.86898 40.4989C2.48302 41.1656 2.96407 42 3.73441 42H44.2655C45.0358 42 45.5169 41.1656 45.1309 40.4989L24.8654 5.49481ZM26 30H22L21.5 16H26.5L26 30ZM22 34H26V38H22V34Z"
        fill="#B6C2CD"
      />
      <path d="M22 30H26L26.5 16H21.5L22 30Z" fill="#324558" />
      <path d="M26 34H22V38H26V34Z" fill="#324558" />
    </svg>
  );
}

export default Waring;

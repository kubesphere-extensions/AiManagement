import React from 'react';

interface Props {
  size?: number;
}

function Waring({ size = 48 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM26.5 13L26 27H22L21.5 13H26.5ZM22 35V31H26V35H22Z"
        fill="#B6C2CD"
      />
      <path d="M22 27H26L26.5 13H21.5L22 27Z" fill="#324558" />
      <path d="M26 31H22V35H26V31Z" fill="#324558" />
    </svg>
  );
}

export default Waring;

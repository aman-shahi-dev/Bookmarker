import * as React from "react";

const BookmarkerLogo = ({
  width = "100%",
  height = "auto",
  className = "",
  ...props
}) => (
  <svg
    viewBox="0 0 400 400"
    width={width}
    height={height}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={200} cy={200} r={190} fill="" />
    <text
      x={200}
      y={290}
      fontFamily="Arial Black, Arial, sans-serif"
      fontSize={260}
      fontWeight={900}
      fill="#FFD700"
      textAnchor="middle"
      stroke="#FFFFFF"
      strokeWidth={4}
    >
      B
    </text>
  </svg>
);

export default BookmarkerLogo;

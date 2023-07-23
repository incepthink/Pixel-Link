import React from "react";
// ref https://codepen.io/vitor-siqueira/pen/xNBExN
export default function TransparentButton({
  children,
  onClick,
  width="180",
  height="60",
}) 
{
  return (
    <div className="relative">
      <button
        className={`transparent-btn`}
        style={{ width: width + "px", height: height + "px" }}
        onClick={onClick}
      >
        <svg
          width={width + "px"}
          height={height + "px"}
          viewBox={`0 0 ${width} ${height}`}
        >
           <polyline
            points={`${parseInt(width) + -1},1 ${parseInt(width) + -1},${
              parseInt(height) + -1
            } 1,${parseInt(height) + -1} 1,1 ${parseInt(width) + -1},1`}
            className="bg-line"
          />
          <polyline
            points={`${parseInt(width) + -1},1 ${parseInt(width) + -1},${
              parseInt(height) + -1
            } 1,${parseInt(height) + -1} 1,1 ${parseInt(width) + -1},1`}
            className="hl-line"
          /> 
        </svg>
        {children}
      </button>
    </div>
  );
}

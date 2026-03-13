import React from "react";

export default function EllipsisText({ text, style = {}, ...props }) {
  return (
    <div
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2, // limit to 2 lines
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...style,
      }}
      {...props}
    >
      {text}
    </div>
  );
}

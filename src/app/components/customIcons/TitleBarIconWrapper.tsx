import React from "react";

const wrapperStyle = {
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "end"
};
export const TitleBarIconWrapper = ({ children }) => {
  return <div style={wrapperStyle}>{children}</div>;
};

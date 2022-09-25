import React from "react";
import { MoonLoader } from "react-spinners";
export default function Spinner() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <MoonLoader loading  color='teal'/>
    </div>
  );
}

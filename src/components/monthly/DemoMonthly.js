import React from "react";
import AggregatedChart from "../AggregatedChart";
import { useTable } from "react-table";
import { MONTHLYCOLUMNS } from "./MonthlyColumns";
import "../../css/table.css";
import DemoMonthlyChart from "./DemoMonthlyChart";

function DemoMonthly({ dailyView }) {
  const columns = React.useMemo(() => MONTHLYCOLUMNS, []);
  const data = React.useMemo(() => dailyView, []);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <div className="upload3-container fluid-container">
      <h2>Monthly View</h2>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Visualized View</h2>
      <DemoMonthlyChart dailyView={dailyView}/>
    </div>
  );
}

export default DemoMonthly;

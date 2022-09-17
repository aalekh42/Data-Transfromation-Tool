import React from "react";
import DemoAggregatedChart from "./DemoAggregatedChart";
import { useTable } from "react-table";
import { AGGREGATEDCOLUMNS } from "./AggregatedColumns";
import "../../css/table.css";

function DemoAggregatedTable({ monthlyView }) {
  const columns = React.useMemo(() => AGGREGATEDCOLUMNS, []);
  const data = React.useMemo(() => monthlyView, []);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="upload3-container fluid-container">
      <h2>Aggregated View</h2>

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
                  // console.log('Cells', cell.value);
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Visualized View</h2>
      <DemoAggregatedChart monthlyView={monthlyView} />
    </div>
  );
}

export default DemoAggregatedTable;

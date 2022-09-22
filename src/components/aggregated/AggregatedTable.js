import React from "react";
import AggregatedChart from "./AggregatedChart";
import { useTable } from "react-table";
import { COLUMNS } from "./AggregatedColumns";
import "../../css/table.css";

function AggregatedTable({ monthlyView,categoryItems }) {
  
  const renderMonths=monthlyView;
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => renderMonths, [monthlyView]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  //Sorting
  // let sorted= ans && ans?.sort(function(a,b){
  //   return new Date(a.FromDateTime) - new Date(b.FromDateTime)});
  // ans && console.log("Sorted=",sorted);
  // ans && console.log("PerDayData",perDayData)
  return (
    <div className="upload3-container fluid-container">

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
      <div className="row">
        <div className="col-12">
          <button
            className="btn btn-primary"
            style={{
              display: "flex",
              backgroundColor: "#1161AB",
              marginTop: "10px",
            }}
            onClick={() => console.log("Edit mode")}
          >
            Edit
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="aggregated-heading" style={{ paddingTop: "40px" }}>
            Visualized View
          </h2>
          {monthlyView && <AggregatedChart monthlyView={monthlyView} categoryItems={categoryItems}/>}
        </div>
      </div>
    </div>
  );
}

export default AggregatedTable;

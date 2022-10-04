import React from "react";
import styled from "styled-components";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import scrollbarWidth from "../scrollbarWidth";
import WeeklyChart from "./WeeklyChart";
import { WEEKLYCOLUMNS } from "./WeeklyColumn";

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }
    .th {
      background-color: #1161ab;
      color: white;
    }
    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      border-left: 1px solid black;

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
`;

function WeeklyTable({  weekly, category }) {
  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const columns = React.useMemo(() => WEEKLYCOLUMNS, []);
  const data = React.useMemo(() => weekly, [weekly]);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = tableInstance;

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  return (
    <Styles>
      <div className="upload3-container fluid-container">
        <h2>Monthly View</h2>
        <div {...getTableProps()} className="table">
          <div>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="th">
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()}>
            <FixedSizeList
              height={400}
              itemCount={rows.length}
              itemSize={35}
              width={totalColumnsWidth + scrollBarSize}
            >
              {RenderRow}
            </FixedSizeList>
          </div>
        </div>
        <h2>Visualized View</h2>
        <WeeklyChart weekly={weekly} category={category} />
      </div>
    </Styles>
  );
}

export default WeeklyTable;

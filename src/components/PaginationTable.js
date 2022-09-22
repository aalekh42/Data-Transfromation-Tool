import React from "react";
import moment from "moment";
import styled from "styled-components";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import scrollbarWidth from "./scrollbarWidth";
import { MONTHLYCOLUMNS } from "./Monthly/MonthlyColumns";
import DailyChart from "./DailyChart";

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
    .th{
      background-color: #1161AB;
    }
    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
`;

function PaginationTable({ ans }) {
  const mapper = (single) => {
    let date = moment(single.FromDateTime).format("YYYY-MM-DD");
    let month = moment(single.FromDateTime).format("MMM");
    let year = moment(single.FromDateTime).format("YYYY");
    let value = parseFloat(single.value);
    let time = moment(single.FromDateTime, moment.defaultFormat).format(
      "YYYY-MM-DD HH:mm"
    );
    var d = moment(`${time}`);
    var peakStart = moment(`${date} 07:00`);
    var peakEnd = moment(`${date} 19:00`);

    var duosStart = moment(`${date} 16:00`);
    var duosEnd = moment(`${date} 19:00`);

    var peakCondition1 =
      0 <= d.diff(peakStart, "hours") && d.diff(peakStart, "hours") <= 12; //should be true (only true if result is between 0-12)
    var peakCondition2 =
      0 <= peakEnd.diff(d, "hours") && peakEnd.diff(d, "hours") <= 12;
    var weekday = moment(date).isoWeekday() <= 5;
    var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;

    var duosCondition1 =
      0 <= d.diff(duosStart, "hours") && d.diff(duosStart, "hours") <= 3; //should be true (only true if result is between 0-3)
    var duosCondition2 =
      0 <= duosEnd.diff(d, "hours") && duosEnd.diff(d, "hours") <= 3;
    var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
    var weekendVol = !weekday ? value : 0;
    var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
    var offPeakVol = weekendVol + offPeak;
    let daysInMonth = moment(date).daysInMonth();
    return {
      CurveCode: single.CurveCode,
      FromDateTime: date,
      year: year,
      Month: month,
      TotalVol: value,
      peakVol: peakVol,
      duosVol: duosVol,
      weekendVol: weekendVol,
      offPeakVol: offPeakVol,
      daysInMonth: daysInMonth,
      MonthYear: month + year,
    };
  };

  const getDays = (group, current) => {
    let i = group.findIndex(
      (single) =>
        single.FromDateTime === current.FromDateTime &&
        single.CurveCode === current.CurveCode
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].TotalVol =parseInt(group[i].TotalVol + current.TotalVol);
    group[i].peakVol = parseInt(group[i].peakVol +current.peakVol);
    group[i].duosVol =parseInt(group[i].duosVol +current.duosVol);
    group[i].offPeakVol = parseInt(group[i].offPeakVol + current.offPeakVol);
    group[i].weekendVol =parseInt(group[i].weekendVol + current.weekendVol);
    //Can include weekends,offPeak value as well
    return group;
  };

  const getMonths = (group, current) => {
    let i = group.findIndex(
      (single) =>
        single.MonthYear === current.MonthYear &&
        single.CurveCode === current.CurveCode
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].TotalVol = parseInt(group[i].TotalVol + current.TotalVol); //returns totalVolume
    group[i].peakVol = parseInt(group[i].peakVol + current.peakVol); //returns peakVol
    group[i].duosVol = parseInt(group[i].duosVol + current.duosVol); //returns duosVol
    group[i].weekendVol = parseInt(group[i].weekendVol + current.weekendVol); //returns weekendVol
    group[i].offPeakVol = parseInt(group[i].offPeakVol + current.offPeakVol); //returns offPeakVol

    return group;
  };

  const getYears = (group, current) => {
    let i = group?.findIndex((single) => single.year === current.year);
    if (i === -1) {
      return [...group, current];
    }
    group[i].annualBase = parseInt(group[i].TotalVol + current.TotalVol); //returns totalVolume

    return group;
  };

  const perDayData = ans && ans?.map(mapper).reduce(getDays, []);
  const perDayCopy = ans && JSON.parse(JSON.stringify(perDayData));

  const monthlyView = ans && perDayCopy.reduce(getMonths, []);
  const peakKwh = ans && monthlyView?.map((x) => x.peakVol);
  const maxKwh = Math.max(...peakKwh);
  const isLeapYear = (year) => {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  };
  ans &&
    monthlyView?.map((elem, index) => {
      elem.MonthlyBase = (elem.TotalVol / elem.daysInMonth).toFixed(2);
      elem.Monthly_MW = (elem.TotalVol / 1000 / elem.daysInMonth / 24).toFixed(
        4
      );
      elem.maxKwh = maxKwh;
      elem.totalDays = isLeapYear(elem.year) ? 366 : 365;
    });
  const test = [...perDayData];

  const yearlyView = ans && test.reduce(getYears, []);
  //  Sorting
  let sorted =
    ans &&
    ans?.sort(function (a, b) {
      return new Date(a.FromDateTime) - new Date(b.FromDateTime);
    });
  //ans && console.log("Sorted=", sorted);
  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const columns = React.useMemo(() => MONTHLYCOLUMNS, []);
  const data = React.useMemo(() => perDayData, []);

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
        {/* <JsonToTable json={perDayData} /> */}
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
        {/* <DailyChart perDayData={perDayData} /> */}
      </div>
    </Styles>
  );
}

export default PaginationTable;

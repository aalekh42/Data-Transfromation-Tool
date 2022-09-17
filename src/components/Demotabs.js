import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AggregatedTable from './AggregatedTable';
import DemoAggregatedTable from './aggregated/DemoAggregatedTable';

import { Link } from 'react-router-dom';
import moment from "moment";
import DemoMonthly from './monthly/DemoMonthly';


export default function Demotabs({ans}) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
      (single) => single.FromDateTime === current.FromDateTime

      // (single) => single.FromDateTime === current.FromDateTime && single.CurveCode === current.CurveCode
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].TotalVol += current.TotalVol;
    group[i].peakVol += current.peakVol;
    group[i].duosVol += current.duosVol;
    group[i].offPeakVol += current.offPeakVol;
    group[i].weekendVol += current.weekendVol;
    //Can include weekends,offPeak value as well
    return group;
  };

  const getMonths = (group, current) => {
    let i = group.findIndex(
      (single) => single.MonthYear === current.MonthYear
      // single.MonthYear === current.MonthYear&& single.CurveCode === current.CurveCode
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
    let i = group?.findIndex(
      (single) =>
        //console.log("Years",single.year===current.year)
        single.year === current.year
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].annualBase = parseInt(group[i].TotalVol + current.TotalVol); //returns totalVolume

    return group;
  };

  const perDayData = ans && ans?.map(mapper).reduce(getDays, []);
    //Sorting
  let sortedDailyView= ans && perDayData?.sort(function(a,b){
    return new Date(a.FromDateTime) - new Date(b.FromDateTime)});

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

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Aggregated" value="1" />
            <Tab label="Monthly" value="2" />

          </TabList>
        </Box>
        <TabPanel value="1">
          {/* <AggregatedTable monthlyView={monthlyView}/> */}
          <DemoAggregatedTable monthlyView={monthlyView}/>
        </TabPanel>
        <TabPanel value="2">
          <DemoMonthly dailyView={sortedDailyView} />
        </TabPanel>

      </TabContext>
    </Box>
  );
}


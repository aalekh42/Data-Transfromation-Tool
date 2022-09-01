import React from 'react';
import moment from 'moment';
import { JsonToTable } from 'react-json-to-table';


function Upload3({ans}) {

  const mapper = (single) => {
    let date = moment(single.FromDateTime).format('YYYY-MM-DD');
    let month = moment(single.FromDateTime).format('MMM');
    let year = moment(single.FromDateTime).format('YYYY');
    let value = parseFloat(single.value);
    let time = moment(single.FromDateTime, moment.defaultFormat).format(
      'YYYY-MM-DD HH:mm'
    );

    var d = moment(`${time}`);
    var start = moment(`${date} 07:00`);
    var end = moment(`${date} 19:00`);
    var statement1 =
      0 <= d.diff(start, 'hours') && d.diff(start, 'hours') <= 12; //should be true (only true if result is between 1-12)
    var statement2 = 0 <= end.diff(d, 'hours') && end.diff(d, 'hours') <= 12;
    var weekday = moment(date).isoWeekday() <= 5;
    var peakVol = statement1 && statement2 && weekday?value:null; 

    return {
      CurveCode: single.CurveCode,
      FromDateTime: date,
      years: year,
      Month: month,
      value: value,
      peakVol: peakVol,
      time: time,
    };
  };

  const getDays = (group, current) => {
    let i = group.findIndex(
      (single) => single.FromDateTime === current.FromDateTime
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].value += current.value;
    let j = group.findIndex(
      (single) => single.FromDateTime === current.FromDateTime
    );
    if (j === -1) {
      return [...group, current];
    }
    group[j].peakVol += current.peakVol;
    return group;
  };

  const getMonths = (group, current) => {
    let i = group.findIndex(
      (single) =>
        single.Month === current.Month && single.years === current.years
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].value += current.value; //returns totalVolume
    group[i].peakVol += current.peakVol; //returns peakVol
    return group;
  };


  const perDayData = ans && ans?.map(mapper).reduce(getDays, []);
  const main = ans && JSON.parse(JSON.stringify(perDayData));
  const monthlyView = ans && main.reduce(getMonths, []);
  //Sorting
  let sorted= ans && ans?.sort(function(a,b){
    return new Date(a.FromDateTime) - new Date(b.FromDateTime)});
  ans && console.log("Sorted=",sorted);
  return <JsonToTable json={monthlyView} />;
}

export default Upload3;

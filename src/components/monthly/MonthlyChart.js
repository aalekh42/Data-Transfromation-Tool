import React, { PureComponent } from "react";
import moment from "moment";
import {days_of_a_year} from '../../utils/DateMonths'
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  BarChart,
} from "recharts";

export default class MonthlyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      monthValue: "",
      mpanValue: "",
    };
  }
  handleChangeMonth = (e) => {
    this.setState({
      monthValue: e.target.value,
    });
  };
  handleChangeMpans = (e) => {
    this.setState({
      mpanValue: e.target.value,
    });
  };
  render() {
    const { perDayData, category } = this.props;
    const mpans = category && category.map((elem) => elem.name);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const uniqueYears=perDayData && new Set(perDayData?.map(x=>x.years));
    const dailyView =
      perDayData &&
      perDayData.filter(
        (elem) =>
          elem.Month === `${this.state.monthValue}` &&
          elem.CurveCode === `${this.state.mpanValue}`
      );
    const peakKwh = dailyView && dailyView?.map((x) => x.peakVol);
    const maxKwh = peakKwh && Math.max(...peakKwh);
    const daysInMonth =dailyView && dailyView?.map((x) =>moment(x.FromDateTime).daysInMonth())[0];
    //const totalDaysInYear=perDayData && new Set(perDayData?.map((x)=>days_of_a_year(x.years)));
    const TotalVol = dailyView && dailyView.reduce(
      (accum, curr) => accum + curr.TotalVol,
      0
    );
    const annualVol= perDayData && perDayData?.filter(x=>x.CurveCode === `${this.state.mpanValue}`).reduce((accum,curr)=>accum+curr.TotalVol,0)

    const dailyUpdated =
      dailyView &&
      dailyView.map((elem) => {
        let op = Object.assign(elem, { maxKwh: maxKwh,daysInMonth:daysInMonth,monthlyBase:TotalVol/daysInMonth ,annualVol:annualVol/365});
        return op;
      });
    console.log("daily", dailyUpdated,[...uniqueYears]);
    const options =
      months &&
      months.map((month, index) => (
        <option key={index} value={month}>
          {month}
        </option>
      ));

    return (
      <>

        <select value={this.state.monthValue} onChange={this.handleChangeMonth}>
          <option value="">Select option</option>
          {options}
        </select>
        <select
          value={this.state.mpanValue}
          onChange={this.handleChangeMpans}
          style={{ marginLeft: "15px" }}
        >
          <option value="">Select option</option>

          {mpans &&
            mpans.map((mpan, index) => (
              <option key={index} value={mpan}>
                {mpan}
              </option>
            ))}
        </select>
        <p>
          Selected:
          {this.state.monthValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              {this.state.monthValue},
            </span>
          )}
          {this.state.mpanValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              Mpan:{this.state.mpanValue}
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" aspect={3}>
          <ComposedChart
            width={500}
            height={400}
            data={dailyView}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis xAxisId="0" dataKey="FromDateTime" scale="band" />

            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="peakVol" barSize={20} stackId="a" fill="#7edee7" />

            <Bar dataKey="offPeakVol" barSize={20} stackId="a" fill="#1b8690" />

            <Line type="monotone" dataKey="maxKwh" stroke="blue" dot={{ r: 2 }}/> 
            <Line type="monotone" dataKey="monthlyBase" stroke="red" strokeWidth={3} dot={{ r: 0 }}/> 

            <Line type="monotone" dataKey="annualVol" stroke='darkred' strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}

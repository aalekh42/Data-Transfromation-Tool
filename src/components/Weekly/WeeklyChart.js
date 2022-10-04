import React, { PureComponent } from "react";
import moment from "moment";
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
import '../../css/chart.css'

export default class WeeklyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      yearValue: "",
      mpanValue: "",
    };
  }
  handleChangeMonth = (e) => {
    this.setState({
      yearValue: e.target.value,
    });
  };
  handleChangeMpans = (e) => {
    this.setState({
      mpanValue: e.target.value,
    });
  };
  render() {
    const { weekly, category } = this.props;
    const mpans = category && category.map((elem) => elem.name);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const uniqueYears=weekly && new Set(weekly?.map(x=>x.years));
    const weeklyView =
      weekly &&
      weekly.filter(
        (elem) =>
          elem.years === `${this.state.yearValue}` &&
          elem.CurveCode === `${this.state.mpanValue}`
      );
    const peakKwh = weeklyView && weeklyView?.map((x) => x.peakVol);
    //const maxKwh = peakKwh && Math.max(...peakKwh);

    //MonthlyBase,AnnualBase and  in x-axis adjust all in one line 

    // console.log("weekly Chart",weekly);
    const allYears= [...uniqueYears]
    const options =
    allYears &&
    allYears.map((year, index) => (
        <option key={index} value={year}>
          {year}
        </option>
      ));
      const weelyUpdated =
      weeklyView &&
      weeklyView.map((elem) => {
        let op = Object.assign(elem, { monthWeek:`${elem.Month} week ${elem.weekNo}`});
        return op;
      });
    return (
      <>

        <select value={this.state.yearValue} onChange={this.handleChangeMonth}>
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
          {this.state.yearValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              {this.state.yearValue},
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
            data={weelyUpdated}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis xAxisId="0" dataKey="monthWeek" scale="band" angle={-45} interval={0} dy={15} dx={-10} style={{fontSize:"8px"}}/>

            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="peakVol" barSize={20} stackId="a" fill="#7edee7" />

            <Bar dataKey="offPeakVol" barSize={20} stackId="a" fill="#1b8690" />

            <Line type="monotone" dataKey="maxKwh" stroke="blue" dot={{ r: 2 }}/> 
            {/* <Line type="monotone" dataKey="monthlyBase" stroke="red" strokeWidth={3} dot={{ r: 0 }}/> 

            <Line type="monotone" dataKey="annualVol" stroke='darkred' strokeDasharray="5 5" /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}

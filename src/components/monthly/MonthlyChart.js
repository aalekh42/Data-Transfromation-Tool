import React, { PureComponent } from "react";
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
    const dailyView =
      perDayData &&
      perDayData.filter(
        (elem) =>
          elem.Month === `${this.state.monthValue}` &&
          elem.CurveCode === `${this.state.mpanValue}`
      );
    //get monthlybase and annual base as well
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

          {mpans.map((mpan, index) => (
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
            {/* <XAxis
              xAxisId="1"
              dataKey="CurveCode"
              allowDuplicatedCategory={false}
            /> */}
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="peakVol" barSize={20} stackId="a" fill="#7edee7" />
            <Bar dataKey="offPeakVol" barSize={20} stackId="a" fill="#1b8690" />
            {/* <Line type="monotone" dataKey="maxKwh" stroke='blue' /> */}

            {/* <Line type="monotone" dataKey="offPeakVol" stroke="#1b8690" /> */}
            {/* <Scatter dataKey="weekendVol" fill="red" /> */}
            {/* <Line type="monotone" dataKey="MonthlyBase" stroke='red' strokeDasharray="5 5" /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}

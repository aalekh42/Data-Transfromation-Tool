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

export default class AggregatedChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      monthValue: "",
      mpanValue: "",
    };
  }
  handleChangeMpans = (e) => {
    this.setState({
      mpanValue: e.target.value,
    });
  };
  render() {
    const { monthlyView, categoryItems } = this.props;
    const mpans = categoryItems && categoryItems.filter(elem=>elem.isChecked===true).map((elem) => elem.name);

    const aggregatedView =
      monthlyView &&
      monthlyView.filter(
        (elem) => elem.CurveCode === `${this.state.mpanValue}`
      );
    return (
      <>
        <span>Choose Mpan:</span>
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
          {this.state.mpanValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              Mpan:{this.state.mpanValue}{" "}
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" aspect={3}>
          <ComposedChart
            width={500}
            height={400}
            data={aggregatedView}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="MonthYear" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="peakVol" barSize={20} stackId="a" fill="#7edee7" />
            <Bar dataKey="offPeakVol" barSize={20} stackId="a" fill="#1b8690" />
            <Line type="monotone" dataKey="maxKwh" stroke="blue" />

            {/* <Line type="monotone" dataKey="offPeakVol" stroke="#1b8690" /> */}
            {/* <Scatter dataKey="weekendVol" fill="red" /> */}
            <Line
              type="monotone"
              dataKey="MonthlyBase"
              stroke="red"
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}

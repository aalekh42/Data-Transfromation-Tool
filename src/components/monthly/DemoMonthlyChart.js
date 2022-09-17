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

export default class DemoMonthlyChart extends PureComponent {
  render() {
    const { dailyView } = this.props;
    const onlyFeb = dailyView && dailyView.filter((elem)=>elem.Month=== 'Feb')
    return (
      <ResponsiveContainer width="100%" aspect={3}>
        <ComposedChart
          width={500}
          height={400}
          data={onlyFeb}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="FromDateTime" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* <Area type="monotone" dataKey="TotalVol" fill="#8884d8" stroke="#8884d8" /> */}
          <Bar dataKey="peakVol" barSize={20} stackId="a" fill="#7edee7" />
          <Bar dataKey="offPeakVol" barSize={20} stackId="a" fill="#1b8690" />
          <Line type="monotone" dataKey="maxKwh" stroke='blue' />

          {/* <Line type="monotone" dataKey="offPeakVol" stroke="#1b8690" /> */}
          {/* <Scatter dataKey="weekendVol" fill="red" /> */}
          {/* <Line type="monotone" dataKey="MonthlyBase" stroke='red' strokeDasharray="5 5" /> */}
          {/* <Line type="monotone" dataKey="weekendVol" stroke='green' strokeDasharray="5 5" /> */}

        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

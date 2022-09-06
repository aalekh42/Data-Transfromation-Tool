import React, { PureComponent } from 'react';
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
  BarChart
} from 'recharts';

export default class AggregatedChart extends PureComponent {

  render() {
    const {monthlyView}= this.props;
    return (
      <ResponsiveContainer width="100%" aspect={3}>
        <ComposedChart
          width={500}
          height={400}
          data={monthlyView}
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
          <Area type="monotone" dataKey="TotalVol" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="peakVol" barSize={20} fill="#413ea0" />
          <Bar dataKey="TotalVol" barSize={20} fill="green" />

          <Line type="monotone" dataKey="offPeakVol" stroke="#ff7300" />
          <Scatter dataKey="weekendVol" fill="red" />
          <Line type="monotone" dataKey="MonthlyBase" stroke='teal' />

        </ComposedChart>
        {/* <BarChart width={500} height={500} data={data} >
            <CartesianGrid />
            <XAxis dataKey="MonthYear" />
            <YAxis />
            <Bar dataKey="peakVol" stackId="a" fill="#8884d8" />
            <Bar dataKey="TotalVol" stackId="a" fill="#82ca9d" />
        </BarChart> */}
      </ResponsiveContainer>
    );
  }
}

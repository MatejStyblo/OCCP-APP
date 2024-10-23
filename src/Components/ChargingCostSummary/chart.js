import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ElectricityConsumptionChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <h1>Spotřeba elektriky</h1>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="consumption" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ElectricityConsumptionChart;

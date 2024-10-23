import React, { useEffect, useState } from "react";
import "./chargingCostSummary.css";
import Chart from "./chart";
const ChargingCostSummary = () => {
  const [summaryCost, setSummaryCost] = useState([]);
  const [error, setError] = useState(null);
  console.log(summaryCost);

  useEffect(() => {
    const fetchSummaryCost = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "http://localhost:5000/api/charging/logs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSummaryCost(data);
        } else {
          throw new Error("Failed to fetch logs");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSummaryCost();
  }, []);
  const chartData = summaryCost.map((summary) => ({
    date: summary.date,
    consumption: parseFloat(summary.cost), // Převod stringu na číslo
  }));

  return (
    <div className="table_component" role="region" tabIndex="0">
      {error && <p>{error}</p>}

      <h1 className="title">Denní útrata</h1>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {summaryCost.map((summary, index) => {
            const [year, month, day] = summary.date.split("-");
            const formattedDate = `${parseInt(day)}.${parseInt(month)}.${year}`;

            return (
              <tr key={index}>
                <td>{formattedDate}</td>
                <td>{summary.cost}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Chart data={chartData} />
    </div>
  );
};

export default ChargingCostSummary;
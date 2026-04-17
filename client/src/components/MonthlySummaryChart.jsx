import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function MonthlySummaryChart({ expenses }) {
  const monthlyTotalsMap = expenses.reduce((accumulator, expense) => {
    const expenseDate = new Date(expense.date);
    const monthKey = `${expenseDate.getFullYear()}-${String(
      expenseDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthLabel = expenseDate.toLocaleString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const currentMonthData = accumulator[monthKey] || {
      month: monthLabel,
      total: 0,
    };

    currentMonthData.total += Number(expense.amount);
    accumulator[monthKey] = currentMonthData;
    return accumulator;
  }, {});

  const chartData = Object.entries(monthlyTotalsMap)
    .sort(([firstMonth], [secondMonth]) => firstMonth.localeCompare(secondMonth))
    .map(([, value]) => ({
      month: value.month,
      total: Number(value.total.toFixed(2)),
    }));

  if (chartData.length === 0) {
    return (
      <p className="empty-state">
        Add a few expenses to see your monthly summary chart.
      </p>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlySummaryChart;

import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlySummaryChart from "./components/MonthlySummaryChart";

const API_BASE_URL = "http://localhost:5001";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchExpenses() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/expenses`);

      if (!response.ok) {
        throw new Error("Failed to fetch expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      setErrorMessage("Could not load expenses. Please start the server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function handleAddExpense(expenseData) {
    try {
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense.");
      }

      const savedExpense = await response.json();
      setExpenses((currentExpenses) => [...currentExpenses, savedExpense]);
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  }

  async function handleDeleteExpense(expenseId) {
    try {
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense.");
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      setErrorMessage("Could not delete the expense. Please try again.");
    }
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-left" />
      <div className="background-glow background-glow-right" />

      <main className="app-container">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Personal Finance</p>
            <h1>Expense Tracker</h1>
            <p className="hero-text">
              Track your spending, review your recent purchases, and see a clear
              monthly summary in one simple dashboard.
            </p>
          </div>

          <div className="summary-pill">
            <span>Total Recorded</span>
            <strong>${totalExpenses.toFixed(2)}</strong>
          </div>
        </section>

        {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

        <section className="content-grid">
          <div className="panel">
            <h2>Add Expense</h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          <div className="panel chart-panel">
            <h2>Monthly Summary</h2>
            <MonthlySummaryChart expenses={expenses} />
          </div>
        </section>

        <section className="panel">
          <div className="list-header">
            <h2>All Expenses</h2>
            <span>{expenses.length} items</span>
          </div>

          {isLoading ? (
            <p className="empty-state">Loading expenses...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

function ExpenseList({ expenses, onDeleteExpense }) {
  if (expenses.length === 0) {
    return (
      <p className="empty-state">
        No expenses yet. Add your first expense to get started.
      </p>
    );
  }

  const sortedExpenses = [...expenses].sort(
    (firstExpense, secondExpense) =>
      new Date(secondExpense.date) - new Date(firstExpense.date)
  );

  return (
    <div className="expense-list">
      {sortedExpenses.map((expense) => (
        <article className="expense-card" key={expense.id}>
          <div>
            <div className="expense-card-top">
              <h3>{expense.title}</h3>
              <span className="category-badge">{expense.category}</span>
            </div>
            <p className="expense-date">
              {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>

          <div className="expense-card-actions">
            <strong>${Number(expense.amount).toFixed(2)}</strong>
            <button onClick={() => onDeleteExpense(expense.id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ExpenseList;

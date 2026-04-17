import { useState } from "react";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

const initialFormState = {
  title: "",
  amount: "",
  category: "Food",
  date: "",
};

function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onAddExpense(formData);
      setFormData(initialFormState);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          type="text"
          name="title"
          placeholder="e.g. Dinner with friends"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Amount
        <input
          type="number"
          name="amount"
          placeholder="e.g. 24.99"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;

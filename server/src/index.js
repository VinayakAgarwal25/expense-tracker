const express = require("express");
const cors = require("cors");
const { readExpenses, writeExpenses } = require("./storage");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/expenses", async (req, res) => {
  try {
    // Read the latest saved expenses every time the client requests them.
    const expenses = await readExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Could not read expenses." });
  }
});

app.post("/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number." });
  }

  try {
    const expenses = await readExpenses();

    // A simple unique id is enough here because we are only storing data locally.
    const newExpense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Could not save the expense." });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const expenses = await readExpenses();
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== req.params.id
    );

    if (updatedExpenses.length === expenses.length) {
      return res.status(404).json({ message: "Expense not found." });
    }

    await writeExpenses(updatedExpenses);
    res.json({ message: "Expense deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the expense." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

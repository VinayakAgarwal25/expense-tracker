const fs = require("fs/promises");
const path = require("path");

const expensesFilePath = path.join(__dirname, "..", "data", "expenses.json");

async function readExpenses() {
  try {
    const fileContents = await fs.readFile(expensesFilePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeExpenses(expenses) {
  await fs.writeFile(expensesFilePath, JSON.stringify(expenses, null, 2));
}

module.exports = {
  readExpenses,
  writeExpenses,
};

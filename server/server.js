const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://egodf1:LIJp1aZi0Vlbb44n@expensetrackerdb.5sb2q.mongodb.net/?retryWrites=true&w=majority&appName=ExpenseTrackerDB')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Expense schema and model
const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
// POST: Add a new expense
app.post('/api/expenses', async (req, res) => {
    const { amount, category, description, date } = req.body;
    const expense = new Expense({ amount, category, description, date });
    try {
        const savedExpense = await expense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: Fetch all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/expenses/summary', async (req, res) => {
    try {
        const expenses = await Expense.find();

        // Calculate total expenses
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Group expenses by category
        const categoryData = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        // Group expenses by year and month
        const monthlyData = expenses.reduce((acc, expense) => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'short' });

            if (!acc[year]) {
                acc[year] = {};
            }
            if (!acc[year][month]) {
                acc[year][month] = 0;
            }
            acc[year][month] += expense.amount;
            return acc;
        }, {});

        const summary = {
            totalExpenses,
            categoryData,
            monthlyData,
        };

        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch summary data.' });
    }
});

app.put('/api/expenses/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(204).send(); // No content
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
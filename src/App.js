import React, { useState, useEffect } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import './App.css';
import axios from 'axios';

function App() {
    const [expenses, setExpenses] = useState([]);

    // Fetch expenses from the backend
    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses');
            setExpenses(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const addExpense = async (newExpense) => {
        try {
            await axios.post('http://localhost:5000/api/expenses', newExpense);
            fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const editExpense = async (expense) => {
        const updatedExpense = { ...expense, description: "Updated description!" }; // Example update
        try {
            await axios.put(`http://localhost:5000/api/expenses/${expense._id}`, updatedExpense);
            fetchExpenses(); // Refresh the list after editing
        } catch (err) {
            console.error(err);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            fetchExpenses(); // Refresh the list after deleting
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="App">
            <h1>Expense Tracker</h1>
            <AddExpense onAddExpense={addExpense} />
            <ExpenseList
                expenses={expenses}
                onEditExpense={editExpense}
                onDeleteExpense={deleteExpense}
            />
        </div>
    );
}

export default App;
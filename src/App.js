import React, { useState, useEffect } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import './App.css';
import axios from 'axios';

function App() {
    const [expenses, setExpenses] = useState([]); // Initialize expenses as an empty array

    // Fetch expenses from the backend
    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses');
            setExpenses(response.data); // Update state with fetched data
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExpenses(); // Fetch expenses on mount
    }, []);

    const addExpense = async (newExpense) => {
        try {
            await axios.post('http://localhost:5000/api/expenses', newExpense);
            fetchExpenses(); // Refresh the list after adding a new expense
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='App'>
            <div className='Container'>
              <h1>Expense Tracker</h1>
              <AddExpense onAddExpense={addExpense} />
              <ExpenseList expenses={expenses} />
            </div>
        </div>
    );
}

export default App;

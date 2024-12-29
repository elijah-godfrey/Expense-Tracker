// App.js
import React, { useState, useEffect } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import './App.css';
import axios from 'axios';

function App() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState(['Food', 'Travel', 'Groceries', 'Utilities']); // Initial categories

    // Fetch expenses from the backend and sort them by date descending
    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses');
            const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExpenses(sortedExpenses);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            alert('Failed to fetch expenses. Please try again later.');
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const addExpense = async (newExpense) => {
        try {
            await axios.post('http://localhost:5000/api/expenses', newExpense);
            //setExpenses((prevExpenses) => [response.data, ...prevExpenses]); // Prepend new expense
            fetchExpenses();
        } catch (err) {
            console.error('Error adding expense:', err);
            alert(err.response?.data?.error || 'Error adding expense.');
        }
    };

    const editExpense = async (updatedExpense) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/expenses/${updatedExpense._id}`, updatedExpense);
            setExpenses((prevExpenses) =>
                prevExpenses.map((expense) =>
                    expense._id === updatedExpense._id ? response.data : expense
                )
            );
            fetchExpenses();
        } catch (err) {
            console.error('Error updating expense:', err.message);
            alert(err.response?.data?.error || 'Error updating expense.');
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
        } catch (err) {
            console.error('Error deleting expense:', err);
            alert(err.response?.data?.error || 'Error deleting expense.');
        }
    };

    // Function to add a new category
    const addCategory = async (name) => {
        try {
            const response = await axios.post('http://localhost:5000/api/categories', { name });
            setCategories((prevCategories) => [...prevCategories, response.data.name].sort());
            return response.data;
        } catch (err) {
            console.error('Error adding category:', err);
            alert(err.response?.data?.error || 'Error adding category.');
        }
    };

    return (
        <div className="container">
            <h1>Expense Tracker</h1>
            <AddExpense
                onAddExpense={addExpense}
                categories={categories}
                setCategories={setCategories}
                onAddCategory={addCategory}
            />
            <ExpenseList
                expenses={expenses}
                categories={categories}
                setCategories={setCategories}
                onEditExpense={editExpense}
                onDeleteExpense={deleteExpense}
            />
        </div>
    );

}

export default App;

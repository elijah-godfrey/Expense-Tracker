import React from 'react';

const ExpenseList = ({ expenses = [], onEditExpense, onDeleteExpense }) => {
    return (
        <ul>
            {expenses.map((expense) => (
                <li key={expense._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ flex: 1 }}>
                        {expense.amount} - {expense.category} - {expense.description} - {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <button
                        style={{ marginRight: '10px' }}
                        onClick={() => onEditExpense(expense)}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteExpense(expense._id)}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ExpenseList;

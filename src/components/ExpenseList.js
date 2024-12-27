import React from 'react';

const ExpenseList = ({ expenses = [] }) => {
    return (
        <ul>
            {expenses.map((expense) => (
                <li key={expense._id}>
                    {expense.amount} - {expense.category} - {expense.description} - {new Date(expense.date).toLocaleDateString()}
                </li>
            ))}
        </ul>
    );
};

export default ExpenseList;

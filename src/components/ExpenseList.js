import React, { useState } from 'react';
import EditPopup from './EditPopup';

const ExpenseList = ({ expenses = [], onEditExpense, onDeleteExpense }) => {
    const [editingExpense, setEditingExpense] = useState(null);

    const handleSave = (updatedExpense) => {
        onEditExpense({ ...editingExpense, ...updatedExpense });
        setEditingExpense(null); // Close the popup
    };

    const handleCancel = () => {
        setEditingExpense(null); // Close the popup
    };

    return (
        <div>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ flex: 1 }}>
                            {expense.amount} - {expense.category} - {expense.description} - {new Date(expense.date).toLocaleDateString()}
                        </span>
                        <button onClick={() => setEditingExpense(expense)}>Edit</button>
                        <button onClick={() => onDeleteExpense(expense._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {editingExpense && (
                <EditPopup
                    expense={editingExpense}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ExpenseList;

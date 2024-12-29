import React, { useState } from 'react';
import EditPopup from './EditPopup'; // Make sure the import path is correct

const ExpenseList = ({ expenses = [], onEditExpense, onDeleteExpense }) => {
  const [editingExpense, setEditingExpense] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // e.g. '2023-08-01'
  };

  // Called when user presses "Save" in EditPopup
  const handleSave = (updatedFields) => {
    // Merge the updated fields with the currently editing expense
    const updatedExpense = { ...editingExpense, ...updatedFields };

    // Call the parent function to make the PUT request
    onEditExpense(updatedExpense);

    // Close the popup
    setEditingExpense(null);
  };

  // Called when user presses "Cancel" in EditPopup
  const handleCancel = () => {
    setEditingExpense(null);
  };

  return (
    <div className="expenses-container">
      {/* Header */}
      <div className="expenses-header">
        <div>Date</div>
        <div>Category</div>
        <div>Amount</div>
        <div>Description</div>
        <div></div>
      </div>

      {/* Expense Items */}
      {expenses.map((expense) => (
        <div className="expense-item" key={expense._id}>
          <div>{formatDate(expense.date)}</div>
          <div>{expense.category}</div>
          <div>${expense.amount.toFixed(2)}</div>
          <div>{expense.description}</div>
          <div className="actions-buttons">
            {/* Open the popup for this expense */}
            <button onClick={() => setEditingExpense(expense)}>Edit</button>

            <button
              className="delete-button"
              onClick={() => onDeleteExpense(expense._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Render EditPopup only if there is an expense being edited */}
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

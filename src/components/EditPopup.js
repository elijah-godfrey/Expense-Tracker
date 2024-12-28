import React, { useState } from 'react';

const EditPopup = ({ expense, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "date") {
            const localDate = new Date(value); // Create a date object
            // Adjust for time zone offset to normalize to local midnight
            // https://stackoverflow.com/a/14569783
            const normalizedDate = new Date(localDate.getTime() + Math.abs(localDate.getTimezoneOffset() * 60000));
            setFormData({ ...formData, [name]: normalizedDate.toISOString() }); // Store as ISO string
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Edit Expense</h3>

                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    placeholder="Amount"
                    onChange={handleChange}
                />

                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    placeholder="Category"
                    onChange={handleChange}
                />

                <label>Description:</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    placeholder="Description"
                    onChange={handleChange}
                />

                <label>Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date.split('T')[0]} // Format ISO string to YYYY-MM-DD
                    onChange={handleChange}
                />

                <div className="popup-actions">
                    <button onClick={() => onCancel()}>Cancel</button>
                    <button onClick={() => onSave(formData)}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditPopup;

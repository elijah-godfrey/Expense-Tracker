import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const AddExpense = ({ onAddExpense, categories, setCategories }) => {
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        amount: '',
        date: '',
    });

    const handleCategoryChange = (selectedOption) => {
        if (!selectedOption) {
            setFormData({ ...formData, category: '' });
            return;
        }

        const newCategory = selectedOption.value;

        if (!categories.includes(newCategory)) {
            const updatedCategories = [...categories, newCategory].sort();
            setCategories(updatedCategories);
        }

        setFormData({ ...formData, category: newCategory });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.category && formData.description && formData.amount && formData.date) {
            onAddExpense(formData);
            setFormData({
                category: '',
                description: '',
                amount: '',
                date: '',
            });
        }
    };

    return (
        <div className="add-expense-container">
            <div className="add-expense-title">Add New Expense</div>
            <form className="add-expense-form" onSubmit={handleSubmit}>
                <div className="react-select-container">
                    <CreatableSelect
                        isClearable
                        options={categories.map((cat) => ({ label: cat, value: cat }))}
                        onChange={handleCategoryChange}
                        value={formData.category ? { label: formData.category, value: formData.category } : null}
                        placeholder="Select Category"
                        classNamePrefix="react-select"
                    />
                </div>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    placeholder="Description"
                    className="description"
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    placeholder="Amount"
                    className="amount"
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    className="date-input"
                    onChange={handleChange}
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddExpense;

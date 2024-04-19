import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Pie } from 'react-chartjs-2'; // Import Pie component from react-chartjs-2
import './Dashboard.css'; // Import CSS file for styling

function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '', // Change the default value to an empty string
    category: '', // Remove the default category
    date: new Date().toISOString().slice(0, 10), // Extract "yyyy-MM-dd" part
  });

  const predefinedCategories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping']; // Add predefined categories

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const snapshot = await firebase.firestore().collection('expenses').where('userId', '==', user.uid).get();
        const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [user]);

  const handleAddExpense = async () => {
    try {
      await firebase.firestore().collection('expenses').add({
        ...newExpense,
        userId: user.uid,
        amount: parseFloat(newExpense.amount) || 0, // Convert amount to number or default to 0 if empty string
      });
      const snapshot = await firebase.firestore().collection('expenses').where('userId', '==', user.uid).get();
      const updatedExpensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(updatedExpensesData);
      setNewExpense({
        name: '',
        amount: '', // Reset amount to empty string
        category: '', // Reset category to empty string
        date: new Date().toISOString().slice(0, 10), // Reset date to current date
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleRemoveExpense = async (expenseId) => {
    try {
      await firebase.firestore().collection('expenses').doc(expenseId).delete();
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Error removing expense:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Function to calculate total amount spent in each category
  const calculateCategoryAmounts = () => {
    const categoryAmounts = {};
    expenses.forEach(expense => {
      const category = expense.category;
      const amount = parseFloat(expense.amount); // Convert amount to number
      if (categoryAmounts[category]) {
        categoryAmounts[category] += amount;
      } else {
        categoryAmounts[category] = amount;
      }
    });
    return categoryAmounts;
  };

  // Data for the pie chart
  const pieChartData = {
    labels: Object.keys(calculateCategoryAmounts()),
    datasets: [
      {
        data: Object.values(calculateCategoryAmounts()),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.email}</h2>
      <button onClick={signOut}>Sign Out</button>

      <h3>Expenses</h3>
      <div>
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {predefinedCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.name} - ${expense.amount}
            <button onClick={() => handleRemoveExpense(expense.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Expense Distribution by Category</h3>
      <Pie data={pieChartData} />
    </div>
  );
}

export default Dashboard;

import React, { useState } from "react";
import styled from "styled-components";
import firebase from 'firebase/compat/app';
import 'firebase/firestore'; 
import 'firebase/compat/auth';

const Container = styled.div`
  text-align: center;
  border: 1px solid #000;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 0px;
  outline: none;
  border-radius: 5px;
  margin: 5px 0;
  border: 1px solid #000;
`;

const SubmitBtn = styled.button`
  background-color: #44e610;
  color: #fff;
  border-radius: 5px;
  padding: 10px 20px;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: #44e610;
  }
`;

const AddTransaction = ({ setToggle, userId, transactions, setTransactions }) => {
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = async () => {
    if (!details || !amount) {
      alert("Please enter both details and amount");
      return;
    }
    try {
      const currentDate = new Date().toISOString().substring(0, 10); // Extract "yyyy-MM-dd" part
      const newTransaction = {
        details,
        amount: parseFloat(amount),
        type,
        userId,
        date: currentDate,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const docRef = await firebase.firestore().collection("expenses").add(newTransaction);
      setTransactions([...transactions, { id: docRef.id, ...newTransaction }]);
      setToggle(false);
      setDetails("");
      setAmount("");
      setType("expense");
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="Enter Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <SubmitBtn onClick={handleSubmit}>Add</SubmitBtn>
    </Container>
  );
};

export default AddTransaction;

import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled from "styled-components";
import firebase from 'firebase/compat/app';
import 'firebase/firestore'; 
import 'firebase/compat/auth';
import AddTransaction from "./AddTransaction";
import OverviewComponent from "./OverviewComponent";
import TransactionsContainer from "./TransactionsContainer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 100%;
  background-color: #fff;
  padding: 30px 20px;
  border: 1px solid #000;
  border-radius: 5px;
  margin: 10px;
`;

const THeading = styled.div`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #44e610;
`;

const Tracker = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <Container>
      <THeading>Expense Tracker</THeading>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          {/* Add your expense tracking components here */}
        </>
      ) : (
        <p>Please log in to continue</p>
      )}
    </Container>
  );
};

export default Tracker;

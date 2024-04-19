import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import 'firebase/compat/auth';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const firebaseConfig = {
  apiKey: "AIzaSyDFfzkgHF85Gkcm6J-6ZCTYhxQEXCpQha0",
  authDomain: "myexpense-34928.firebaseapp.com",
  projectId: "myexpense-34928",
  storageBucket: "myexpense-34928.appspot.com",
  messagingSenderId: "866255289545",
  appId: "1:866255289545:web:a070628b004337492c6118",
  measurementId: "G-FWTD0WYGNL"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/signup" element={<SignUp signUp={signUp} />} />
          <Route path="/login" element={<Login signIn={signIn} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} signOut={signOut} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

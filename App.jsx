import React from 'react';
import AuthForm from './components/login';
import ChatInterface from './components/chat';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes> {/* Wrap Routes component around Route components */}
              <Route path="/" element={<AuthForm />} />
              <Route path="/chat" element={<ChatInterface />} />
            </Routes>
    </Router>
    
      
  );
};

export default App;


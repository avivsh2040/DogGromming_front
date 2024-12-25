import './App.scss';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './context/authProvider'; // Importing AuthProvider

// Components
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import WaitingList from './components/WaitingList/WaitingList';

function App() {
  return (
    <AuthProvider> {/* need to check why it doesn't work */}
      <Router>
        <div className="App">
          <header className="App-header">
            <nav className="navbar">
              <Link to="/" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
              {/* <Link to="/waiting-list" className="nav-link">Waiting List</Link> */}
            </nav>
          </header>
          <main className="main">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/waiting-list" element={<WaitingList />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;




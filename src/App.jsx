import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import CreatePost from './Components/CreatePost';
import PostDetails from './Components/PostDetails';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetails />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;



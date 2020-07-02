import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Navbar from './components/navbar';
import Poll from './components/poll';
import Admin from './components/admin';
function App() {
  return (
    <Router>
    <div className="container">
      <Navbar/>
      <br/>
      <Route path="/" exact component={Poll}/>
      <Route path="/admin" component={Admin}/>
    </div>
    </Router>
  );
}

export default App;

//Teenuste impordi algus
import React from 'react';
import { BrowserRouter as Router, Route,  } from 'react-router-dom';
import { HomePage } from './containers/HomePage';
import { LoginPage } from './containers/LoginPage/LoginPage';
import { JoinEventPage } from './containers/JoinEventPage/JoinEventPage';
import { PrivateRoute } from './components/PrivateRoute';
import { EventPage } from './containers/EventPage';
// eslint-disable-next-line
import db from "./firebase"; 
//Teenuste impordi lõpp


//Pealeht algus
function App() {
  return (
    <div className="App">
      <Router>
        {/* ainult sisselogitud kasutaja näeb seda */}
        <PrivateRoute path="/" exact component={HomePage}></PrivateRoute>
        <PrivateRoute path="/EventPage" exact component={EventPage}></PrivateRoute>
        
        <Route path="/Login" component={LoginPage}></Route>
        <Route path="/Join" component={JoinEventPage}></Route>
      </Router>

    </div>
  );
}

//Export
export default App;
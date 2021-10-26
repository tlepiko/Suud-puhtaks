//Teenuste impordi algus
import React from 'react';
import { BrowserRouter as Router, Route,  } from 'react-router-dom';
import { HomePage } from './containers/HomePage';
import { LoginPage } from './containers/LoginPage';
import { JoinEventPage } from './containers/JoinEventPage';
import { PrivateRoute } from './components/PrivateRoute';
import { EventPage } from './containers/EventPage';
import { PublicEventPage } from './containers/PublicEventPage';
import { ModeratorPage } from './containers/ModeratorPage';
import { ModeratedEvent } from './containers/ModeratedEvent';
import { Archive } from './containers/Archive';
// eslint-disable-next-line
//Teenuste impordi lõpp


//Pealeht algus
function App() {
  return (
    <div className="App">
      <Router>
        {/* ainult sisselogitud kasutaja näeb seda */}
        <PrivateRoute path="/" exact component={HomePage}></PrivateRoute>
        <PrivateRoute path="/EventPage" exact component={EventPage}></PrivateRoute>
        <PrivateRoute path="/PublicEventPage" exact component={PublicEventPage}></PrivateRoute>
        <PrivateRoute path="/ModeratorPage" exact component={ModeratorPage}></PrivateRoute>
        <PrivateRoute path="/ModeratedEvent" exact component={ModeratedEvent}></PrivateRoute>
        <PrivateRoute path="/Archive" exact component={Archive}></PrivateRoute>
        
        
        <Route path="/Login" component={LoginPage}></Route>
        <Route path="/Join" component={JoinEventPage}></Route>
      </Router>

    </div>
  );
}

//Export
export default App;
import React from "react";
import logo from './logo.svg';
import CreateOrder from './components/Create'
import ViewTable from './components/View'
import ViewFirm from './components/ViewFirm'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Все заявки</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create/">Новая заявка</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/create/" component={CreateOrder} />
          <Route path="/firms/:slug/info" component={ViewFirm} />
          <Route path="/" component={ViewTable} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

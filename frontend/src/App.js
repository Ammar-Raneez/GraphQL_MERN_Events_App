import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Auth from './pages/Auth';
import Booking from './pages/Booking';
import Event from './pages/Event';
import './App.css';
import { useStateValue } from './context/auth-context';

function App() {
  const [stateValue] = useStateValue();

  return (
    <BrowserRouter>
      <Navigation />
      <main className="main-content">
        <Switch>
          {!stateValue?.user?.token && <Route path="/auth" component={Auth} />}
          {stateValue?.user?.token && <Redirect from="/" to="/events" exact />}
          {stateValue?.user?.token && <Redirect from="/auth" to="/events" exact />}
          <Route path="/events" component={Event} />
          {stateValue?.user?.token && (
            <Route path="/bookings" component={Booking} />
          )}
          {!stateValue?.user?.token && <Redirect to="/auth" exact />}
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;

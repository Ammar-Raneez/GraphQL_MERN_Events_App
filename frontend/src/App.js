import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Booking from './pages/Booking';
import Event from './pages/Event';

function App() {
  return (
    <BrowserRouter>
      <Redirect from="/" to="/auth" exact />
      <Route path="/auth" component={Auth} />
      <Route path="/events" component={Event} />
      <Route path="/bookings" component={Booking} />
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStateValue } from '../../context/auth-context';
import { actionTypes } from '../../context/reducer';
import './Navigation.css';

function Navigation() {
  const [stateValue, dispatch] = useStateValue();

  const onLogout = () => {
    dispatch({
      type: actionTypes.REMOVE_USER
    });
  }

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!stateValue?.user?.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {stateValue?.user?.token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;

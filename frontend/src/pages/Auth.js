import React, { useRef, useState } from 'react';
import './Auth.css';

function Auth() {
  const [isLogIn, setisLogIn] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmitHandler = async event => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogIn) {
      requestBody = {
        query: `
          mutation {
            createUser(user: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }
        `
      };
    }

    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <form className="auth-form" onSubmit={onSubmitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setisLogIn(!isLogIn)}>
          Switch to {isLogIn ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
}

export default Auth;

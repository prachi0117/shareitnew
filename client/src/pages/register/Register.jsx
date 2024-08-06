import "./register.css";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();


  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">ShareIt</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on ShareIt.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" className="loginInput" required ref={username}/>
            <input placeholder="Email" className="loginInput" required type="email" ref={email}/>
            <input placeholder="Password" className="loginInput" required type="password" ref={password}/>
            <input placeholder="Password Again" className="loginInput" required type="password" ref={passwordAgain}/>
            <button className="loginButton" type="submit">Sign Up</button>
            <Link to="/login" >
            <button className="loginRegisterButton">
              Already Registered?
            </button>
            </Link>
           
          </form>
        </div>
      </div>
    </div>
  );
}
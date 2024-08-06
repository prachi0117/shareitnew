import "./topbar.css";
import { Link } from "react-router-dom";
import { Search, Person, Chat } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import {  useContext } from "react";
import { useNavigate } from "react-router-dom";
export default function Topbar() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  

  const {user} = useContext(AuthContext)
  const handleLogout = () => {
    console.log("in handleLogout", user);
    localStorage.removeItem("user"); 
    dispatch({ type: 'LOGOUT' }); 
    console.log("in handleLogout", user);
    navigate("/register"); 
  };

  
  
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ShareIt</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        <Link to="/" style={{ textDecoration: "none" , color:"white" }}>
          <span className="topbarLink">Homepage</span>
        </Link>
          {/* <span className="topbarLink">Logout</span> */}
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          
        </div>
        <Link to="/login" style={{textDecoration: "none" , color:"white"}}>
        <button className="topbarLink" onClick={handleLogout}>Logout</button>
        </Link>

        <span className="topbarLink">{`Hi! ${user.username}`}</span>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
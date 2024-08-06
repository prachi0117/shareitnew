import "./rightbar.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
export default function Rightbar({ user }) {
  
  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user:currentUser, dispatch} = useContext(AuthContext)
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
    coverPicture: "",
    city: ""
  });

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const handleEditClick = () => {
    if (currentUser._id === user._id) {
      setProfileData({
        name: currentUser.name,
        bio: currentUser.bio,
        profilePicture: currentUser.profilePicture,
        coverPicture: currentUser.coverPicture,
        city: currentUser.city
      });
      setShowEditModal(true);
    } else {
      alert("You can only edit your own profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setProfileData({
        ...profileData,
        [name]: files[0] // Keep the file object
      });
    }
  };

  const handleUpdate = async () => {
    console.log(currentUser._id,user._id);
    
    try {
      if (currentUser._id !== user._id) {
        alert("You can only update your own profile.");
        return;
      }
      // const formData = new FormData();
      // formData.append("name", profileData.name);
      // formData.append("bio", profileData.bio);
      // if (profileData.profilePicture) {
      //   formData.append("profilePicture", profileData.profilePicture);
      // }
      // if (profileData.coverPicture) {
      //   formData.append("coverPicture", profileData.coverPicture);
      // }
      // formData.append("city", profileData.city);
      // formData.append("userId", currentUser._id);
      const formData = {
        name: profileData.name,
        bio: profileData.bio,
        city: profileData.city,
        userId: currentUser._id
      };
      console.log(formData);
      const response = await axios.put(`/users/${currentUser._id}`, formData);

      console.log(response.data);
      dispatch({ type: "UPDATE_PROFILE", payload: profileData });
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map(friend =>(
            <Link to={"/profile/" + friend.username} style={{textDecoration: "none"}}>
            <div className="rightbarFollowing">
            <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
          </Link>
            
          ))}
        </div>
      </>
    ); 
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}

        {user._id === currentUser._id && (
        <button className="Editprofile" onClick={handleEditClick}>
          Edit Profile
        </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Email:</span>
            <span className="rightbarInfoValue">{user.email}</span>
          </div>
          
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map(friend =>(
            <Link to={"/profile/" + friend.username} style={{textDecoration: "none"}}>
            <div className="rightbarFollowing">
            <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
          </Link>
            
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>

      {showEditModal && (
        <div className="editModal">
          <div className="editModalContent">
            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h2>Edit Profile</h2>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
            <label for="profilePicture">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
            <label for="coverPicture">Cover Picture</label>
            <input
              type="file"
              name="coverPicture"
              onChange={handleFileChange}
            />
            <input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleChange}
              placeholder="City"
            />
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}

    </div>
  );
}



/*
name
bio
profile photo
cover photo
city
from 

*/

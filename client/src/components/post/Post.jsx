import "./post.css";
import { useState,useEffect, useContext } from "react";
import axios from "axios";
import {format} from 'timeago.js';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post, onDelete }) {
  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const [user, setUser] = useState({});
  const {user: currentUser} = useContext(AuthContext)
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect( () => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]); 

  const likeHandler =()=>{
    
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }

  const deleteHandler = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
      onDelete(post._id); 
    } catch (err) {
      console.error("Failed to delete the post:", err);
    }
  };


  const handleCommentChange = (e) => {
    console.log(e.target.value); // Log the current input value
    setNewComment(e.target.value); // Update the state with the new input value
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const commentData = {
          userId: currentUser._id,
          username: currentUser.username, // Ensure this is being set correctly
          text: newComment,
        };
        console.log("Comment data:", commentData); // Log the payload being sent
        const res = await axios.post(`/posts/${post._id}/comment`, commentData);
        setComments([...comments, res.data.comments.pop()]); // Adjust as needed
        setNewComment("");
        setShowCommentBox(false); // Hide comment box after submission
      } catch (err) {
        console.error("Failed to post comment:", err.response?.data || err.message);
      }
    }
  };
  

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
          <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
          {/* <span className="postCommentText">{post.comment} Delete</span> */}
            {post.userId === currentUser._id && (  // Show delete button only for the post owner
                <button className="postCommentText" onClick={deleteHandler}>Delete</button>
              )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={`${PF}${post.img}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={() => setShowCommentBox(!showCommentBox)}>{comments.length} comments</span>
          </div>
        </div>
        <div className="postCommentSection">
          {showCommentBox && (
            <div className="postCommentInput">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={handleCommentChange}
              />
              <button onClick={handleCommentSubmit}>Post</button>
            </div>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="postComment">
              <span className="postCommentUser">{comment.username}:</span>
              <span className="postCommentText">{comment.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
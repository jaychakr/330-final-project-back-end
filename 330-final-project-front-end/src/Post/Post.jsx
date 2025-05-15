import './Post.css'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../db.js"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
function Post({post}) {
  const [username, setUsername] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUsername = async() => {
      try {
        const response = await fetch(`${API_URL}/api/details/${post.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const userInfo = await response.json();
        setUsername(userInfo.username);
      } 
      catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    const getUserPhoto = async() => {
      await getDownloadURL(ref(storage, post.userId))
      .then((url) => {
        setUserPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    const getPhoto = async() => {
      await getDownloadURL(ref(storage, post._id))
      .then((url) => {
        setPhotoUrl(url);
      })
      .catch((e) => {
        alert(e);
      })
    }
    const fetchData = async () => {
      try {
        await getUsername();
        await getUserPhoto();
        await getPhoto();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [post._id, post.userId]);
  if (loading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div className="post">
        <div className="post-content">
          <div className="heading">
            <Link to={`/profile/${post.userId}`}><img src={userPhotoUrl} className="profile-photo"/></Link>
            <Link to={`/profile/${post.userId}`} className="user-link"><b><p>{username}</p></b></Link>
          </div>
          <img src={photoUrl} className="post-photo"/>
          <p className="description">{post.description}</p>
        </div>
      </div>
    );
  }
}
  
export default Post;
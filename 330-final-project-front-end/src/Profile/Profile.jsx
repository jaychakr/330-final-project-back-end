import './Profile.css'
import { useState, useEffect } from "react";
import Tile from '../Tile/Tile';
import { useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../db.js"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
function Profile() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
    useEffect(() => {
      const downloadUserDetails = async() => {
        try {
          const response = await fetch(`${API_URL}/api/details/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }
          const userInfo = await response.json();
          setUsername(userInfo.username);
          setBio(userInfo.bio);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      const getUserPhoto = async() => {
        await getDownloadURL(ref(storage, userId))
        .then((url) => {
          setProfilePhotoUrl(url);
        })
        .catch((e) => {
          alert(e);
        })
      } 
      const downloadPosts = async() => {
        try {
          const response = await fetch(`https://330-final-project-production-95c7.up.railway.app/posts/${userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const newPosts = await response.json();
          setPosts(newPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
      downloadUserDetails();
      getUserPhoto();
      downloadPosts();
    }, [userId]);
    return (
      <>
        <div className="intro">
          <div className="photo">
            <img src={profilePhotoUrl}/>
          </div>
          <div className="info">
            <p><b>{ username }</b></p>
            <p>{ bio }</p>
          </div>
        </div>
        <div className="posts">
          {posts.map((post) => (
            <Tile key={post._id} post={post} />
          ))}
        </div>
        <br/>
      </>
    );
}
  
export default Profile;
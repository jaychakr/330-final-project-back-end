import './NewsFeed.css'
import { useState, useEffect } from "react";
import Post from '../Post/Post';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
function NewsFeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const downloadPosts = async() => {
      try {
        const response = await fetch(`${API_URL}/api/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const newPosts = await response.json();
        setPosts(newPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  downloadPosts();
  }, []);
  return (
    <div className="newsFeed">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default NewsFeed;
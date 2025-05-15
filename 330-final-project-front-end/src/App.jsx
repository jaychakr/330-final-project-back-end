import { Routes, Route, useLocation } from "react-router-dom";
import Header from './Header/Header';
import NewsFeed from './NewsFeed/NewsFeed';
import SignUp from './SignUp/SignUp';
import LoginPage from './LoginPage/LoginPage';
import Post from './Post/Post';
import Profile from './Profile/Profile';
import Footer from './Footer/Footer';
import AddPost from './AddPost/AddPost';
import './App.css'

function App() {
  const location = useLocation();
  const noFooterRoutes = ['/login', '/signUp', '/addPost'];
  const hideFooter = noFooterRoutes.includes(location.pathname);
  return (
    <div className="app">
      <Header/>
      <div className="content">
      <Routes>
        <Route path="/" element={<NewsFeed/>}/>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile/:userId" element={<Profile/>}/>
        <Route path="/post" element={<Post/>}/>
        <Route path="/addPost" element={<AddPost/>}/>
      </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App

import "./Header.css";
import instagram2 from '../assets/instagram2.jpg';
import {Link} from "react-router-dom";
function Nav() {
  return (
    <header>
      <img src={instagram2} className='logo'/>
      <Link to="/login"><button>Sign In</button></Link>
    </header>
  );
}

export default Nav;
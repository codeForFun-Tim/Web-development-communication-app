import '../stylesheets/NaviBar.css';
const NaviBar = () => {

  const logout = () => {
    localStorage.clear();  
  };

  return (
    <div>
      <ul id="nav_ul">
        <li className="nav_li">
          <a href="/profile">Profile</a>
        </li>
        <li className="nav_li">
          <a href="/main">Messaging</a>
        </li>
        <li className="nav_li">
          <a href="/status">Status</a>
        </li>
        <li className="nav_li">
          <a href="/status" onClick={logout}>Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default NaviBar;

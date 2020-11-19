import '../stylesheets/NaviBar.css';
const NaviBar = () => {
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
      </ul>
    </div>
  );
};

export default NaviBar;

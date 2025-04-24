import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/loans">Loans</Link>
      <Link to="/cards">Cards</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;

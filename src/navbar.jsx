import { useNavigate } from 'react-router-dom'

const Navbar = (props) => {
    const navigate = useNavigate();

    const navHome = () => {
        navigate(`/${props.user}/lists`)
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/');
    };

    return ( 
        <nav className="navbar">
            <h1>LISTABLE</h1>
            <div className="links">
                <button onClick={navHome}>HOME</button>
                <button onClick={props.menu}>SETTINGS</button>
                <button onClick={logout}>LOG OUT</button>
            </div>
        </nav>
     );
}
 
export default Navbar;
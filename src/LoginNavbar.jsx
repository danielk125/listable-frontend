import { useNavigate } from 'react-router-dom'

const LogInNavbar = () => {
    const navigate = useNavigate();

    const navSignUp = () => {
        navigate(`/`)
    }

    const navLogIn = () => {
        navigate('/login');
    };

    return ( 
        <nav className="navbar">
            <h1>LISTABLE</h1>
            <div className="links">
                <button onClick={navSignUp}>SIGN UP</button>
                <button onClick={navLogIn}>LOG IN</button>
            </div>
        </nav>
     );
}
 
export default LogInNavbar;
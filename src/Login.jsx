import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LogInNavbar from "./LoginNavbar";

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();

        const loginData = { email, password };

        try {
            const response = await fetch(`${apiUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();  
                setErrorMessage(errorData.error);  
                return;  
            }

            const data = await response.json();

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            navigate(`/${data.user.username}/lists`);
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    }

    return (
        <>
            <LogInNavbar />
            <div className="sign-up-box">
                <div className="sign-up-card">
                    <h2>Log in</h2>
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <input 
                            type='text'
                            placeholder='Email'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type='password'
                            placeholder="Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a>{errorMessage}</a>
                        <button type='submit'>
                            Log in
                        </button>
                    </form>
                </div>
            </div>
        </>
        

    )
}

export default Login;
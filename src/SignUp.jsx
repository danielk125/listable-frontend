import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LogInNavbar from "./LoginNavbar";

const SignUp = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordC, setPasswordC] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = () => {
        return emailRegex.test(email);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!validateEmail()){
            setErrorMessage('Please enter a valid email.');
            return;
        }

        if(password != passwordC) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        const newUser = { username, password, email };
        try {
            const response = await fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser), 
            });

            if (!response.ok) {
                const errorData = await response.json();  
                setErrorMessage(errorData.error); 
                return;  
            }

            const data = await response.json();  
            console.log('User created:', data);  
            navigate("/login");
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setEmail('');
            setUsername('');
            setPassword('');
            e.target.reset()
        }
    }

    return (
        <>
            <LogInNavbar />
            <div className="sign-up-box">
                <div className="sign-up-card">
                    <h2>Sign up</h2>
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <input 
                            type='text'
                            placeholder='Email'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type='text'
                            placeholder='Username'
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            type='password'
                            placeholder="Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            type='password'
                            placeholder="Confirm Password"
                            required
                            onChange={(e) => setPasswordC(e.target.value)}
                        />
                        <a>{errorMessage}</a>
                        <button type='submit'>
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </>
        
    )
}

export default SignUp;
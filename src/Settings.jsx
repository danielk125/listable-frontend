import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = (props) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [doubleCheck, setDoubleCheck] = useState(false);
    const [responseStatus, setResponseStatus] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = () => {
        return emailRegex.test(email);
    }

    async function updateUser(e) {
        e.preventDefault();

        if(!email && !username){
            return;
        }

        if(!validateEmail()){
            setErrorMessage('Please enter a valid email.');
            return;
        }

        let updatedUser = { email, username };

        try {
            const response = await fetch(`${apiUrl}/users/update_user/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser), 
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            if(email || username){
                setResponseStatus('Updates Successful!')
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setEmail('');
            setUsername('');
            e.target.reset()
        }
    }

    async function deleteUser() {
        try {
            const response = await fetch(`${apiUrl}/users/delete_user/${user._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const checkAgain = () => {
        if(doubleCheck) {
            deleteUser();
        }
        setDoubleCheck(!doubleCheck);
    }   

    return ( 
        <div className={`settings-menu ${props.isOpen ? 'open' : 'closed'}`}>
            <div className="settings-top">
                <h2>Settings</h2>
                <button onClick={() => {
                        props.toggle();
                        setEmail('');
                        setUsername('');
                        setResponseStatus('');
                        setDoubleCheck(false);
                    }}>Close</button>
            </div>
            <form className="sign-up-form" onSubmit={updateUser}>
                    <input 
                        type='text'
                        value={email}
                        placeholder='Update Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type='text'
                        value={username}
                        placeholder='Update Username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <a style={{color: 'green'}}>{responseStatus}</a>
                    <button type="submit">Submit Changes</button>
                </form>
                <button className='delete-usr-btn' onClick={checkAgain}>{doubleCheck ? 'ARE YOU SURE?' : 'DELETE USER'}</button>
        </div>
     );
}
 
export default Settings;
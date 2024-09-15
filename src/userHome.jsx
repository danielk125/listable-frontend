import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListList from "./list_list";
import Navbar from "./navbar";
import Settings from "./Settings";

const UserHome = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const [lists, setLists] = useState([]);
    const [update, setUpdate] = useState(true);
    const [username, setUsername] = useState(storedUser ? storedUser.username : '');
    const [userId, setUserId] = useState(storedUser ? storedUser._id : '');

    useEffect(() => {
        async function getLists() {
            if (!token) {
                console.error('No token found');
                navigate('/');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/lists/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    console.error(message);
                    return;
                }

                const listArray = await response.json();
                setLists(listArray);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        }

        getLists();
        return;
    }, [update]);

    async function newList(){
        try {
            const response = await fetch(`${apiUrl}/lists/create/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            
            setUpdate(!update);

        } catch (error) {
            console.error('Error creating list:', error);
        }
    }

    async function deleteList(id){
        const itemElement = document.querySelector(`.list-preview[data-id='${id}']`);

        itemElement.style.opacity = '0';

        setTimeout(() => {
            itemElement.style.height = '0';
            itemElement.style.margin = '0';
            itemElement.style.padding = '0';
            itemElement.style.border = '0';
        }, 200);

        setTimeout(async () => {
            try {
                const response = await fetch(`${apiUrl}/lists/${userId}/delete_list/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,  
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    console.error(message);
                    return;
                }
                
                setUpdate(!update);
            } catch (error) {
                console.error('Error deleting list:', error);
            }
        }, 500)
        
    }

    async function updateTitle(list, newTitle){
        if (newTitle == '' || newTitle === list.title) return;
        
        const id = list._id;
        
        try {
            const response = await fetch(`${apiUrl}/lists/${userId}/update_list/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }

            list.title = newTitle;
        } catch (error) {
            console.error('Error updating list:', error);
        }
    }

    const toggleSettings = () => {
        setTimeout(setSettingsMenuVisible(!isSettingsMenuVisible), )
        
    };
    

    return ( 
        <>
            <Navbar user={username} menu={toggleSettings}/>
            <div className="content">
                <div className="home">
                    <ListList user={username} state='lists' newList={newList} lists={lists} title={username + "'s lists"} deleteList={deleteList} updateTitle={updateTitle}/>
                        <Settings toggle={toggleSettings} isOpen={isSettingsMenuVisible}/>
                </div>
            </div>
        </>
        
     );
}
 
export default UserHome;
import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import ItemList from './ItemList';
import Settings from './Settings';

const List = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [username, setUsername] = useState(storedUser ? storedUser.username : '');
    const token = localStorage.getItem('token');
    const [items, setItems] = useState([]);
    const [update, setUpdate] = useState(true);
    const [userId, setUserId] = useState(storedUser ? storedUser._id : '');
    const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);
    const { listId } = useParams();
    const [list, setList] = useState({})

    useEffect(() => {
        async function getItems() {
            if (!token) {
                console.error('No token found');
                navigate('/');
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/lists/${userId}/get_items/${listId}`, {
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

                const data = await response.json();
                setList({
                    _id: data._id,
                    title: data.title,
                    user_id: data.user_id,
                    item_ids: data.item_ids
                })
                setItems(data.items);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }

        getItems();
        return;
    }, [update]);

    async function newItem(){
        try {
            const response = await fetch(`${apiUrl}/lists/${userId}/new_item/${list._id}`, {
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

    async function deleteItem(id){
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
                const response = await fetch(`${apiUrl}/lists/${userId}/${list._id}/delete_item/${id}`, {
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
                console.error('Error deleting item:', error);
            }

        }, 1000)
    }

    async function updateTitle(item, newTitle){
        if (newTitle == '' || newTitle === item.title) return;
        
        const id = item._id;
        
        try {
            const response = await fetch(`${apiUrl}/lists/${userId}/${list._id}/update_item/${id}`, {
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

            item.title = newTitle;
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }

    const toggleSettings = () => {
        setTimeout(setSettingsMenuVisible(!isSettingsMenuVisible), )
        
    };

    return ( 
        <>
            <Navbar user={username} menu={toggleSettings} />
            <div className="content">
                <div className="home">
                    <ItemList user={storedUser} token={token} list={list} state='items' items={items} newItem={newItem} deleteItem={deleteItem} updateTitle={updateTitle}/>
                    <Settings toggle={toggleSettings} isOpen={isSettingsMenuVisible}/>
                </div>
            </div>
        </>
    );
};
 
export default List;

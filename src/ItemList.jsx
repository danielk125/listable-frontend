import { useEffect, useRef, useState } from 'react';


const ItemList = (props) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const prevItemCount = useRef(props.items.length);
    const [isStriked, setIsStriked] = useState([]); 
    const [isOpen, setIsOpen] = useState('');
    const [openedDesc, setOpenedDesc] = useState('');

    useEffect(() => {
        let strikedIds = []; 
        props.items.forEach((item) => {
            if (item.striked) {
                strikedIds.push(item._id);
            }
        });
        setIsStriked(strikedIds); 
    }, [props.items]);

    useEffect(() => {
        const items = document.querySelectorAll('.list-preview');
        const newItems = Array.from(items).slice(prevItemCount.current);
        
        newItems.forEach((item, index) => {
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, (index + 1) * 50); 
        });
        prevItemCount.current = props.items.length;
    }, [props.items]); 

    const isItemStriked = (id) => isStriked.includes(id);

    async function toggleStrikethrough(item){
        if (isStriked.includes(item._id)) {
            setIsStriked(isStriked.filter((strikedId) => strikedId !== item._id));
        } else {
            setIsStriked([...isStriked, item._id]);
        }
        try {
            const response = await fetch(`${apiUrl}/lists/${props.user._id}/${props.list._id}/update_item/${item._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${props.token}`,  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ striked: !item.striked })
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }

        } catch (error) {
            console.error('Error updating item:', error);
        }

        item.striked = !item.striked;
    };

    const openItem = (item) => {
        if (isOpen === item._id){
            setIsOpen('');
            setOpenedDesc('');
        } else {
            setIsOpen(item._id);
            setOpenedDesc(item.description);
        }
    }

    async function updateDesc(item, newDesc) {
        if (item.description === newDesc){
            return
        }
        try {
            const response = await fetch(`${apiUrl}/lists/${props.user._id}/${props.list._id}/update_item/${item._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${props.token}`,  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: newDesc })
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }

        } catch (error) {
            console.error('Error updating item:', error);
        }

        item.description = newDesc;
    }

    return ( 
        <div className="list-list">
            <div className="list-header">
                <h1>{props.list.title}</h1>
                <button onClick={props.newItem}>NEW ITEM</button>
            </div>
            {props.items.map((item) => (
                <div className="list-preview" key={item._id} data-id={item._id} style={{height: isOpen === item._id ? '200px' : 'inherit'}}>
                    <div className="list-preview-header">
                        <input style={{ textDecoration: isItemStriked(item._id) ? 'line-through' : 'none'}}
                            className="list-title"
                            type='text'
                            maxLength='26'
                            placeholder={item.title}
                            onBlur={(e) => props.updateTitle(item, e.target.value)}
                        />
                        <div className="list-button-group">
                            <button className="list-btn" onClick={() => toggleStrikethrough(item)}>Ꞩ</button>
                            <button className="list-btn" onClick={() => openItem(item)}>{item._id === isOpen ? 'CLOSE' : 'OPEN'}</button>
                            <button className="list-btn" onClick={() => props.deleteItem(item._id)}>DELETE</button>
                        </div>
                    </div>
                    
                    {item._id === isOpen ?  <textarea value={openedDesc} onChange={(e) => setOpenedDesc(e.target.value)} onBlur={(e) => updateDesc(item, e.target.value)} />: null}
                </div>
            ))}
        </div>
        
     );
}

export default ItemList;
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';


const ListList = (props) => {
    const navigate = useNavigate();

    const openList = (list) => {
        navigate(`/${props.user}/lists/${list._id}`);
    }

    const prevItemCount = useRef(props.lists.length);

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
        prevItemCount.current = props.lists.length;
    }, [props.lists]); 

    return ( 
        <div className="list-list">
            <div className="list-header">
                <h1>{props.title}</h1>
                <button onClick={props.newList}>NEW LIST</button>
            </div>
            
            {props.lists.map((list) => (
                <div className="list-preview" key={list._id} data-id={list._id}>
                    <div className="list-preview-header">
                        <input 
                            className="list-title"
                            type='text'
                            maxLength='18'
                            placeholder={list.title}
                            onBlur={(e) => props.updateTitle(list, e.target.value)}
                        />
                        <div className="list-button-group">
                            <button className="list-btn" onClick={() => openList(list)}>OPEN</button>
                            <button className="list-btn" onClick={() => props.deleteList(list._id)}>DELETE</button>
                        </div>
                    </div>
                    
                </div>
            ))}
        </div>
        
     );
}
 
export default ListList;
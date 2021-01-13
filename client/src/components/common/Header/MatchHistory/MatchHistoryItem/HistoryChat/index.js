import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../../../../../utils/axios';

const useStyles = makeStyles((theme) => ({

}));

export default function Chat({id_match}) {
    
    const classes = useStyles();

    let [itemChatList, setItemChatList] = useState([<li></li>]);

    function getItemChatList() {
        axios.get('messages/boardmatch/' + id_match)
        .then(res => {
            let messageList = res.data.data;
            let currentItemChatList = [];
            messageList.map((messageItem) => {
                let itemChatContent = messageItem.fromDisplayName + ": " + messageItem.content;
                currentItemChatList.push(renderItemChat(itemChatContent));
            })
            setItemChatList(currentItemChatList);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getItemChatList();
      }, [itemChatList.length])

      function renderItemChat(itemChatContent) {
        return (<li>{itemChatContent}</li>)
    }

    return (
        <div style={{width: 250, backgroundImage: 'url("https://i.gifer.com/3w8M.gif")'}}>
            <div style={{height: 50, color: 'red', textAlign: 'center'}}>
                <h1>Chat</h1>
            </div>
            <div  style={{borderWidth: 'thin', borderStyle: 'solid', borderColor: 'black', height: '530px', overflowX: 'hidden'}}>
                <ul id="chatAreaContent" style={{textAlign: 'left', listStyleType: 'none', display: 'inline'}}>
                    {itemChatList}
                </ul>
            </div>
        </div>
    )
}


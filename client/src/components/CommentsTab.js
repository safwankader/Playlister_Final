import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import CommentCard from './CommentCard';
import AuthContext from '../auth'
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import React, { useContext, useState } from 'react'


function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // An function that increment 👆🏻 the previous state like here 
    // is better than directly setting `value + 1`
  }


function CommentsTab(){
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [text,setText] = useState("");
    const forceUpdate = useForceUpdate();
    
      function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text !== "") {
               addComment() 
            }
        }
    }
    
    function handleUpdateText(event) {
      setText(event.target.value);
    }
    
    function addComment(){
      if (text !== ""  && store.playerList) {
        store.addComment(text); 
     }
      setText("");
    }

    let cannotAddComment = true;
  if(store.playerList !== null && !auth.guest){
    if(store.playerList.published){
      cannotAddComment = false;
    }
      
  }
  let commentCards = <div id='comments-list'></div>
  

  if(store.playerList){
    
    commentCards = 
    <div id='comments-list'>
      <List>
        {
          store.playerList.comments.map((comment, index) => (
            <CommentCard
                index={index}
                comment={comment}
              />
          ))
        }
      </List>
    </div>
  }

    return(
        <div id='comment-tab'>
          {
            commentCards
          }
          <div id="add-comment-input">
            
            <TextField id="add-comment-textfield" onKeyPress={handleKeyPress} disabled={cannotAddComment} onChange={handleUpdateText} value={text} label="Add Comment" variant="filled" />
          </div>
        </div>
    )
}

export default CommentsTab;
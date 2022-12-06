import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import CommentCard from './CommentCard';
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
      if (text !== "") {
        store.addComment(text); 
        forceUpdate();
     }
      setText("");
    }

    let cannotAddComment = true;
  if(store.currentList !== null){
    if(store.currentList.published){
      cannotAddComment = false;
    }
      
  }
  let commentCards = <div id='comments-list'></div>
  if(store.currentList){
    store.currentList.comments.map((comment,index) =>{
      console.log('comment : ' + JSON.stringify(comment))
      console.log('index: ' + index)
    })
  }
  
  if(store.currentList){
    commentCards = 
    <div id='comments-list'>
      <List>
        {
          store.currentList.comments.map((comment, index) => (
            <CommentCard
                index={index}
                comment={store.currentList.comments[index]}
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
          <Fab 
                color="primary" 
                aria-label="add"
                size="medium"
                id="add-comment-button"
                onClick={addComment}
                disabled={cannotAddComment}
                sx={{my : 1, mr: 1.5}}
            >
                <AddIcon />
            </Fab>
            
            <TextField id="add-comment-textfield" onKeyPress={handleKeyPress} onChange={handleUpdateText} value={text} label="Add Comment" variant="filled" />
          </div>
        </div>
    )
}

export default CommentsTab;
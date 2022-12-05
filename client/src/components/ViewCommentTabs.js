import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import YoutubePlayer from './YoutubePlayer';
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import CommentCard from './CommentCard';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0.3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ViewerCommentTabs() {
  const [value, setValue] = React.useState(0);
  const [text,setText] = useState("");
  const { store } = useContext(GlobalStoreContext);

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
  


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
 }
  setText("");
}

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Player" {...a11yProps(0)} />
          <Tab label="Comments" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        
        <YoutubePlayer/>


        
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div id='comment-tab'>
          {
            commentCards
          }
          <div id="add-comment-input">
          <Fab 
                color="primary" 
                aria-label="add"
                size="small"
                id="add-comment-button"
                onClick={addComment}
                disabled={cannotAddComment}
                sx={{my : 2.5, mr: 1}}
            >
                <AddIcon />
            </Fab>
            
            <TextField id="add-comment-textfield" onKeyPress={handleKeyPress} onChange={handleUpdateText} value={text} label="Add Comment" variant="filled" />
          </div>
        </div>
      </TabPanel>
    </Box>
  );
}
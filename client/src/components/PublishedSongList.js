import * as React from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Grid, Typography, List, ListItem, ListItemText, styled, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';



function PublishedSongList(props) {
    const { store } = useContext(GlobalStoreContext);
    const { listId } = props; 


    function handleChangeSong(event, index) {
        event.stopPropagation();
        store.changeQueueSong(listId, index);
    }
    let list = "";
    if(store.currentList){
        list = 
        <List 
        style={{ width: '90%', fontSize: '35pt' , height : '14cm'}}>
            {
                store.currentList.songs.map((song,index) => (
                    store.songNumberPlaying === index && store.playerList && store.playerList._id === listId ?
                        <ListItem>
                            <b>
                        <ListItemIcon
                        sx={{fontSize : "25pt"}}>
                        {index + 1}. {song.title} by {song.artist}
                        </ListItemIcon>
                        </b>
                        </ListItem> 
                        :
                        <ListItem>
                        <ListItemIcon
                        sx={{fontSize : "25pt"}}>
                            {index + 1}.&nbsp;
                        <Link onClick={(event) => {handleChangeSong(event,index)}}>
                         {song.title} by {song.artist}
                        </Link>
                        </ListItemIcon>
                        </ListItem> 

                ))
            }
            </List>
    }
    

    return (
        <div className='published-song-card-list'>
    <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          
            
              {
                list
              }
        </Grid>
        </Grid>
        </div>
    )
}

export default PublishedSongList;
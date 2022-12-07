import * as React from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Grid, Typography, List, ListItem, ListItemText, styled, ListItemIcon } from '@mui/material';



function PublishedSongList() {
    const { store } = useContext(GlobalStoreContext);
    let list = "";
    if(store.currentList){
        list = 
        <List 
        style={{ width: '90%', fontSize: '35pt' , height : '14cm'}}>
            {
                store.currentList.songs.map((song,index) => (
                    <ListItem>

                        <ListItemIcon
                        sx={{fontSize : "25pt"}}>
                        {index + 1}. {song.title}
                        </ListItemIcon>
                        <ListItemText>
                        
                        </ListItemText>
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
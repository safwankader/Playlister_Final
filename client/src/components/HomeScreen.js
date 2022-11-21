import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import CustomizedInputBase from './CustomInputField';
import Box from '@mui/material/Box';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{  left: '0%' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        listOwner={store.getListOwner(pair._id)}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
               
            {/* <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography> */}
            </div>
            <Box component="div" sx={{ display: 'flex' }}>
            <Box sx={{ '& > :not(style)': { ml: 2, mr: 0.5, mt: 2} }}>
            <Fab
                size="medium"
                color="secondary"
                aria-label='add'
                >
                <AddIcon />
                </Fab>
            <Fab
            
                size="medium"
                color="secondary"
                aria-label='search-lists'
                >
                <ManageSearchIcon />
                </Fab>
            <Fab
                size="medium"
                color="secondary"
                aria-label='search-users'
                >
                <PeopleIcon />
                </Fab>
            </Box>
            <Box sx={{ '& > :not(style)': { left : "50%", ml : 1 } }}>
            <CustomizedInputBase />
            </Box>
                
            </Box>
                

            
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
        </div>)
}

export default HomeScreen;
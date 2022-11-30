import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import CustomizedInputBase from './CustomInputField';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
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

    function handleCloseCurrentList() {
        store.closeCurrentList()
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
                        songs={pair.songs}
                        selected={false}
                        expanded={store.currentList !== null && store.currentList.id === pair._id}
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
                aria-label='home'
                onClick={handleCloseCurrentList}
                >
                <HomeIcon />
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
            <Box sx={{ '& > :not(style)': {display: "flex", left : "50%", mt : 2, ml : 40 } }}>
            <CustomizedInputBase />
            </Box>
                
            </Box>
                

            
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>

            <div id='youtube-player'>
                
            </div>
        </div>)
}

export default HomeScreen;
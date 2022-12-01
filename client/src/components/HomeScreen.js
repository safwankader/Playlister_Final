import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import List from '@mui/material/List';
import NavigationBar from './NavigationBar';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);


    
    
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
            
            <NavigationBar />

            
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
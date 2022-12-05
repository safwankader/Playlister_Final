import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import List from '@mui/material/List';
import NavigationBar from './NavigationBar';
import ViewerCommentTabs from './ViewCommentTabs';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import PublishedListCard from './PublishedListCard';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);


    let modalJSX = "";
    if(store.isEditSongModalOpen()){
        modalJSX = <MUIEditSongModal/>
    }
    if(store.isRemoveSongModalOpen()){
        modalJSX = <MUIRemoveSongModal/>
    }

    if(store.isDeleteListModalOpen()){
        modalJSX = <MUIDeleteModal/>
    }

    let cards = []

    for(let pair in store.loadIdNamePairs){
        cards.push(pair.published ? 
            <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        songs={pair.songs}
                    />
                    :
                    <PublishedListCard 
                        key={pair._id}
                        idNamePair={pair}
                        songs={pair.songs}
                    />
            )
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{  left: '0%' }}>
            {
                store.idNamePairs.map((pair) => ( 
                    
                    pair.published ?
                    <PublishedListCard 
                        key={pair._id}
                        idNamePair={pair}
                        songs={pair.songs}
                    />
                    :
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        songs={pair.songs}
                    />
                    
                    
                ))
            }
            </List>;
    }

    return (
        <div id="playlist-selector">
            
            
            <NavigationBar />   
            
            <div id='home-screen-content'>
            <div id="list-selector-list">
                {
                    listCard
                }
                
            </div>
            <div id='youtube-player'>
                <ViewerCommentTabs/>
            </div>
            </div>
            {modalJSX}

        </div>)
}

export default HomeScreen;
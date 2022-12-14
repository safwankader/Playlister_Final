import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Typography } from '@mui/material'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";
    let statusName = "statusbar";
    if (auth.user !== null) {
        statusName = "statusbar-visible"
    }
    if (store.currentList)
        text = store.currentList.name;
    
    let addListText =<div id="playlister-statusbar" className={statusName}></div> 
    if(!auth.guest){
        addListText =
        <div id="playlister-statusbar" className={statusName}>
        <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
    }

    function handleCreateNewList(event) {
            event.stopPropagation();
            store.createNewList();
            store.loadIdNamePairs();
    }
    return (
            addListText
    );
}

export default Statusbar;
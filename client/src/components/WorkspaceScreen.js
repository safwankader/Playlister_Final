import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../store/index.js'
import AuthContext from '../auth/index.js'
import PeopleIcon from '@mui/icons-material/People';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Fab from '@mui/material/Fab'
import HomeIcon from '@mui/icons-material/Home';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    store.history = useHistory();
    
    function handleCloseModal(event) {
        auth.logoutUser();
    }

    function handleCloseCurrentList() {
        store.closeCurrentList()
    }

    let errorMessage = "";
    let modalJSX = "";
    if (auth.user === null) {
        errorMessage = "User not found, log in again";
    }
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    let songList = "";
    if (store.currentList) {
        songList = <List 
            id="playlist-cards" 
            sx={{ width: '100%'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
                
            }
         </List>; 
         if (auth.user)  {
            if (auth.user.email !== store.currentList.ownerEmail) {
                errorMessage = "User does not own this playlist";
            }   
         }          
    }
    let errorModal = "";
    if (errorMessage !== "") {
        errorModal = <Modal
            open={errorMessage !== ""}
        >
            <Stack sx={{ width: '40%', marginLeft: '30%', marginTop: '20%' }} spacing={2}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                    <Button color="primary" size="small" onClick={handleCloseModal}>
                            Close
                    </Button>
                </Alert>
            </Stack>
        </Modal>
    }



    return (
        
        <Box style={{maxHeight: '83%', overflow: 'auto'}}>
            <Box component="div" sx={{ display: 'flex' }}>
            <Box sx={{ '& > :not(style)': { ml: 2, mr: 0.5, mt: 2} }}>
            <Fab
                size="medium"
                color="secondary"
                aria-label='add'
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
            <Box sx={{ '& > :not(style)': {display: "flex", left : "50%", mt : 2, ml : 20 } }}>

            </Box>
                
            </Box>
         { songList }
         { modalJSX }
         { errorModal }
         </Box>
    )
}

export default WorkspaceScreen;
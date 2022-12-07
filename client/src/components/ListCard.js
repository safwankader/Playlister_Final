import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth';
import { Typography } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { IconButton } from '@mui/material';
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import SongCard from './SongCard.js'
import List from '@mui/material/List';
import EditToolbar from './EditToolbar'
import Button from '@mui/material/Button';
import PublishedSongList from './PublishedSongList';


/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [expanded, setExpanded] = useState(false);
    const { idNamePair, songs,selected} = props;


    console.log(auth.user)


    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text !== "") {
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
            }
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        if(!idNamePair.published){
            toggleEdit();
        }
        
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }


    async function handlePublishList(event, id){
        if(store.currentList.songs.length > 0){
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("publish-list-".length);
        store.publishList(id);
        setExpanded(false);
        store.closeCurrentList();
        }
        
    }
    

    function handleDuplicateList(event) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("duplicate-list-".length);
        store.duplicateCurrentList();

    }

   
    

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    let selectClass = "unpublished-list-card";
    if (idNamePair.published) {
        selectClass = "published-list-card";
    }



    let songCards = "";

    if(store.currentList){
        
                songCards = 
                <div id="unpublished-song-card-list">
                <List 
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
                 </List> 
                 
                 </div>
             
    
     }


    useEffect(() => {
        if(store.currentList && store.currentList._id !== idNamePair._id){
            setExpanded(false);
        }

    })


    let cardElement =
    <div
            id='list-cards-styler'>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            sx={{ marginTop: '15px', display: 'flex',p: 1 }}
            style={{ width: '90%', fontSize: '30pt' }}
            onDoubleClick={handleToggleEdit}
        >
            
                <div>
            <Typography sx={{ p: 1, mt : -2.5, ml : -1,  flexGrow: 1 , fontSize: '18pt'}}>{idNamePair.name}</Typography>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt'}}
            >

                By &nbsp;&nbsp;&nbsp;{idNamePair.owner}
            </Typography>
            
            </div>
            <div className='space-between'></div>
            
        <div>
            <KeyboardDoubleArrowDownIcon
            id={`open-list-${idNamePair._id}`}
            sx={{fontSize: '28pt', my : '2rem'}}
            onClick={(event) => {
                store.closeCurrentList();
                event.stopPropagation();
                setExpanded(true);
                console.log(idNamePair)
                handleLoadList(event, idNamePair._id)
            }}
            ></KeyboardDoubleArrowDownIcon>
        </div>

            
        </ListItem>
        </div>

    if(expanded) {
        cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ display : "flex" , flexDirection : 'column', width :'90%', fontSize: '30pt', height : '13cm'}}
            
        >
            <div
            id='list-cards-styler'>

            <Box sx={{ position : "relative", p: 1, mt : -2.5, ml : -1, fontSize: '20pt'}}>{idNamePair.name}</Box>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt', position : 'relative', pt : 1, mt : 0.5, ml : 0.5, mb : 1}}
            >

                By &nbsp;&nbsp;&nbsp;{idNamePair.owner}
            </Typography>

            {
                songCards
            }
            
        <div id='list-card-buttons'>
            
            <div>
                <EditToolbar
                class='edit-toolbar'
                />
            </div>
            
            <div id='space-between'></div>
            <div>
            <Button
                id='delete-list-button'
                className='list-card-button'
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }}
                sx={{ml : 2}}
                variant="contained">
                DELETE
            </Button>
            <Button
                id='duplicate-list-button'
                className='list-card-button'
                onClick={handleDuplicateList}
                variant="contained"
                sx={{ml : 2}}>
                DUPLICATE
            </Button>
            
            <Button
            id='publish-list-button'
            className='list-card-button'
            variant="contained"
            onClick={(event) => {
                event.stopPropagation();
                handlePublishList(event, idNamePair._id)
            }
        }
            sx={{ml : 2}}>
            PUBLISH
                </Button>
             
            
            </div>
            <div
            className='close-arrow'>
            <KeyboardDoubleArrowUpIcon
            id={`close-list-${idNamePair._id}`}
            onClick={(event) => {
                event.stopPropagation();
                setExpanded(false);
                store.closeCurrentList();
            }}
            sx={{fontSize : '28pt'}}
            ></KeyboardDoubleArrowUpIcon>
            </div>
            </div>

        </div>
        </ListItem>
    }

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='unpublished-list-card edit-active'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 18 }}}
                InputLabelProps={{style: {fontSize: 24}, width : "80%"}}
                autoFocus
            />
    }
    
    return (
        cardElement
    );
}

export default ListCard;
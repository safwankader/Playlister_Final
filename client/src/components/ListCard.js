import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import AuthContext from '../auth';
import { Typography } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { IconButton } from '@mui/material';
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import SongCard from './SongCard.js'
import List from '@mui/material/List';


/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [published, setPublished] = useState(false);
    const [text, setText] = useState("");
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { idNamePair, songs,selected} = props;



    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    

    function handleToggleExpand(){
        setExpanded(!expanded);
        if(expanded) {
            setNewList();
        }
    }

    function setNewList(){
        store.setCurrentList(idNamePair._id);
    }

    

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    // function handleKeyPress(event) {
    //     if (event.code === "Enter") {
    //         let id = event.target.id.substring("list-".length);
    //         store.changeListName(id, text);
    //         toggleEdit();
    //     }
    // }
    // function handleUpdateText(event) {
    //     setText(event.target.value);
    // }


    useEffect(() =>{
        if(store.currentList  && store.currentList.id !== idNamePair._id){
            console.log("STORE " + store.currentList.id)
            console.log(idNamePair._id)
            setExpanded(false);
        }
    })

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let likeIcon = 
    <ThumbUpOffAltIcon style={{fontSize:'30pt'}} />

    let dislikeIcon = 
    <ThumbDownOffAltIcon style={{fontSize:'30pt'}} />

    let songCards = <div></div>

    
    if(store.currentList){
    songCards = 
    <div id="song-card-list">
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
     </div>}
    

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '90%', fontSize: '30pt' }}
            button
        >
            <Box sx={{ position : "absolute", p: 1, mt : -2.5, ml : -1,  flexGrow: 1, overflowX: 'auto' , fontSize: '20pt'}}>{idNamePair.name}</Box>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt', position : 'flex', pt : 3, mt : 0.5, ml : 0.5}}
            >

                By &nbsp;&nbsp;&nbsp;{idNamePair.owner}
            </Typography>
            <Typography
                id='publish-date'
                component='div'
                sx={{fontSize: '10pt', position : 'absolute', pt : 3, mt : 4, ml : 0.5}}
            >

                Published :  {idNamePair.createdAt}
            </Typography>
            <Box sx={{ position : 'absolute' ,p: 1 , pl : 5, ml : 60, mt : -3}}>
                <IconButton >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', position : 'absolute', mt : -5, ml : 10, fontWeight : 'bold'}}>
                    {idNamePair.likes}
                </Typography>
            </Box>
            <Box sx={{ position : 'absolute', p: 1 , pl : 20 , ml : 60, mt : -3}}>
                <IconButton>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt', position : 'absolute', mt : -5, ml : 10, fontWeight : 'bold'}}
                >
                    {idNamePair.dislikes}
                </Typography>
                </Box>
                <Typography
                id='listens-count'
                component='div'
                sx={{fontSize: '10pt', position : 'absolute', pt : 6, mt : 0, ml : 80}}
            >
                Listens :  {idNamePair.listens}
            </Typography>

            <KeyboardDoubleArrowDownIcon
            id={`open-list-${idNamePair._id}`}
            sx={{fontSize: '28pt', position : 'absolute', pt : 5, mt : 0, ml :90}}
            onClick={handleToggleExpand}
            ></KeyboardDoubleArrowDownIcon>
            

            
        </ListItem>

    if(expanded) {
        cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '90%', fontSize: '30pt', height : '13cm'}}
            button
        >
    

            <Box sx={{ position : "absolute", p: 1, mt : -2.5, ml : -1,  flexGrow: 1, overflowX: 'auto' , fontSize: '20pt'}}>{idNamePair.name}</Box>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt', position : 'flex', pt : 3, mt : 0.5, ml : 0.5}}
            >

                By &nbsp;&nbsp;&nbsp;{idNamePair.owner}
            </Typography>
           
            
            <Box sx={{ position : 'absolute' ,p: 1 , pl : 5, ml : 60, mt : -3}}>
                <IconButton >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', position : 'absolute', mt : -5, ml : 10, fontWeight : 'bold'}}>
                    {idNamePair.likes}
                </Typography>
            </Box>
            <Box sx={{ position : 'absolute', p: 1 , pl : 20 , ml : 60, mt : -3}}>
                <IconButton>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt', position : 'absolute', mt : -5, ml : 10, fontWeight : 'bold'}}
                >
                    {idNamePair.dislikes}
                </Typography>
                
            </Box>

            {
                songCards
            }


            <Typography
                id='publish-date'
                component='div'
                sx={{fontSize: '10pt', position : 'absolute', pt : 3, mt : 56, ml : 0.5}}
            >
                Published :  {idNamePair.createdAt}
            </Typography>

            <Typography
                id='listens-count'
                component='div'
                sx={{fontSize: '10pt', position : 'absolute', pt : 6, mt : 52, ml : 80}}
            >
                Listens :  {idNamePair.listens}
            </Typography>

            <KeyboardDoubleArrowUpIcon
            id={`close-list-${idNamePair._id}`}
            sx={{fontSize: '28pt', position : 'absolute', pt : 5, mt : 52, ml :90}}
            onClick={handleToggleExpand}
            ></KeyboardDoubleArrowUpIcon>

            
        </ListItem>
    }
    
    return (
        cardElement
    );
}

export default ListCard;
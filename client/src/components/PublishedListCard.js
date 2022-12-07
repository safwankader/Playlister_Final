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
import Link from '@mui/material/Link';



/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function PublishedListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { idNamePair, songs,selected} = props;






    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load-" + event.target.id);

            // CHANGE THE CURRENT LIST

            store.setCurrentList(id);
            console.log(store.currentList);
        }
    }

    async function handleUserProfile(event) {
        event.stopPropagation();
        let owner = idNamePair.owner;
        store.getPlaylistsByQuery({
            ownerName : owner
        })

        setText("");
    }
    

    function handleDuplicateList(event) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("duplicate-list-".length);
        store.duplicateCurrentList();

    }

    async function toggleLike() {
        
        let newLike = !like;
        if(newLike && dislike){
            setDislike(false)
            
            if(idNamePair.dislikes !== 0){
                idNamePair.dislikes--;
            }
        }
        newLike ?  idNamePair.likes++ : idNamePair.likes--;
        setLike(newLike);
        store.updateLikeDislike(idNamePair._id,idNamePair.likes,idNamePair.dislikes);
        
    }

    async function toggleDislike(){
        
        let newDislike = !dislike;
        if(newDislike && like ){
            setLike(false)
            

            if(idNamePair.likes !== 0){
                idNamePair.likes--;
            }
        }
        newDislike ?  idNamePair.dislikes++ : idNamePair.dislikes--;
        setDislike(newDislike);
        store.updateLikeDislike(idNamePair._id,idNamePair.likes,idNamePair.dislikes);
        
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

    let likeIcon = 
    <ThumbUpOffAltIcon onClick={(event) => {
        event.stopPropagation();
        toggleLike();
    }} style={{fontSize:'30pt'}} />

    let dislikeIcon = 
    <ThumbDownOffAltIcon onClick={(event) => {
        event.stopPropagation();
        toggleDislike();
    }} style={{fontSize:'30pt'}} />
    
    if(like){
        likeIcon = <ThumbUpIcon onClick={(event) => {
            event.stopPropagation();
            toggleLike();
        }} style={{fontSize:'30pt'}} />
    }

    if(dislike){
        dislikeIcon = <ThumbDownAlt onClick={(event) => {
            event.stopPropagation();
            toggleDislike();
        }} style={{fontSize:'30pt'}} />
    }



    let songCards = "";

    if(store.currentList){
        if(store.currentList.published){
            songCards =
                <PublishedSongList/>
             }
             else{
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
    
     }


    useEffect(() => {
        if(store.currentList && store.currentList._id !== idNamePair._id){
            setExpanded(false);
        }

    })




    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            sx={{ marginTop: '15px', display: 'flex',p: 1 }}
            style={{ width: '90%', fontSize: '30pt' }}
            onClick={() => {
                store.updateQueue(idNamePair._id)
            }}
        >
            <div
            id='list-cards-styler'>
            <Typography sx={{ p: 1, mt : -2.5, ml : -1,  flexGrow: 1 , fontSize: '18pt'}}>{idNamePair.name}</Typography>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt'}}
            >

                
                By &nbsp;&nbsp;&nbsp;
                <Link
                    component="button"
                    variant="body2"
                    color="inherit"
                    onClick={handleUserProfile}
                    >
                    {idNamePair.owner}
                </Link>
            </Typography>
            <div> 
            
            <div class='published-elements'>

            
            
            <div className='likes-dislikes'>
                <IconButton
                sx={{ml : "1rem", mt : "-1rem"}} >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', fontWeight : 'bold', ml : "1rem"}}>
                    {idNamePair.likes}
                </Typography>
            
                <IconButton
                sx={{ml : "1rem", mt : "-1rem"}}>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt',fontWeight : 'bold' , ml : "1rem"}}
                >
                    {idNamePair.dislikes}
                </Typography>
                </div>


                <div className='published-song-texts'>
                <Typography
                id='publish-date'
                component='div'
                sx={{fontSize: '10pt'}}
            >

                Published :  {idNamePair.createdAt}


                
            </Typography>
                <Typography
                id='listens-count'
                component='div'
                sx={{fontSize: '10pt'}}
            >
                Listens :  {idNamePair.listens}
            </Typography>

            <KeyboardDoubleArrowDownIcon
            id={`open-list-${idNamePair._id}`}
            sx={{fontSize: '28pt', mt : '-1rem'}}
            onClick={(event) => {
                store.closeCurrentList();
                event.stopPropagation();
                setExpanded(true);
                handleLoadList(event, idNamePair._id);  
            }}
            ></KeyboardDoubleArrowDownIcon>
            </div>
            </div> 
            </div>

            
            

            </div>
        </ListItem>

    if(expanded) {
        cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class={selectClass}
            onClick={() => {
                store.updateQueue(idNamePair._id)
            }}
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
             <div className='published-elements'> 
             <div className='likes-dislikes-expanded'>
             <IconButton
                sx={{ml : "1rem", mt : "-1rem"}} >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', fontWeight : 'bold', ml : "1rem"}}>
                    {idNamePair.likes}
                </Typography>
            
                <IconButton
                sx={{ml : "1rem", mt : "-1rem"}}>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt',fontWeight : 'bold' , ml : "1rem"}}
                >
                    {idNamePair.dislikes}
                </Typography>
            </div>
             <div className='published-song-texts'>
             <Typography
                id='publish-date'
                component='div'
                sx={{fontSize: '10pt'}}
            >

                Published :  {idNamePair.createdAt}
                
            </Typography>
                <Typography
                id='listens-count'
                component='div'
                sx={{fontSize: '10pt'}}
            >
                Listens :  {idNamePair.listens}
            </Typography>
            </div>
            
            </div> 
        

            </div>
            <div id='space-between'></div>
            <div className={idNamePair.published ? 'expanded-list-buttons-published' : ''} >
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

            <div>
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
    return (
        cardElement
    );
}

export default PublishedListCard;
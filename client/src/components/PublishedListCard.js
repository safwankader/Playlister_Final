import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import AuthContext from '../auth';
import { Typography } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { IconButton } from '@mui/material';
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
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
    const { idNamePair, likedUsers, dislikedUsers,  songs,selected} = props;
    const defaultLike = (likedUsers.filter((user) => (user.userName === auth.user.userName))).length !== 0;
    const defaultDislike = (dislikedUsers.filter((user) => (user.userName === auth.user.userName))).length !== 0;
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [like, setLike] = useState(defaultLike);
    const [dislike, setDislike] = useState(defaultDislike);
    const [expanded, setExpanded] = useState(false);


    
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


    function publishDate() {
        if(idNamePair.publishedAt){
            return Date(idNamePair.publishedAt).split(" ").slice(1,4).join(" ")
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
        let newDislike = true;
        if(newLike && dislike){
            setDislike(false)
            newDislike = false
            
        }
        setLike(newLike);

        
        store.updateLikeDislike(idNamePair._id,newLike,newDislike);
        
    }

    async function toggleDislike(){
        
        let newDislike = !dislike;
        let newLike = true;
        if(newDislike && like ){
            setLike(false)
            
            newLike = false
        }
        setDislike(newDislike);
        store.updateLikeDislike(idNamePair._id,newLike,newDislike);

        
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }


    let likeIcon = 
    <ThumbUpOffAltIcon onClick={(event) => {
        event.stopPropagation();
        toggleLike();
    }}  style={{fontSize:'30pt'}} />

    let dislikeIcon = 
    <ThumbDownOffAltIcon onClick={(event) => {
        event.stopPropagation();
        toggleDislike();
    }}  style={{fontSize:'30pt'}} />
    
    if(like){
        likeIcon = <ThumbUpIcon onClick={(event) => {
            event.stopPropagation();
            toggleLike();
        }}  style={{fontSize:'30pt'}} />
    }

    if(dislike){
        dislikeIcon = <ThumbDownAlt onClick={(event) => {
            event.stopPropagation();
            toggleDislike();
        }} style={{fontSize:'30pt'}} />
    }



    let songCards = "";

    if(store.currentList){
            songCards =
                <PublishedSongList listId={idNamePair._id}/>
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
            class={'published-list-card'}
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
                disabled={auth.guest}
                sx={{ml : "1rem", mt : "-1rem"}} >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', fontWeight : 'bold', ml : "1rem"}}>
                    {idNamePair.likes.length}
                </Typography>
            
                <IconButton
                disabled={auth.guest}
                sx={{ml : "1rem", mt : "-1rem"}}>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt',fontWeight : 'bold' , ml : "1rem"}}
                >
                    {idNamePair.dislikes.length}
                </Typography>
                </div>


                <div className='published-song-texts'>
                <Typography
                id='publish-date'
                component='div'
                sx={{fontSize: '10pt'}}
            >

                <b>Published : </b> {publishDate()}


                
            </Typography>
                <Typography
                id='listens-count'
                component='div'
                sx={{fontSize: '10pt'}}
            >
                <b>Listens :</b>  {idNamePair.listens}
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
        <div id='list-cards-styler-expanded'>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            class='published-list-card-expanded'
            onClick={() => {
                store.updateQueue(idNamePair._id)
            }}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ display : "flex" , flexDirection : 'column', width : '100%', fontSize: '30pt', minHeight : '13cm'}}
            
        >
            

            <Box sx={{ position : "relative", p: 1, mt : -2.5, ml : -1, fontSize: '20pt'}}>{idNamePair.name}</Box>

            <div className='top-elements-expanded'>
            <Typography
                id='list-owner'
                component='div'
                sx={{fontSize: '10pt', position : 'relative', pt : 1, mt : 0.5, ml : 0.5, mb : 1}}
            >

                By &nbsp;&nbsp;&nbsp;{idNamePair.owner}
            </Typography>

            <div className='likes-dislikes-expanded'>
             <IconButton
                disabled={auth.guest}
                sx={{ml : "1rem", mt : "-1rem"}} >
                    { likeIcon }
                </IconButton>

                <Typography
                sx={{fontSize : '15pt', fontWeight : 'bold', ml : "1rem"}}>
                    {idNamePair.likes.length}
                </Typography>
            
                <IconButton
                disabled={auth.guest}
                sx={{ml : "1rem", mt : "-1rem"}}>
                    { dislikeIcon }
                </IconButton>
                <Typography
                sx={{fontSize : '15pt',fontWeight : 'bold' , ml : "1rem"}}
                >
                    {idNamePair.dislikes.length}
                </Typography>
            </div>
            </div>

            {
                songCards
            }
            
  
        
         
             <div className='bottom-elements-expanded'> 
             
             <div className='published-song-texts-expanded'>
                
             <span>

                <b>Published :</b>  {publishDate()}
                </span>
                &nbsp;&nbsp;&nbsp;
            
                <span>
                    <b>
                Listens :</b>  {idNamePair.listens}
                </span>
        
            </div>
            
           
        


            <div className='expanded-list-buttons-published' >
                {auth.user.userName === idNamePair.owner ? 
                <Button
                id='delete-list-button'
                className='list-card-button published-button'
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }}
                sx={{ml : 2}}
                variant="contained">
                DELETE
            </Button>: <div></div>}
            {auth.guest ? <div></div> : <Button
                id='duplicate-list-button'
                className='list-card-button published-button'
                onClick={handleDuplicateList}
                variant="contained"
                sx={{ml : 2}}>
                DUPLICATE
            </Button> }
            
            <div
            className='close-arrow published-button'>
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
        </div>
    }
    return (
        cardElement
    );
}

export default PublishedListCard;
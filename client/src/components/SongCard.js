import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index, listId } = props;

    function handleChangeSong(event, index) {
        event.preventDefault();
        event.stopPropagation();
        store.changeQueueSong(listId,index);
    }
    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleEditSong(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
            event.stopPropagation();
            event.preventDefault();
            store.showEditSongModal(index, song);
            
       
    }
    let nowPlaying = store.playerList && store.playerList._id === listId && store.songNumberPlaying === index;
    let cardClass = 'song-card'
    
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            {nowPlaying ? <b><Link
                id={'song-' + index + '-link'}
                className="song-link"
                onClick={(event) => {
                    handleChangeSong(event,index);
                }}
                >
                {song.title} by {song.artist}
            </Link> </b>:
            <Link
            id={'song-' + index + '-link'}
            className="song-link"
            onClick={(event) => {
                handleChangeSong(event,index);
            }}
            >
            {song.title} by {song.artist}
        </Link>}
            
            <div id="space-between"></div>
            <div id="space-between"></div>
            <Button
            onClick={handleEditSong}>
                <EditIcon></EditIcon>
            </Button>
            <input
                type="button"
                id={"remove-song-" + index}
                className="song-card-button"
                value={"\u2715"}
                onClick={(event) =>{
                    event.stopPropagation();
                    handleRemoveSong(event)
                }}
            />
        </div>
    );
}

export default SongCard;
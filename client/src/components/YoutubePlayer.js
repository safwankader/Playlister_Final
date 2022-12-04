import YouTube, { YouTubeProps } from 'react-youtube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import { GlobalStoreContext } from '../store'
import React, { useContext, useEffect } from 'react'


function YoutubePlayer() {
  const { store } = useContext(GlobalStoreContext);
  let name = "";
  let songNum = "";
  let title = "";
  let artist = "";

  if(store.currentList){
    name = store.currentList.name;
  }
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  function playVideo() {

  }

  function previousSong() {

  }

  function pauseVideo() {

  }

  function nextSong() {
    
  }

  const opts = {
    height: '340',
    width: '620',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
  <div id='youtube-video-card'>
    
    <YouTube id='youtube-video' videoId="2g811Eo7K8U" opts={opts} onReady={onPlayerReady} />
    <span>Playlist: {name}</span>
    <span>Song #: {}</span>
    <span>Title: {}</span>
    <span>Artist: {}</span>
    <div id='player-controls'>
        <IconButton onClick={previousSong}> <SkipPreviousIcon/> </IconButton>
        <IconButton onClick={playVideo}> <PlayArrowIcon/> </IconButton>
        <IconButton onClick={pauseVideo}> <StopIcon/> </IconButton>
        <IconButton onClick={nextSong}> <SkipNextIcon/> </IconButton>
    </div>
  </div>
  )
}

export default YoutubePlayer;
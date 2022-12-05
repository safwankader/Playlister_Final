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
  let player = "";

  if(store.currentList){
    name = store.currentList.name;
  }

  if(store.youtubeQueue){
    songNum = store.youtubeQueue.songNumberPlaying;
    title = store.youtubeQueue.songNamePairs.title;
    artist = store.youtubeQueue.songNamePairs.artist;
  }
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.playVideo();
    player = event.target;

  }

  function playVideo() {
    player.playVideo();
  }

  function previousSong() {
    store.playNextOrPrevSong(false)
  }

  function pauseVideo() {
    player.pauseVideo();
  }

  function nextSong() {
    store.playNextOrPrevSong(true)
  }

  const opts = {
    height: '320',
    width: '685',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
  <div id='youtube-video-card'>
    {store.currentList ?<YouTube id='youtube-video' videoId={store.songInPlayer} opts={opts} onReady={onPlayerReady} /> : <div id='blank-youtube-page'></div>}
    
    <span>Playlist: {name}</span>
    <span>Song #: {songNum}</span>
    <span>Title: {title}</span>
    <span>Artist: {artist}</span>
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
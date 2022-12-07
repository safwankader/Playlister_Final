import YouTube, { YouTubeProps } from 'react-youtube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import { GlobalStoreContext } from '../store'
import React, { useContext, useEffect, useState } from 'react'


function YoutubePlayer(props) {
  const { store } = useContext(GlobalStoreContext);
 

  const { youTubeId } = props;
  let player = "";
  

  const onPlayerStateChange = (event) => {
    if(event.data === 0){
      nextSong();
      player.playVideo();
    }
  }

  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.playVideo();
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
    {/* {store.currentList ?<YouTube id='youtube-video' videoId={youTubeId} opts={opts} onReady={onPlayerReady} /> : <div id='blank-youtube-page'></div>} */}
    {store.songInPlayer ? <YouTube id='youtube-video' videoId={youTubeId} opts={opts} onReady={onPlayerReady} onStateChange={onPlayerStateChange} /> : <div id='blank-youtube-page'></div>} 

    <span>Playlist: {store.playerListName}</span>
    <span>Song #: {store.songInPlayer ? store.songNumberPlaying + 1 : ""}</span>
    <span>Title: {store.songNamePairs[store.songNumberPlaying].title}</span>
    <span>Artist: {store.songNamePairs[store.songNumberPlaying].artist}</span>
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
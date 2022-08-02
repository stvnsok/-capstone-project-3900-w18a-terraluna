import React from 'react';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import Button from './Button'
import Paper from '@mui/material/Paper';

export default function SearchBar (){
    return (
        <Container className = 'd-flex flex-column py-2'
        style = {{height: "100vh"}}>
        <Form.Control 
          type = 'search' 
          placeholder = 'Search for a song' 
          value = {search}
          onChange = {e => setSearch(e.target.value)} />
          <div className = 'flex-grow-1 my-2' style = {{ overflowY: 'auto'}}>
            {searchResults.map(track => (
              <TrackSearchResult 
                track = {track} 
                key = {track.uri} 
                chooseTrack = {chooseTrack}
              />
            ))}
          {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )}
        </div>
        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </Container>
    )
}
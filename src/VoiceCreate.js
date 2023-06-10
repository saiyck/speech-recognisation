import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom/client";
import MicRecorder from 'mic-recorder-to-mp3';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

import { handleUpload } from "./Common";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });


const VoiceCreate = () => {
    const [state, setState] = useState(
        {
            isRecording: false,
            blobURL: '',
            isBlocked: false,
            value : ''
        }
    );

   useEffect(()=>{
    navigator.getUserMedia({ audio: true },
        () => {
          console.log('Permission Granted');
          setState({ ...state ,isBlocked: false });
        },
        () => {
          console.log('Permission Denied');
          this.setState({ ...state,isBlocked: true })
        },
      );
   },[]);


  const start = () => {
    if (state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
         setState({ ...state ,isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

 const stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        console.log(blob)
        const blobURL = URL.createObjectURL(blob)
        const wavefile = new File([blob],'inhand.wav');
        console.log(wavefile);
        handleUpload(wavefile).then((res)=>{
            console.log('response',res);
           setState({...state,value:res.data.text});
        }).catch((err)=> {
          console.log('errroorr',err);
        })
        setState({ ...state ,blobURL, isRecording: false });
        console.log('blobURL',blobURL);
      }).catch((e) => console.log(e));
  };


    return (
        <Paper
        component="form"
        sx={{ p: '4px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          value={state.value}
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={(v) => setState({...state, value : v.target.value})}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={start}>
          <MicIcon sx={{color: state.isRecording ? 'gray' : 'blue' }}/>
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={stop}>
          <StopIcon sx={{color: state.isRecording ? 'red' : 'gray'}}/>
        </IconButton>
      </Paper>
    )
}

export default VoiceCreate;





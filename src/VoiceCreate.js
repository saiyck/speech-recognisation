import React, { useRef,useState,useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import MicRecorder from 'mic-recorder-to-mp3';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import {createFileName} from 'use-react-screenshot';

import { handleUpload } from "./Common";
import { Box, Typography } from "@mui/material";

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

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [streame,setStreame]=useState(null);
    const [screenshot, setScreenshot] = useState([]);
    const [interival,setInterival] = useState(0);
    var temp = [];
  

   useEffect(()=>{
     checkPermissions()
   },[]);


   useEffect(()=> {
    console.log('call useeffect')
   },[])


   const checkPermissions = () => {
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
    //handleStartCamera()
   }


   const handleStartCamera = async () => {
    try {
      const constraints = { video: { facingMode: 'user' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start()
      setStreame(stream)
      captureScreeShotEvery5Seconds()
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };


  const captureScreeShotEvery5Seconds = () => {
   let intervel = setInterval(()=>{
    handleCaptureScreenshot();
    setInterival(intervel)
    },5000)
  }


  const stopSubmit = async () => {
    streame.getVideoTracks()[0].stop();
    console.log('media',interival);
    clearInterval(interival);
  }


  const handleCaptureScreenshot = () => {
    let extension="jpg"
    let name="screenshot"
    const videoElement = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    const screenshotDataUrl = canvas.toDataURL('image/png');
    // const a = document.createElement("a");
    // a.href = screenshotDataUrl;
    // a.download = createFileName(extension, name);
    // a.click();
    temp.push(screenshotDataUrl);
    setScreenshot([...temp]);
    //setScreenshot(screenshotDataUrl);
  };


  const start = () => {
    handleStartCamera()
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
        const blobURL = URL.createObjectURL(blob)
        const wavefile = new File([blob],'inhand.wav');
        handleUpload(wavefile).then((res)=>{
           setState({...state,value:res.data.text,isRecording: false, blobURL});
        }).catch((err)=> {
          console.log('errroorr',err);
        })
        setState({ ...state ,blobURL, isRecording: false });
      }).catch((e) => console.log(e));
      stopSubmit()
  };


    return (
      <>
    <Box>
        <Paper
        component="form"
        sx={{ p: '4px 4px', display: 'flex', alignItems: 'center',width:'70vh'}}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          multiline
          maxRows={4}
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
      {state.blobURL ?  <audio style={{marginTop:20}} src={state.blobURL} controls></audio> : null}
      <video style={{display:'none'}} ref={videoRef} autoPlay />
      {screenshot.length > 0 && !state.isRecording ? 
      <div style={{display:'flex',marginTop:20}}>
      {
        screenshot.map((item)=> {
          return(
            <img src={item} style={{width:100,height:100,marginLeft:20}} alt="Screenshot" />
          )
        })
      }
    </div> : null
    }
      </Box>
       </>
    )
}

export default React.memo(VoiceCreate);





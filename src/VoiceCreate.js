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

import { handleUpload, handleUploadAnswers } from "./Common";
import { Alert, Box, Typography } from "@mui/material";
import QuestionCard from "./components/QuestionCard";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });


const VoiceCreate = () => {
    const [state, setState] = useState(
        {
            isRecording: false,
            blobURL: '',
            isBlocked: false,
            value : '',
            promptInfo:''
        }
    );
    const [data,setData] = useState([]);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [streame,setStreame]=useState(null);
    const [screenshot, setScreenshot] = useState([]);
    const [interival,setInterival] = useState(0);
    const [question,setQuestion] = useState("Hello Whats your name?");
    var temp = [];
    var messages = [];
//     const promptInfo = `
// you are an interviewer. 
// the candidate is a ${state.skills}. based on the candidates proficiency, ask interview questions. based on the candidate's response, either choose to ask a follow up question or move on to a new question. end the interview when you feel like you have covered enough.

// 1) ask only a single question in each response. 
// 2) if user has responded to you before, choose whether to ask a followup question or ask a new one.
// `
  

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
    temp.push(screenshotDataUrl);
    setScreenshot([...temp]);
  };


  const start = () => {
    if(state.promptInfo == ''){
      window.alert("please add promptInfo")
      return
    }
    // handleStartCamera()
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

  React.useEffect(()=>{
    if(state.value != ''){
      handleUploadAnswers(data,state.promptInfo).then((res)=>{
        console.log('res',res);
        let ms  = {role: "assistant", content: res?.data.choices[0]?.message?.content}
        let temp = [...data];
       temp.push(ms);
       setData(temp);
       setQuestion(res?.data.choices[0]?.message?.content);
    }).catch((err)=> {
      console.log('errroorr',err);
    })
    }
  },[state.value])

 const stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        const wavefile = new File([blob],'inhand.wav');
        handleUpload(wavefile).then((res)=>{
          let m  = {role: "user", content: res.data.text}
          let temp = [...data];
          temp.push(m);
          setData(temp);
           setState({...state,value:res.data.text,isRecording: false, blobURL});   
      }).catch((e) => console.log(e));
      // stopSubmit()
    })    
  };


    return (
       <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingTop:10}}>
        <Paper
        sx={{ p: '10px 10px',marginBottom:5,maxWidth:'60vh'}}
      >
        <InputBase
          sx={{ ml: 1,width:'60vh'}}
          placeholder="Add prompt Message here"
          multiline
          maxRows={4}
          value={state.skills}
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={(v) => setState({...state, promptInfo : v.target.value})}
        />
      </Paper>
      {/* {state.blobURL ?  <audio style={{marginTop:20}} src={state.blobURL} controls></audio> : null} */}
      {/* <video style={{display:'none'}} ref={videoRef} autoPlay /> */}
      {/* {screenshot.length > 0 && !state.isRecording ? 
      <div style={{display:'flex',marginTop:20}}> */}
      {/* {
        screenshot.map((item)=> {
          return(
            <img src={item} style={{width:100,height:100,marginLeft:20}} alt="Screenshot" />
          )
        })
      } */}
    {/* </div> : null
    } */}
     <QuestionCard onChangeValue={(v)=> setState({...state, value : v.target.value})} text={state.value} onSubmit={()=> stop()} onMicPress={()=> start()} title={question} isRecording={state.isRecording}/>
      
      <Box sx={{textAlign:'center',marginTop:'20px'}}>
        <Typography color={'gray'}>
          Timer: 00:00
        </Typography>
      </Box>
      </Box>
    )
}

export default React.memo(VoiceCreate);





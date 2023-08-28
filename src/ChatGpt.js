import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { makeStyles } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import MicRecorder from 'mic-recorder-to-mp3';
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import { useParams } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import MicIcon from '@mui/icons-material/Mic';
import StopCircle from '@mui/icons-material/StopCircle';
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InputBase from '@mui/material/InputBase';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './VoiceCreate.css';
import Paper from '@mui/material/Paper';
import { handleUpload, handleUploadAnswers, retrivePromptMessage, checkTheStatus } from "./Common";

const useStyles = makeStyles({
  paper: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const ChatDialog = (props) => {
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hashedApiKey, setHashedApiKey] = useState("");
  const [text, setText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const styles = useStyles();
  const [promptInfo, setPromptInfo] = useState("conduct a technical interview for a candidate who is experienced in javascript. he claims to be at an expert level. - ask one question at a time. When the user responds, with your responses, ask a probing question to dig deeper and understand better. if user input requires coding examples, prompt the user to use the code editor");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState("");
  const [scrollBottom, setBottom] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [example, setExample] = useState('');
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const params = useParams();
  const id = params.id;


  // useEffect(()=>{
  //  retrivePromptMessage(id).then((res)=>{
  //   setPromptInfo(res.promptMessage)
  //   setMessages([])
  //  }).catch((err)=>{
  //   console.log('error',err)
  //  })
  // },[])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollBottom]);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    checkPermissions()
  }, []);

  const checkPermissions = () => {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setIsBlocked(false)
      },
      () => {
        console.log('Permission Denied');
        setIsBlocked(true)
      },
    );
    //handleStartCamera()
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handlePromptChange = (e) => {
    setPromptInfo(e.target.value)
  }

  const handleSubmitEditing = () => {
    if (promptInfo.length > 30) {
      setIsEditingSettings(false)
      setErrorPrompt("")
    } else {
      setErrorPrompt("Please enter proper prompt info")
    }
  }

  const handleOpenEditing = () => {
    setIsEditingSettings(true)
  }

  const handleDeletePrompt = () => {
    setPromptInfo("");
    setIsEditingSettings(false)
  }

  const handleSend = () => {
    setLoading(true);
    setShowCode(false)
    let m = { role: "user", content: text }
    let temp = [...messages];
    temp.push(m);
    setMessages(temp);
    setIsAssistantLoading(true)
    handleUploadAnswers(temp, promptInfo, id).then((res) => {
      checkTheStatus(res.message).then((res) => {
        let cdata = res.data.choices[0];
        if (cdata.finish_reason == "function_call") {
          setShowCode(true)
        } else {
          setShowCode(false)
        }
      }).catch((err) => {
        console.log('errr', err);
        setShowCode(false)
      })
      let ms = { role: "assistant", content: res.message }
      temp.push(ms)
      setMessages(temp);
      setIsAssistantLoading(false)
      setBottom(!scrollBottom);
      setText("")
      setIsRecording(false)
      setLoading(false)
    }).catch((err) => {
      console.log('Error:', err)
    })
  }


  const start = () => {
    if (promptInfo == '') {
      window.alert("please add promptInfo")
      return
    }
    // handleStartCamera()
    if (isBlocked) {
      window.alert("permission denied")
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          setIsRecording(true)
        }).catch((e) => console.error(e));
    }
  };


  const stop = () => {
    setLoading(true)
    setShowCode(false)
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const wavefile = new File([blob], 'inhand.wav');
        setLoading(true)
        handleUpload(wavefile).then((res) => {
          let m = { role: "user", content: res.data.message }
          let temp = [...messages];
          temp.push(m);
          setMessages(temp);
          setIsAssistantLoading(true)
          handleUploadAnswers(temp, promptInfo, id).then((res) => {
            checkTheStatus(res.message).then((res) => {
              let cdata = res.data.choices[0];
              if (cdata.finish_reason == "function_call") {
                setShowCode(true)
              } else {
                setShowCode(false)
              }
            }).catch((err) => {
              console.log('errr', err);
              setShowCode(false)
            })
            let ms = { role: "assistant", content: res.message }
            temp.push(ms)
            setMessages(temp);
            setIsAssistantLoading(false)
            setBottom(!scrollBottom);
            setIsRecording(false)
            setLoading(false)
          })
        }).catch((e) => console.log(e));
      })
  };


  const renderChatInputPrompter = () => {
    return (
      <div style={{ padding: "1rem" }}>

        {showCode ?
          <Paper
            sx={{ p: '10px 10px', maxWidth: '60vh', backgroundColor: '#000' }}
          >
            <Editor
              // className="editor"
              value={text}
              placeholder="Please write your example here"
              onValueChange={code => setText(code)}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              textareaClassName="editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                width: '60vh',
                minHeight: '30vh',
                overflow: 'auto',
                color: '#fff'
              }}
            />
            <Button disabled={text.length > 0 ? false : true} style={{ fontSize: '8px', paddingRight: 0, paddingLeft: 0, backgroundColor: '#fff', color: '#000' }} onClick={handleSend} size='small' variant="contained">Submit</Button>
          </Paper> :
          <div style={{ position: "relative", width: "100%", display: 'flex', alignItems: 'center' }}>
            <ChatInput
              rowsMin={1}
              rowsMax={4}
              autoFocus
              ref={inputRef}
              placeholder="e.g. Tap to speak or write message"
              value={text}
              disabled={loading || isRecording}
              onChange={handleTextChange}
            />

            <ActionContainer style={{}}>
              {
                loading ?
                  <LoadingDots />
                  :
                  text.length > 0 ?
                    <StyledIconButton
                      type="submit"
                      color="primary"
                      onClick={handleSend}
                    >
                      <SendOutlinedIcon
                        style={{
                          color: "rgb(35, 127, 244)",
                        }}
                        fontSize="medium"
                      />
                    </StyledIconButton> :
                    isRecording ?
                      <StyledIconButton
                        type="submit"
                        color="primary"
                        onClick={stop}
                        className='pulsate'
                      >
                        <StopCircle
                          style={{ color: "rgb(255, 0, 0)" }}
                          fontSize="medium"
                        />
                      </StyledIconButton> :
                      <StyledIconButton
                        type="submit"
                        color="primary"
                        onClick={start}
                      >
                        <MicIcon
                          style={{ color: "rgb(35, 127, 244)" }}
                          fontSize="medium"
                        />
                      </StyledIconButton>
              }
            </ActionContainer>
          </div>
        }
      </div>
    );
  };




  const _chatResponseHelper = (messageContent, { ref, loading } = {}) => {
    return (
      <ChatMessageContainer>
        <DropBoxContainer ref={ref}>
          {messageContent}
          {loading && <BlinkingContainer />}
        </DropBoxContainer>
      </ChatMessageContainer>
    );
  };




  const toggleContent = () => {
    setShowContent(!showContent);
  };



  const renderAssistantChatMessage = (messageContent, { loading }) => {
    return (
      <ChatMessageContainer>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex" }}>
              <Button
                startIcon={loading ? <CircularProgress size={12} /> : null}
                onClick={toggleContent}
              >
                {showContent ? (
                  <span>
                    Hide Content <ExpandLessIcon />
                  </span>
                ) : (
                  <span>
                    Show Content <ExpandMoreIcon />
                  </span>
                )}
              </Button>
            </div>
          </div>
          <br />
          <Collapse in={showContent}>
            <DropBoxContainer
              style={{
                height: "10rem", // Set the desired height
                overflow: "auto", // Enable scrolling when content exceeds the height
                padding: "10px",
              }}
            >
              {messageContent}
              {loading && <BlinkingContainer />}
            </DropBoxContainer>
          </Collapse>
        </div>
      </ChatMessageContainer>
    );
  };



  const renderChatMessageContainer = (message, { isAssistant, role, index }) => {
    if (isAssistant) {
      return _chatResponseHelper(message.content);
    }
    return <ChatMessageContainer>{message.content}</ChatMessageContainer>;
  };

  const renderChatBox = (children, { role, isAssistant }) => {
    return (
      <ChatBox>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: isAssistant ? "#237ff4" : "grey",
              height: 28,
              width: 28,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {isAssistant ? assistantLogo : null} */}
          </div>

          <div
            style={{
              color: isAssistant ? "#237ff4" : "grey",
              fontSize: 11,
              textTransform: "uppercase",
            }}
          >
            {isAssistant ? "Assistant" : "USER"}
          </div>
        </div>
        {children}
      </ChatBox>
    );
  };

  const renderChatMessage = (message, { role, isAssistant, index }) => {
    return (
      <ChatContainer role={role} key={index}>
        {renderChatBox(
          renderChatMessageContainer(message, { isAssistant, role, index }),
          { role, isAssistant }
        )}
      </ChatContainer>
    );
  };

  const renderChatStreamResponse = () => {
    return (
      <ChatContainer role="ASSISTANT">
        {renderChatBox(_chatResponseHelper("", { loading }), {
          isAssistant: true,
          role: "ASSISTANT",
        })}
      </ChatContainer>
    );
  };

  const renderChatMessages = () => {
    //ChatsContainer -> ChatContainer -> ChatBox -> ChatMessageContainer
    return (
      <ChatsContainer>
        {messages.map((message, index) => {
          const role = message.role.toUpperCase();
          const isAssistant = role === "ASSISTANT" || role === "FUNCTION";
          return renderChatMessage(message, { role, isAssistant, index });
        })}
        {isAssistantLoading && renderChatStreamResponse()}
        <div ref={messagesEndRef} />
      </ChatsContainer>
    );
  };

  const renderChatTitle = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          alignItems: 'center'
        }}
      >
        <div style={{ position: "relative" }}>
          <IconButton color="inherit" onClick={() => { }} aria-label="close">
            <ArrowBackOutlinedIcon />
          </IconButton>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".25rem",
            }}
          >
            <h2 style={{ fontSize: 16, margin: 0 }}>AI assistant</h2>
            {isEditingSettings ? null : (
              <div>
                <IconButton
                  style={{ padding: "0.5rem" }}
                  onClick={handleOpenEditing}
                >
                  <CreateOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>
          {isEditingSettings ? (
            <div>
              <form
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".25rem",
                }}
                onSubmit={handleSubmitEditing}
              >
                <div>
                  <InputBase
                    sx={{
                      mt: 1,
                      width: windowSize.innerWidth > 780 ? '30vw' : '70vw',
                      border: "1px solid gray",
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                    placeholder="Add prompt Message here"
                    multiline
                    maxRows={4}
                    value={promptInfo}
                    inputProps={{ 'aria-label': 'add prompt info' }}
                    onChange={handlePromptChange}
                  />
                  <p style={{ color: 'red', fontSize: 12 }}>{errorPrompt}</p>
                </div>
                <IconButton
                  style={{ padding: "0.5rem" }}
                  onClick={handleSubmitEditing}
                >
                  <CloseOutlinedIcon fontSize="small" />
                </IconButton>
              </form>
            </div>
          ) : promptInfo ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".25rem",
              }}
            >
              <div>{promptInfo.substring(0, 50) + "********"}</div>
              <div>
                <IconButton
                  style={{ padding: "0.5rem" }}
                  onClick={handleDeletePrompt}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderDrawerContainer = () => {
    if (messages.length < 0) {
      return (
        <div style={{ padding: "1rem" }}>
          <h3>Hi, welcome to Recruitment Chat!</h3>
          <p>
            I am an AI Assistant, I am here to take interview to you
          </p>
        </div>
      );
    }

    return renderChatMessages();
  };

  useEffect(() => {
    if (true) {
      //   resetResponse();
      inputRef.current?.focus();
    }
  }, []);

  return (
    <Drawer
      anchor={"right"}
      PaperProps={{
        style: {
          width: windowSize.innerWidth > 780 ? '40%' : '100%',
        },
      }}
      open={true}
      onClose={() => { }}
    >
      {renderChatTitle()}
      <DrawerContainer ref={chatContainerRef}>
        {renderDrawerContainer()}
      </DrawerContainer>
      {renderChatInputPrompter()}
    </Drawer>
  );
};

export default ChatDialog;

const dotsAnimation = keyframes`
  0%,
  20% {
    color: #0000;
    text-shadow: 0.25em 0 0 #0000, 0.5em 0 0 #0000;
  }

  40% {
    color: black;
    text-shadow: 0.25em 0 0 #0000, 0.5em 0 0 #0000;
  }

  60% {
    text-shadow: 0.25em 0 0 black, 0.5em 0 0 #0000;
  }

  80%,
  100% {
    text-shadow: 0.25em 0 0 black, 0.5em 0 0 black;
  }

  80%,
  100% {
    text-shadow: 0.25em 0 0 black, 0.5em 0 0 black;
  }
`;

const blinking = keyframes`
  0% {
    opacity: 0;
  }
`;
const BlinkingContainer = styled.div`
  & {
    &::after {
      font-size: 16px;
      animation: ${blinking} 1s steps(2) infinite;
      content: "▋";
      vertical-align: baseline;
    }
  }
`;

const LoadingDots = styled.div`
  && {
    width: 2rem;
    height: 2rem;

    &::after {
      content: " •";
      animation: ${dotsAnimation} 1s steps(5, end) infinite;
    }
  }
`;

const DrawerContainer = styled.div`
  && {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
      height:0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: gray;
      border-radius: 4px;
    }
  }
`;

const DropBoxContainer = styled.div`
  && {
    &::-webkit-scrollbar {
      width: 4px;
      height:0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: gray;
      border-radius: 4px;
    }
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
  }
`;

const ActionContainer = styled.div`
  && {
    position: absolute;
    right: 0;
    bottom 0.5rem;
    padding: 0.25rem;
  }
`;

const ChatInput = styled(TextareaAutosize)`
  && {
    width: 100%;
    padding: 1rem 4rem 1rem 1.5rem;
    font-size: 16px !important;
    border-radius: 12px;
    border: 1px solid lightgray;
    outline: none;
    resize: none;

    &::-webkit-scrollbar {
      width: 4px;
      height:0px;
      cursor: pointer;
    }

    &::-webkit-scrollbar-thumb {
      background-color: lightgray;
      border-radius: 4px;
      cursor: pointer;
    }

    &:disabled {
      color: gray;
    }
  }
`;

const ChatsContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
  }
`;

// const ChatContainer = styled.div`
//   & {
//     padding-left: ${(prop) => (prop.role === "user" ? "50%" : 0)};
//     padding-right: ${(prop) => (prop.role === "assistant" ? "50%" : 0)};
//   }
// `;

const ChatContainer = styled.div`
  & {
    display: flex;
    background-color: ${(props) =>
    props.role === "ASSISTANT" ? "#f7f7f8" : "none"};
    width: 100%;
    border-bottom: 1px solid #dbdbdb;
    padding: 0.5rem;
  }
`;

const ChatBox = styled.div`
  & {
    padding: 1rem;
    width: 100%;
  }
`;

const ChatMessageContainer = styled.div`
  & {
    width: 100%;
    white-space: pre-wrap;
    font-size: 1rem;
  }
`;

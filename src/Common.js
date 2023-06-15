import axios from "axios";

export const handleUpload = (newfiles) => {
    let formData = new FormData();
    formData.append("file", newfiles);
    formData.append("model", "whisper-1");
    return new Promise((resolve,reject)=> {
        axios({
            url:'https://api.openai.com/v1/audio/transcriptions',
            method:'POST',
            headers:{
                Authorization: `Bearer ${process.env.REACT_APP_WHISPER_API_KEY}`
            },
            data: formData
        }).then((res)=> {
           resolve(res)
        }).catch((err)=> {
           resolve(err)
        })
    })
   }


export const handleUploadAnswers = (messages,promptInfo) => {
    console.log("messages",messages);
    return new Promise((resolve,reject)=> {
        axios({
            url:'https://api.openai.com/v1/chat/completions',
            method:'POST',
            headers:{
                Authorization: `Bearer ${process.env.REACT_APP_WHISPER_API_KEY}`
            },
            data: {
                model: "gpt-3.5-turbo-16k",
                messages:[
                    {role: "system", content: promptInfo},
                    // {role: "user", content: answer}
                     ...messages
                ]
            }
        }).then((res)=> {
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
}   
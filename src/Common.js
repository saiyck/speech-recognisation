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
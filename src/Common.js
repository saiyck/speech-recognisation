import axios from "axios";


export const handleUpload = (newfiles) => {
    let formData = new FormData();
    formData.append("file", newfiles);
    formData.append("model", "whisper-1");
    console.log(process.env.WHISPER_API_KEY,'keyyyyyy');
    return new Promise((resolve,reject)=> {
        axios({
            url:'https://api.openai.com/v1/audio/transcriptions',
            method:'POST',
            headers:{
                Authorization: `Bearer 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`
            },
            data: formData
        }).then((res)=> {
           resolve(res)
        }).catch((err)=> {
           resolve(err)
        })
    })
   }
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
                Authorization: 'Bearer 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'
            },
            data: formData
        }).then((res)=> {
           resolve(res)
        }).catch((err)=> {
           resolve(err)
        })
    })
   }
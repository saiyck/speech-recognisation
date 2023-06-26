import axios from "axios";
const {REACT_APP_API_URL} = process.env;
console.log(REACT_APP_API_URL);
export const handleUpload = (newfiles) => {
    let formData = new FormData();
    formData.append("file", newfiles);
    return new Promise((resolve,reject)=> {
        axios({
            url:`${REACT_APP_API_URL}/createtransaction`,
            method:'POST',
            data: formData
        }).then((res)=> {
           resolve(res)
        }).catch((err)=> {
           reject(err)
        })
    })
   }

 
export const retrivePromptMessage = (id) => {
   return new Promise((resolve,reject)=> {
     axios({
        url:`${REACT_APP_API_URL}/getPromptMessage/${id}`,
        method:'GET'
     }).then((res)=>{
        console.log('reee',res)
        resolve(res.data)
     }).catch((err)=>{
        console.log('err',err)
        reject(err)
     })
   })
}   


export const handleUploadAnswers = (messages,promptInfo) => {
    console.log("messages",messages);
    return new Promise((resolve,reject)=> {
        axios({
            url:`${REACT_APP_API_URL}/createChatCompletion`,
            method:'POST',
            data: {
                systemPrompt: promptInfo,
                messages:[
                     ...messages
                ]
            }
        }).then((res)=> {
            resolve(res.data)
        }).catch((err)=>{
            reject(err)
        })
    })
}   
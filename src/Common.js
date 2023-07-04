import axios from "axios";
const {REACT_APP_API_URL,REACT_APP_WHISPER_API_KEY} = process.env;
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

export const checkTheStatus = (prompt) => {
    return new Promise((resolve,reject)=> {
       axios({
           url:`https://api.openai.com/v1/chat/completions`,
           method:'POST',
           headers:{
               Authorization: `Bearer ${REACT_APP_WHISPER_API_KEY}`
           },
          data:{
           model: "gpt-3.5-turbo-0613",
           messages: [
           {role: "user", content: prompt}
           ],
           functions: [
               {
                 name: "show_code_editor",
                 description: "User need to use code editor to provide there example",
                 parameters: {
                   type: "object",
                   properties: {
                     show: {
                       type: "boolean",
                       description: "get the status"
                     }
                   }
                 }
               }
             ]
          }
       }).then((res)=>{
          resolve(res)
       }).catch((err)=>{
          reject(err)
       })
    })
   }


export const handleUploadAnswers = (messages,promptInfo,id) => {
    return new Promise((resolve,reject)=> {
        axios({
            url:`${REACT_APP_API_URL}/createChatCompletion/${id}`,
            method:'POST',
            headers:{
                "Acess-Control-Allow-Origin": true  
            },
            data: {
                systemPrompt: promptInfo,
                messages:[
                     ...messages
                ]
            }
        }).then((res)=> {
            console.log('ress',res)
            resolve(res.data)
        }).catch((err)=>{
            console.log('errr',err)
            reject(err)
        })
    })
}

export const updateEmailId = (userId,email) => {
    console.log("Id",userId);
    return new Promise((resolve,reject)=> {
        axios({
            url:`${REACT_APP_API_URL}/updateEmail/${userId}`,
            method:'PUT',
            data: {
               email
            }
        }).then((res)=> {
            resolve(res.data)
        }).catch((err)=>{
            reject(err)
        })
    })
}


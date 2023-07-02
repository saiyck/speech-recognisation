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


export const handleUploadAnswers = (messages,promptInfo,id) => {
    console.log("messages",{
        systemPrompt: promptInfo,
        messages:[
             ...messages
        ]
    });
    return new Promise((resolve,reject)=> {
        axios({
            url:`${REACT_APP_API_URL}/createChatCompletion/${id}`,
            method:'POST',
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


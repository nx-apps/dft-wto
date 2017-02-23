import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    fileIdUpload:{},
    // listFiles:[]
}

export function uploadReducer(state = initialState,action){

    switch (action.type) {
        case 'UPLOAD_LIST':
          return Object.assign({},state,{list:action.payload});
        case 'UPLOAD_FILECHANGE':
          return Object.assign({},state,{fileIdUpload:action.payload});
        // case 'UPLOAD_LISTFILE':
        //   return Object.assign({},state,{listFiles:action.payload});
        default:
          return state
    }

}

export function uploadAction(store){
    return [commonAction(),{
      UPLOAD_LIST(){
        axios.get('/document_type')
        .then((response)=> {
          store.dispatch({type:'UPLOAD_LIST',payload:response.data})
          // console.log("success");
        })
        .catch((error)=> {
          // console.log("error");
          console.log(error);
        })
      },
      UPLOAD_FILECHANGE(val){
        axios.get('/document_file/id/'+val)
        .then((response)=> {
          // console.log(response.data);
          store.dispatch({type:'UPLOAD_FILECHANGE',payload:response.data.file_id})
        })
        .catch((error)=> {
          console.log(error);
        })
      },
      // UPLOAD_LISTFILE(ref, req){
      //   axios.get('/upload/list/'+ref+'/'+req)
      //   .then((response)=> {
      //     // this.listFiles = response.data;
      //     // console.log(response.data);
      //     store.dispatch({type:'UPLOAD_LISTFILE',payload:response.data})
      //   })
      //   .catch((error)=> {
      //     console.log(error);
      //   })
      // },
      UPLOAD_DELETE(data){
        this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        axios.delete('/upload/file/'+data)
        .then( (response)=>{
            console.log(response);
            // store.dispatch({type:'UPLOAD_DELETE',payload:response.data})
            this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){
              console.log('success');
            }});
        })
        .catch(function (error) {
            console.log(error);
        });
      }
   }]
};

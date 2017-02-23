import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[]
}

export function uploadReducer(state = initialState,action){

    switch (action.type) {
        case 'UPLOAD_LIST':
          return Object.assign({},state,{list:action.payload});
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
   }]
};

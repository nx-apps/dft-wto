import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[]
}

export function importerReducer(state = initialState,action){

    switch (action.type) {
        case 'IMPORT_LIST':
          return Object.assign({},state,{list:action.payload});
        default:
          return state
    }

}

export function importerAction(store){
    return [commonAction(),{
      IMPORT_LIST:function(params){
        axios.get('/importer')
        .then((response)=> {
          store.dispatch({type:'IMPORT_LIST',payload:response.data})
          console.log("success");
        })
        .catch((error)=> {
          console.log("error");
          console.log(error);
        })

      }
   }]
};

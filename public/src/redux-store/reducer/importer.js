import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    year:''
}

export function importerReducer(state = initialState,action){

    switch (action.type) {
        case 'IMPORT_LIST':
          return Object.assign({},state,{list:action.payload});
        case 'IMPORTER_CLEAR' :
            return Object.assign({},state,{select:{}});
        case 'IMPORTER_SELETED' : 
            return Object.assign({},state,{select:action.payload});
        case 'IMPORT_SET_YEAR' :
            return Object.assign({},state,{year:action.payload});
        default:
          return state
    }

}

export function importerAction(store){
    return [commonAction(),{
      IMPORT_LIST(params){
        this.fire('toast',{status:'load'});
        axios.get('/importer'+params)
        .then((response)=> {
            this.fire('toast', {
                        status: 'success', text: 'ดึงข้อมูลสำเร็จ',
                        callback: () => {
                            //this.$$('panel-right').close();
                        }
                    });
          store.dispatch({type:'IMPORT_LIST',payload:response.data})
        })
        .catch((error)=> {
          console.log(error);
        })
      },
      IMPORTER_CLEAR(){
         store.dispatch({type:'IMPORTER_CLEAR',payload:{}})
      },
      IMPORTER_SELETED(data){
          store.dispatch({type:'IMPORTER_SELETED',payload:data})
      },
      IMPORT_SET_YEAR(data){
          store.dispatch({type:'IMPORT_SET_YEAR',payload:data})
      },
   }]
};

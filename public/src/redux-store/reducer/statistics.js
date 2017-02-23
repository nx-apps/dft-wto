import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
}

export function statisticsReducer(state = initialState,action){

    switch (action.type) {
        case 'STATISTICS_CLEAR' :
            return Object.assign({},state,{select:{}});
        case 'STATISTICS_SEARCH' : 
            return Object.assign({},state,{list:action.payload});
        default:
          return state
    }

}

export function statisticsAction(store){
    return [commonAction(),{
      STATISTICS_CLEAR(){
         store.dispatch({type:'STATISTICS_CLEAR',payload:{}})
      },
      STATISTICS_SEARCH(data){
        console.log(data)
        this.fire('toast',{status:'load'});
        axios.get('/importer'+data)
        .then((response)=> {
            this.fire('toast', {
                        status: 'success', text: 'ดึงข้อมูลสำเร็จ',
                        callback: () => {
                            //this.$$('panel-right').close();
                        }
                    });
          store.dispatch({type:'STATISTICS_SEARCH',payload:response.data})
        })
        .catch((error)=> {
          console.log(error);
        })
      }
   }]
};

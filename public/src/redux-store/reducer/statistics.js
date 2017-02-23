import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    year:'2556'
}

export function statisticsReducer(state = initialState,action){

    switch (action.type) {
        case 'STATISTICS_CLEAR' :
            return Object.assign({},state,{select:{}});
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
      }
   }]
};

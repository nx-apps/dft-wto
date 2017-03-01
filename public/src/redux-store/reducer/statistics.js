import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    year:'',
    settitle:'',
    list_stat:[]
}

export function statisticsReducer(state = initialState,action){

    switch (action.type) {
        case 'STATISTICS_CLEAR' :
            return Object.assign({},state,{select:{}});
        case 'STATISTICS_SEARCH' :
            return Object.assign({},state,{list:action.payload});
        case 'STATISTICS_SET_YEAR' :
            return Object.assign({},state,{year:action.payload});
        case 'STATISTICS_LIST_ALL' :
        // console.log(action.payload)
            return Object.assign({},state,{list_stat:action.payload});
        case 'STATISTICS_LIST_INQUOTA' :
            return Object.assign({},state,{list_stat:action.payload});
        case 'STATISTICS_LIST_OUTQUOTA' :
            return Object.assign({},state,{list_stat:action.payload});
        case 'STATISTICS_SETSEARCH' :
        // console.log(action.payload)
            return Object.assign({},state,{settitle:action.payload});
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
        // console.log(data)
        this.fire('toast',{status:'load'});
        axios.get('/importer?report_status=true'+data)
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
      },
      STATISTICS_SET_YEAR(year){
        store.dispatch({type:'STATISTICS_SET_YEAR',payload:year})
      },
      STATISTICS_LIST_ALL(data){
        // console.log(data)
        axios.get('/statistics'+data)
        .then((response)=> {
          store.dispatch({type:'STATISTICS_LIST_ALL',payload:response.data})
        })
        .catch((error)=> {
          console.log(error);
        })
      },
      STATISTICS_LIST_INQUOTA(data){
        // console.log(data)
        axios.get('/statistics/inquota'+data)
        .then((response)=> {
          store.dispatch({type:'STATISTICS_LIST_INQUOTA',payload:response.data})
        })
        .catch((error)=> {
          console.log(error);
        })
      },
      STATISTICS_LIST_OUTQUOTA(data){
        // console.log(data)
        axios.get('/statistics/outquota'+data)
        .then((response)=> {
          // console.log(response.data);
          store.dispatch({type:'STATISTICS_LIST_OUTQUOTA',payload:response.data})
        })
        .catch((error)=> {
          console.log(error);
        })
      },
      STATISTICS_SETSEARCH(data){
        var datas = {
          quota : data.quota,
          year : data.year+543,
          period : data.period
        }
        store.dispatch({type:'STATISTICS_SETSEARCH',payload:datas})
      }
   }]
};

import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    balanceList:[]
}

export function myAppReducer(state = initialState,action){

    switch (action.type) {
        case 'MY_APP_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'MY_APP_BALANCE_LIST':
            return Object.assign({},state,{balanceList:action.payload});
        case 'PROVIDER_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        default:
            return state
    }

}

export function myAppAction(store){

    return [commonAction(),
        {

            MY_APP_LIST:function(id){
                axios.get(`/users/user/${id}`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_BALANCE_LIST:function(id){
                axios.get(`/apps/balanceList/${id}`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_BALANCE_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            MY_APP_REQUEST:function(app_id){
                var uid = this.getParam.id;
                axios.post(`/apps/request`,{app_id,uid})
                .then(res=>{    
                    //console.log(res.data)
                    this.MY_APP_LIST(this.getParam.id);
                    this.MY_APP_BALANCE_LIST(this.getParam.id);
                    this.$$('panel-right').close();
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]

}
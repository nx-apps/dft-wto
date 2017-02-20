import axios from '../axios'
import {commonAction} from '../config'
import async from 'async'

const initialState = {
    list:[],
    select:{},
    providerList:[]
}

export function appReducer(state = initialState,action){

    switch (action.type) {
        case 'APP_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'APP_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'APP_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        case 'APP_PROVIDER_LIST':
            return Object.assign({},state,{providerList:action.payload});
        default:
            return state
    }

}

export function appAction(store){

    return [commonAction(),
        {

            APP_PROVIDER_LIST:function(){
                axios.get('/providers')
                .then(res=>{
                    store.dispatch({type:'APP_PROVIDER_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            APP_LIST:function(){
                axios.get('/apps')
                .then(res=>{
                    store.dispatch({type:'APP_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            APP_SELECT:function(id){
                axios.get(`/apps/app/${id}`)
                .then(res=>{
                    store.dispatch({type:'APP_SELECT',payload:res.data})
                    this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            APP_CLEAR_SELECT:function(){
                // var providerList = store.getState().app.providerList;
                // async.map(providerList ,function(row, callback){
                //     callback(null, {id:row.id,provider_name:row.provider_name,checked:false});
                // } ,function (err, result) {
                //     store.dispatch({type:'APP_CLEAR_SELECT',payload:{provider:result}})
                // });
                store.dispatch({type:'APP_CLEAR_SELECT'})
            },
            APP_INSERT:function(data){

                this.fire('toast',{status:'load'});

                axios.post(`/apps/app`,data)
                .then(res=>{
                    this.APP_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            APP_DELETE:function(id){
                
                this.fire('toast',{status:'load'});
                axios.delete(`/apps/app/${id}`)
                .then(res=>{
                    this.APP_LIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            APP_UPDATE:function(data){
                //console.log(data);
                this.fire('toast',{status:'load'});

                axios.put(`/apps/app`,data)
                .then(res=>{
                    this.APP_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]

}
import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{period:[{no:1},{no:2},{no:3}]},
    select_quota:{},
    list:[],
}

export function quotaReducer(state = initialState,action){

    switch (action.type) {
        case 'QUOTA_CLEAR' :
            return Object.assign({},state,{select:{period:[{no:1},{no:2},{no:3}]}});
        case 'QUOTA_lIST':
            return Object.assign({},state,{list:action.payload});
        case 'QUOTA_SELETED' : 
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }
vvc
}

export function quotaAction(store){
    return [commonAction(),{
        QUOTA_CLEAR(){
         store.dispatch({type:'QUOTA_CLEAR',payload:{}})
        },
        QUOTA_lIST(){
          axios.get('/quota/')
                .then(res=>{
                    store.dispatch({type:'QUOTA_lIST',payload:res.data})
                })
                .catch(err=>{

                })
        },
        QUOTA_SELETED(data){
          store.dispatch({type:'QUOTA_SELETED',payload:data})
        },
        QUOTA_INSERT(data){
            console.log(data)
            this.fire('toast',{status:'load'});
            axios.post(`/quota/insert`,data)
                .then(res=>{
                    this.QUOTA_lIST();
                    console.log(res)
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
        QUOTA_DELETE(data){
            this.fire('toast',{status:'load'});
            console.log(data.id)
            axios.delete(`/quota/delete/id/${data.id}`)
                .then(res=>{
                    this.QUOTA_lIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
        }
    }]
};

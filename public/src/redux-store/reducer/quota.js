import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{installment:[{period_no:1},{period_no:2},{period_no:3}]},
    list:[],
}

export function quotaReducer(state = initialState,action){

    switch (action.type) {
        case 'QUOTA_lIST':
            // console.log('>',action.payload)
            return Object.assign({},state,{list:action.payload});

        default:
            return state
    }

}

export function quotaAction(store){
    return [commonAction(),{
        QUOTA_lIST(){
          axios.get('/importer/list-quota')
                .then(res=>{
                    store.dispatch({type:'QUOTA_lIST',payload:res.data})
                })
                .catch(err=>{

                })
            // });

        },
        QUOTA_INSERT(data){
            this.fire('toast',{status:'load'});
            axios.post(`/importer/insert`,data)
                .then(res=>{
                    this.QUOTA_lIST();
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
    }]
};

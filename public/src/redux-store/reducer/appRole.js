import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[]
}


export function appRoleReducer(state = initialState,action){

    switch (action.type) {
        case 'APP_ROLE_LIST':
            return Object.assign({},state,{list:action.payload});
        default:
            return state
    }

}

export function appRoleAction(store){

    return [commonAction(),
        {
            APP_ROLE_LIST:function(id){
                axios.get(`/apps/roles/${id}`)
                .then(res=>{
                    res.data.role.push("");
                    store.dispatch({type:'APP_ROLE_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            APP_ROLE_UPDATE:function(data){
                this.fire('toast',{status:'load'});
               // data.scope = data.scope.split(",");
               // /apps/app
                var len=data.role.length;
                if(data.role[len-1]==""){
                  //  data.role.pop(len);
                   data.role.splice(len-1,1);
                }
                axios.put(`/apps/app`,data)
                .then(res=>{
                    this.APP_ROLE_LIST(data.id);
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                          //  this.$$('panel-right').close();
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
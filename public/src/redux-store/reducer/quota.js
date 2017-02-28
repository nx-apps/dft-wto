import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{period:[{no:1,quality:83252.33},{no:2,quality:83252.33},{no:3,quality:83252.34}],quality:249757},
    select_quota:{},
    list:[],
    listcountry:[],
    disable:false
}
const clearData = (data,callback)=>{
    let {year,quality,country_group}=data;
    let newData={year,quality,country_group};
    newData.period = new Array();
    data.period.map((tag)=>{
        newData.period.push({no:tag.no,quality:tag.quality});
    });
        callback(newData)
}
export function quotaReducer(state = initialState,action){

    switch (action.type) {
        case 'QUOTA_CLEAR' :
            return Object.assign({},state,{select:{period:[{no:1,quality:83252.33},{no:2,quality:83252.33},{no:3,quality:83252.34}],quality:249757}});
        case 'QUOTA_lIST':
            return Object.assign({},state,{list:action.payload});
        case 'COUNTRY_lIST' :
            return Object.assign({},state,{listcountry:action.payload});
        case 'QUOTA_SELETED' : 
            return Object.assign({},state,{select:action.payload});
        case 'QUOTA_BTN' :
            return Object.assign({},state,{disable:action.payload});
        default:
            return state
    }
}

export function quotaAction(store){
    return [commonAction(),{
        QUOTA_CLEAR(){
             console.log(0)
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
        COUNTRY_lIST(){
            // console.log(0)
          axios.get('/quota/country_group')
                .then(res=>{
                    store.dispatch({type:'COUNTRY_lIST',payload:res.data})
                })
                .catch(err=>{

                })
        },
        QUOTA_SELETED(data){
            // clearData(1111,(data)=>{
                console.log(data)
            // })
          store.dispatch({type:'QUOTA_SELETED',payload:data})
        },
        QUOTA_INSERT(data){
            clearData(data,(data)=>{
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
            })
            
        },
        QUOTA_UPDATE(data){
            console.log(data)
            this.fire('toast',{status:'load'});

                axios.put(`/quota/update`,data)
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
        },
        QUOTA_DELETE(data){
            console.log(0)
            // this.fire('toast',{
            //         status:'openDialog',
            //         text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
            //         confirmed:(result)=>{
            //             if(result == true){
            //                 this.fire('toast',{status:'load'});
            // console.log(data.id)
            axios.delete(`/quota/delete/id/${data.id}`)
                .then(res=>{
                    this.QUOTA_lIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
            //     .catch(err=>{
            //         console.log(err);
            //     })
            //             }
            //         }
            //      })
            
        },
        QUOTA_BTN(data){
            store.dispatch({type:'QUOTA_BTN',payload:data})
        }
    }]
};



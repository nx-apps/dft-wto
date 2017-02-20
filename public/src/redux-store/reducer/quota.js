import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[
        {
            year:2559,
            quality:247000,
            installment:
            [
                {
                    inm:1,
                    quality:88000,
                },
                {
                    inm:2,
                    quality:88000,
                },
                {
                    inm:3,
                    quality:88000,
                }
            ]
        }
    ],
}

export function quotaReducer(state = initialState,action){

    switch (action.type) {
        case 'QUOTA_INSERT':
            state.list.push(action.payload);
            var list = JSON.parse(JSON.stringify(state.list));

            return Object.assign({},state,{list:list});
        default:
            return state
    }

}

export function quotaAction(store){
    return [commonAction(),{
        QUOTA_INSERT:function(params){

            // axios.post('/x/x',params)
            // .catch(err=>{
            //     var data = params;
                store.dispatch({type:'QUOTA_INSERT',payload:data})
            // });

        }
    }]
};

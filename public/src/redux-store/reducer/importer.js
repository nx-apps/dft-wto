import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[
      // axios.get('/importer')
      // .then((response)=> {
      //   console.log("success");
      // })
      // .catch((error)=> {
      //   console.log("error");
      //   console.log(error);
      // })
    ]
}

export function importerReducer(state = initialState,action){

    switch (action.type) {
        case 'IMPORT_LIST':
        console.log(55555);
            // state.list.push(action.payload);
            // var list = JSON.parse(JSON.stringify(state.list));
            //
            // return Object.assign({},state,{list:list});
        default:
            return state
    }

}

export function importerAction(store){
    return [commonAction(),{
        IMPORT_LIST:function(params){
          console.log(555);
          // console.log(params);
            // axios.post('/x/x',params)
            // .catch(err=>{
            //     var data = params;
                // store.dispatch({type:'IMPORT_LIST',payload:params})
            // });

        }
    }]
};

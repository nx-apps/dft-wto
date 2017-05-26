import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    select: {},
    list: [],
    year: '',
    save_search: ''
}

export function importerReducer(state = initialState, action) {

    switch (action.type) {
        // case 'IMPORT_LIST':
        //   return Object.assign({},state,{list:action.payload});
        case 'IMPORTER_CLEAR':
            return Object.assign({}, state, { select: {} });
        case 'IMPORTER_SELETED':
            return Object.assign({}, state, { select: action.payload });
        case 'IMPORT_SET_YEAR':
            return Object.assign({}, state, { year: action.payload });
        case 'IMPORT_GET_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'IMPORT_GET_COMPANY':
            return Object.assign({}, state, { select: action.payload });
        case 'IMPORT_SAVE_SEARCH':
            return Object.assign({}, state, { save_search: action.payload });
        // case 'IMPORT_LIST_ALL' :
        // // console.log(action.payload)
        //     return Object.assign({},state,{list:action.payload});
        // case 'IMPORT_LIST_INQUOTA' :
        //     return Object.assign({},state,{list:action.payload});
        // case 'IMPORT_LIST_OUTQUOTA' :
        //     return Object.assign({},state,{list:action.payload});
        default:
            return state
    }

}

export function importerAction(store) {
    return [commonAction(), {
        IMPORT_LIST(params) {
            this.fire('toast', { status: 'load' });
            axios.get('/importer' + params)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'ดึงข้อมูลสำเร็จ',
                        callback: () => {
                            //this.$$('panel-right').close();
                        }
                    });
                    store.dispatch({ type: 'IMPORT_LIST', payload: response.data })
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        IMPORTER_CLEAR() {
            store.dispatch({ type: 'IMPORTER_CLEAR', payload: {} })
        },
        IMPORTER_SELETED(data) {
            store.dispatch({ type: 'IMPORTER_SELETED', payload: data })
        },
        IMPORT_SET_YEAR(data) {
            store.dispatch({ type: 'IMPORT_SET_YEAR', payload: data })
        },
        IMPORT_EXCEL() {
            this.fire('toast', { status: 'load' });
            axios.get('/excel/read')
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'นำเข้าข้อมูลสำเร็จ',
                        callback: () => {
                            this.IMPORT_LIST_ALL("?year=2017");
                        }
                    });
                    // console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        IMPORT_GET_LIST(data) {
            // console.log(data);
            axios.get('./importer/list' + data)
                .then((response) => {
                    store.dispatch({ type: 'IMPORT_GET_LIST', payload: response.data })
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        IMPORT_GET_COMPANY(id) {
            axios.get('./importer/company?id=' + id)
                .then((response) => {
                    // console.log(response.data);
                    store.dispatch({ type: 'IMPORT_GET_COMPANY', payload: response.data[0] })
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        IMPORT_INSERT_TRAN_NO(data) {
            var year = new Date().getFullYear();
            var data_refresh = '?year='+year+'&quota=all&period=0';
            this.fire('toast', { status: 'load' })
            axios.post('./importer/insert', data)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.IMPORT_GET_COMPANY(data.id);
                            this.IMPORT_GET_LIST(data_refresh);
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        IMPORT_SAVE_SEARCH(data){
            // console.log(data);
            store.dispatch({type:'IMPORT_SAVE_SEARCH',data})
        },
        IMPORT_EDIT_TRAN_NO(data){
            // console.log(data);
            var year = new Date().getFullYear();
            var data_refresh = '?year='+year+'&quota=all&period=0';
            this.fire('toast', { status: 'load' })
            axios.put('./importer/update', data)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.IMPORT_GET_COMPANY(data.id);
                            this.IMPORT_GET_LIST(data_refresh);
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        // IMPORT_LIST_ALL(data){
        //   // console.log(data)
        //   axios.get('/importer'+data)
        //   .then((response)=> {
        //     store.dispatch({type:'IMPORT_LIST_ALL',payload:response.data})
        //   })
        //   .catch((error)=> {
        //     console.log(error);
        //   })
        // },
        // IMPORT_LIST_INQUOTA(data){
        //   axios.get('/importer/inquota'+data)
        //   .then((response)=> {
        //     store.dispatch({type:'IMPORT_LIST_INQUOTA',payload:response.data})
        //   })
        //   .catch((error)=> {
        //     console.log(error);
        //   })
        // },
        // IMPORT_LIST_OUTQUOTA(data){
        //   axios.get('/importer/outquota'+data)
        //   .then((response)=> {
        //     // console.log(response.data);
        //     store.dispatch({type:'IMPORT_LIST_OUTQUOTA',payload:response.data})
        //   })
        //   .catch((error)=> {
        //     console.log(error);
        //   })
        // }
    }]
};

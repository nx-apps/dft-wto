import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    detail: [],
    headerCustoms: {}
}

export function certReducer(state = initialState, action) {

    switch (action.type) {
        case 'CERT_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        case 'CERT_SELECTED':
            return Object.assign({}, state, { detail: action.payload });
        case 'CEAR_CUSTOMS':
            return Object.assign({}, state, { headerCustoms: action.payload });

        default:
            return state
    }

}

export function certAction(store) {
    return [commonAction(), {
        CERT_SEARCH(data) {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            // console.log(data); 
            axios.post('/search', data)
                .then((response) => {
                    // //console.log(response);
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'CERT_SEARCH', payload: response.data })
                        }
                    });
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        CERT_SELECTED(data, _this = '') {
            this.fire('toast', { status: 'load' });
            axios.get('/search/detail?refCode=' + data.reference_code2)
                .then(res => {
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'CERT_SELECTED', payload: res.data })
                            if (_this !== '')
                                _this.$.pr.open()
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        // get
        CEAR_CUSTOMS(data) {
            axios.get('/search/head?refCode=' + data.reference_code2)
                .then(res => {
                    store.dispatch({ type: 'CEAR_CUSTOMS', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        CERT_POST_CUSTOMS(data, dataSearch) {
            this.fire('toast', { status: 'load' });
            axios.post('/search/save', data)
                .then(res => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback() {
                            console.log(res.data)

                        }
                    })
                    this.CERT_SELECTED(dataSearch)
                    this.CEAR_CUSTOMS(dataSearch)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }]
};

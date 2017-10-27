import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    detail: []
    // select: []
}

export function certReducer(state = initialState, action) {

    switch (action.type) {
        case 'CERT_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        case 'CERT_SELECTED':
            return Object.assign({}, state, { detail: action.payload });
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
        CERT_SELECTED(data, _this) {
            // console.log(data);
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.get('/search/get?refCode=' + data.invh_run_auto)
                .then(res => {
                    _this.$.pr.open()
                    console.log(res.data );
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'CERT_SELECTED', payload: res.data })
                        }
                    });


                })
                .catch(err => {

                })
        },
    }]
};

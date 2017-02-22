import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {}
}

export function countryGroupReducer(state = initialState, action) {

    switch (action.type) {
        case 'COUNTRY_GROUP_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'COUNTRY_GROUP_SELECT':
            return Object.assign({}, state, { select: action.payload });
        case 'COUNTRY_GROUP_CLEAR_SELECT':
            return Object.assign({}, state, { select: {} });
        default:
            return state
    }

}

export function countryGroupAction(store) {

    return [commonAction(),
    {

        COUNTRY_GROUP_LIST: function () {
            axios.get('/providers')
                .then(res => {
                    store.dispatch({ type: 'COUNTRY_GROUP_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        COUNTRY_GROUP_SELECT: function (id) {
            axios.get(`/providers/provider/${id}`)
                .then(res => {
                    store.dispatch({ type: 'COUNTRY_GROUP_SELECT', payload: res.data })
                    this.$$('panel-right').open();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        COUNTRY_GROUP_CLEAR_SELECT: function () {
            store.dispatch({ type: 'COUNTRY_GROUP_CLEAR_SELECT' })
        },
        COUNTRY_GROUP_INSERT: function (data) {

            this.fire('toast', { status: 'load' });
            data.scope = data.scope.split(",");

            axios.post(`/providers/provider`, data)
                .then(res => {
                    this.COUNTRY_GROUP_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })

        },
        COUNTRY_GROUP_DELETE: function (id) {

            this.fire('toast', { status: 'load' });

            axios.delete(`/providers/provider/${id}`)
                .then(res => {
                    this.COUNTRY_GROUP_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'ลบข้อมูลสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        COUNTRY_GROUP_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            data.scope = data.scope.split(",");

            axios.put(`/providers/provider`, data)
                .then(res => {
                    this.COUNTRY_GROUP_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    ]

}
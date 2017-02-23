import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    country: [],
    list: [],
    select: {}
}

export function countryGroupReducer(state = initialState, action) {

    switch (action.type) {
        case 'COUNTRY_LIST':
            return Object.assign({}, state, { country: action.payload });
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
        COUNTRY_LIST: function () {
            axios.get('/countryGroup/country')
                .then(res => {
                    store.dispatch({ type: 'COUNTRY_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        COUNTRY_GROUP_LIST: function () {
            axios.get('/countryGroup')
                .then(res => {
                    store.dispatch({ type: 'COUNTRY_GROUP_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        COUNTRY_GROUP_SELECT: function (id) {
            axios.get(`/countryGroup/group/${id}`)
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
        COUNTRY_GROUP_APPEND: function (data) {
            this.fire('toast', { status: 'load' });
            axios.put(`/countryGroup/append`, data)
                .then(res => {
                    //store.dispatch({ type: 'COUNTRY_GROUP_SELECT', payload: res.data })
                    this.COUNTRY_GROUP_SELECT(data.id);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            //this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        COUNTRY_GROUP_INSERT: function (data) {

            this.fire('toast', { status: 'load' });
            data.scope = data.scope.split(",");

            axios.post(`/countryGroup`, data)
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

            axios.delete(`/countryGroup/${id}`)
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

            axios.put(`/countryGroup`, data)
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
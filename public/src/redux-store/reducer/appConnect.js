import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: []
}

export function appConnectReducer(state = initialState, action) {

    switch (action.type) {
        case 'APP_CONNECT_LIST':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function appConnectAction(store) {

    return [commonAction(),
    {
        APP_CONNECT_LIST: function (id) {
            axios.get(`/apps/connects/${id}`)
                .then(res => {
                    store.dispatch({ type: 'APP_CONNECT_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        APP_CONNECT_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            var conns=[]
            data.connections.forEach(function (conn) {
                   if (conn.status == true) {
                      conns.push(conn.id);
                   }
            });
            data.connections=conns;
            axios.put(`/apps/app`, data)
                .then(res => {
                    this.APP_CONNECT_LIST(data.id);
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
        }
    }
    ]

}
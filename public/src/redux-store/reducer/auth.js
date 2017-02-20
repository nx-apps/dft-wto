import axios from '../axios'
import {commonAction} from '../config'
import jwtDecode from 'jwt-decode'

const initialState = {
    user:{role:'none'}
}

export function authReducer(state = initialState,action){

    switch (action.type) {
        case 'AUTH_SET_USER':
            var userInfo;
            if(action.payload.token){
                userInfo = jwtDecode(action.payload.token)
            }else{
                userInfo = action.payload;
            }
            return Object.assign({},state,{user:userInfo});
        default:
            return state
    }

}

export function authAction(store){

    return [commonAction(),
        {
            AUTH_LOGIN:function(formLogin){
                axios.post('./auth/login',{username:formLogin.user,password:formLogin.pass})
                .then((response)=>{


                    localStorage.setItem("token",response.data.token);
                    store.dispatch({type:'AUTH_SET_USER',payload:response.data})

                    let userInfo;
                    if(response.data.token){
                        userInfo = jwtDecode(response.data.token)
                    }else{
                        userInfo = response.data;
                    }

                    if(userInfo.role=="teacher"){
                        this.fire('nylon-change-page',{path:'/examRoom'})
                    }else{
                        this.fire('nylon-change-page',{path:'/examHistory'})
                    }

                })
                .catch((error)=>{
                    //console.log('error');
                    console.log({error});
                    alert('error')
                });
            }
        }
    ]

}
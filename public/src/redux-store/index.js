import { createStore, combineReducers } from 'redux'
import PolymerRedux from 'polymer-redux'
import { dispatchActionBehavior } from './config'


import { commonSystemReducer, commonSystemAction } from './reducer/commonSystem'
import { authReducer, authAction } from './reducer/auth'
import { providerReducer, providerAction } from './reducer/provider'
import { appReducer, appAction } from './reducer/app'
import { appConnectReducer, appConnectAction } from './reducer/appConnect'
import { appRoleReducer, appRoleAction } from './reducer/appRole'

import {appReducer,appAction} from './reducer/app'
import {  myAppReducer, myAppAction } from './reducer/myApp'
import { appUserReducer, appUserAction } from './reducer/appUser'


const rootReducer = combineReducers({
    commonSystem: commonSystemReducer,
    auth: authReducer,
    provider: providerReducer,
    app: appReducer,
    appConnect: appConnectReducer,
    appRole: appRoleReducer,
    appUser: appUserReducer,
    myApp:myAppReducer

});
const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp), dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();

window.commonSystemAction = commonSystemAction(storeApp);
window.authAction = authAction(storeApp);
window.providerAction = providerAction(storeApp);
window.appAction = appAction(storeApp);
window.appRoleAction = appRoleAction(storeApp);
window.appConnectAction = appConnectAction(storeApp);
window.appUserAction = appUserAction(storeApp);
window.myAppAction = myAppAction(storeApp);
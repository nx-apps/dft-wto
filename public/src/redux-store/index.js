import { createStore, combineReducers } from 'redux'
import PolymerRedux from 'polymer-redux'
import { dispatchActionBehavior } from './config'


import { commonSystemReducer, commonSystemAction } from './reducer/commonSystem'

import { quotaReducer, quotaAction } from './reducer/quota'
import { importerReducer, importerAction } from './reducer/importer'
import { statisticsReducer, statisticsAction } from './reducer/statistics'
import { countryGroupReducer, countryGroupAction } from './reducer/countryGroup'
import { uploadReducer, uploadAction } from './reducer/upload'

import { authReducer, authAction } from './reducer/auth'
import { providerReducer, providerAction } from './reducer/provider'
import { appReducer, appAction } from './reducer/app'
import { appConnectReducer, appConnectAction } from './reducer/appConnect'
import { appRoleReducer, appRoleAction } from './reducer/appRole'

import { appReducer, appAction } from './reducer/app'
import { myAppReducer, myAppAction } from './reducer/myApp'
import { appUserReducer, appUserAction } from './reducer/appUser'


const rootReducer = combineReducers({
    commonSystem: commonSystemReducer,
    importer: importerReducer,
    quota: quotaReducer,
    statistics: statisticsReducer,    
    countryGroup: countryGroupReducer,
    auth: authReducer,
    provider: providerReducer,
    app: appReducer,
    appConnect: appConnectReducer,
    appRole: appRoleReducer,
    appUser: appUserReducer,
    myApp: myAppReducer,
    upload: uploadReducer

});
const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp), dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();

window.importerAction = importerAction(storeApp);
window.quotaAction = quotaAction(storeApp);
window.statisticsAction = statisticsAction(storeApp);

window.countryGroupAction = countryGroupAction(storeApp);
window.uploadAction = uploadAction(storeApp);

window.commonSystemAction = commonSystemAction(storeApp);

window.authAction = authAction(storeApp);
window.providerAction = providerAction(storeApp);
window.appAction = appAction(storeApp);
window.appRoleAction = appRoleAction(storeApp);
window.appConnectAction = appConnectAction(storeApp);
window.appUserAction = appUserAction(storeApp);
window.myAppAction = myAppAction(storeApp);

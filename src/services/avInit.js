import AV from 'leancloud-storage'
import {APP_ID, APP_KEY} from './config'

AV.init({appId: APP_ID, appKey: APP_KEY});

export default AV

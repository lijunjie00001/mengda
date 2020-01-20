/**
 * Created by zhangyu on 2017/11/20.
 */
import { combineReducers } from 'redux'
import LoadReducer from './LoadReducer'
import PageReducer from './PageReducer'
import showWife    from './ShowWifeReducer'
import nav from './StackRouter'
import LoginInfo from './LoginInformationReducer'
import publishListPage from './publishListPage-Reducer'
const hhhh = combineReducers({
     nav: nav,
     LoadReducer,
     PageReducer,
     showWife,
     LoginInfo,
     publishListPage
})
export default hhhh
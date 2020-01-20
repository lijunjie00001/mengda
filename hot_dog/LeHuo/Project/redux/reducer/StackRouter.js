
import Router from '../../router/Router'
const navReducer = (state,action) => {
    if(action.type.indexOf('Navigation')>-1||action.type.indexOf('redux')>-1){
        const newState = Router.router.getStateForAction(action, state);
        //避免重复跳转
        if(state){
            let newRouteName=newState.routes[newState.routes.length-1].routeName;
            let forceNav=newState.routes[newState.routes.length-1].params?newState.routes[newState.routes.length-1].params.forceNav?true:false:false
            if(forceNav){
                return newState || state;
            }
            let RouteName=state.routes[state.routes.length-1].routeName;
            let NewforceNav=state.routes[state.routes.length-1].params?state.routes[state.routes.length-1].params.forceNav?true:false:false
            if(NewforceNav){
                return newState || state;
            }
            if(newRouteName===RouteName){
                return state;
            }
        }
        return newState || state;
    }
    return state
}
export default navReducer

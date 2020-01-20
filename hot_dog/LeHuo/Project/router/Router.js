
import React, {
    DeviceEventEmitter
} from 'react-native';
import RouteConfigs from "./RouteConfigs";
import { StackNavigator } from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps;
        const { route } = scene;
        const params = route.params || {};
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },

});

const StackNavigatorConfig={
    initialRouteName:'MainPage',
    navigationOptions: {
        header:null,
        gesturesEnabled:true
    },
    mode: 'card',//页面跳转方式
    // transitionConfig:()=>({
    //     screenInterpolator: CardStackStyleInterpolator.forVertical
    // }),
    transitionConfig:TransitionConfiguration,
    onTransitionEnd: (() => {
        DeviceEventEmitter.emit('didfocus');
    }),

}
const Router = StackNavigator(RouteConfigs, StackNavigatorConfig);

export default Router
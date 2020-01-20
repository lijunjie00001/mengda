/**
 * Created by zhangyu on 2017/11/21.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    InteractionManager, DeviceEventEmitter,Keyboard
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Load from '../components/Load'
import fetchData from '../redux/action/fetch'
import setContainer from '../redux/action/PageSetNavAction'
import Login from  '../redux/action/Login'
import exit    from '../redux/action/exit'
import NavBar from '../components/NavBar'
import getPageData from'../redux/reducer/GetPageDataFromReducer'
import Ibcontainer from './IBcontainer'
import ShowNoWife  from '../components/NoWifi'
import CommonPicker from '../../Resourse/CommonPicker'
import TimePicker   from '../../Resourse/TimePicker'
import { SafeAreaView } from 'react-navigation';
const mapStateToProps= (store,ownProps)=> {
    let navData = getPageData(store.PageReducer,ownProps);
    let isLoad=getPageData(store.LoadReducer,ownProps).isLoad;
    let showWife=getPageData(store.showWife,ownProps);
    let userInfo=store.LoginInfo.userInfo;
    return {
        isLoad:isLoad,
        ...navData,
        ...showWife,
        ...userInfo,
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return (dispath)=> bindActionCreators({
        fetchData: fetchData,
        setContainer:setContainer,
        Login:Login,
        exit:exit,
    },dispatch);
};
@Ibcontainer()
@connect(mapStateToProps,mapDispatchToProps)
export default ()=> (Comp) => class extends Component{
        isLockRender = false;
        constructor(props, context) {
            super(props, context);
            this.back = this.back.bind(this);
            this.push=this.push.bind(this);
            this.popTocompent=this.popTocompent.bind(this);
            this.replace=this.replace.bind(this)
            this.fetchData=this.fetchData.bind(this);
            this.retryAction=this.retryAction.bind(this);
            this.backTo=this.backTo.bind(this)
        }
        static propTypes = {
            hiddenNav: React.PropTypes.bool,       //是否隐藏Nav
            title: React.PropTypes.string,         //标题
            titleStyle:Text.propTypes.style,       //自定义标题样式
            rightBtnItems:React.PropTypes.array,   //右边的按钮 格式[{title:'',imageSource:'0',func:func}]
            //返回按钮设置
            backBtnTitle: React.PropTypes.string,  //返回按钮的标题
            back: React.PropTypes.func,            // 返回按钮的方法,只有在特殊要求的情况下才传入
            hiddenBackBtn:React.PropTypes.bool,    // 是否隐藏返回按钮
            isLoad:React.PropTypes.bool,           //是否显示Load
            isPushed:React.PropTypes.bool,         //导航是否已经结束
            isShowWife:React.PropTypes.bool,      //是否显示网络错误页
            RetryAction:React.PropTypes.object,     //点击wifi重试按钮,触发的action
        };
        static defaultProps = {
            hiddenNav: false,
            title: '',
            titleStyle:{},
            rightBtnItems: [],
            backBtnTitle:'',
            hiddenBackBtn: false,
            isLoad:false,
            isPushed:false,
            isShowWife:false,
            RetryAction:{}
        };
       componentWillMount() {
            this.didfocus=DeviceEventEmitter.addListener('didfocus',this.viewDidFocus.bind(this));
       }
       componentWillUnmount(){
           Keyboard.dismiss()
           CommonPicker.hide();
           TimePicker.hide();
           this.didfocus.remove();
        }
       viewDidFocus(event){
        this.props.setContainer(this,{
            isPushed:true
        })
       }
       navigatorTransform(page,params,title){
            this.props.navigation.navigate(
                    page,params
                )
        }
        showNav(){
        if(!this.props.hiddenNav){
            return (<NavBar {...this.props} backFunction={this.props.back||this.back}/>);
        }
        }
        back(){
            TimePicker.hide();
            CommonPicker.hide();
            this.props.navigation.goBack();
        }
        replace(page,params){
            this.props.navigation.replace(
                page,params
            )
        }
        push(page,params,title){
            // if(!this.props.loginStatus&&(page==='MyApply')) {
            //     this.props.navigation.navigate('Login',{ transition:'forVertical'})
            //     return ;
            // }

            // if (page == 'MyApply') {
            //     this.navigatorTransform('Login',params,title);
            // } else {
                this.navigatorTransform(page,params,title);
            // }
        }
       //返回到特定页面
       popTocompent(page){
           DeviceEventEmitter.emit('popComponent',page);
       }
       //固定返回到第几个页面，为选择城市页面做处理
       backTo(num){
           DeviceEventEmitter.emit('backToSite',num);
       }
      retryAction() {
          let {pageId,type,urlParam,bridge,successCallback,failCallback} = this.props.RetryAction.data;
          //判断是不是当前页面，然后刷新
          if (this.props.pageId === pageId) {
              this.fetchData(this,type,urlParam,bridge,successCallback,failCallback);
          }
      }
     shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.isLoad!==this.props.isLoad
            ||nextProps.title!==this.props.title
            ||nextProps.isPushed!==this.props.isPushed
            ||nextProps.isShowWife!==this.props.isShowWife
            ||nextProps.loginStatus!==this.props.loginStatus
            ||nextProps.certification!==this.props.certification
        ){
            return true;
        }
        else {
            return false;
        }
     }
     /*
       请求接口封装加在动画结束后
      */
     fetchData(fromPage,type,urlParam,bridge,successCallback,failCallback,errorCallback){
         InteractionManager.runAfterInteractions(() => {
              this.props.fetchData(fromPage,type,urlParam,bridge,successCallback,failCallback,errorCallback)
         });
     }
     render() {
             console.log('........kkkk')
            return (
                <SafeAreaView style={[styles.mainStyle, this.props.style]}>
                     {this.showNav()}
                     <View style={styles.container}>
                     {this.props.isPushed?<Comp {...this.props} {...this.props.navigation.state.params} push={this.push}  back={this.back} popTocompent={this.popTocompent} replace={this.replace}
                                                fetchData={this.fetchData} backTo={this.backTo}/>:null}
                     {this.props.isLoad?<Load/>:null}
                     {this.props.isShowWife?<ShowNoWife resetFunc={this.retryAction}/>:null}
                   </View>
               </SafeAreaView>
            )
        }
}
let styles = StyleSheet.create({
        mainStyle: {
            flexDirection: 'column',
            flex: 1,
            backgroundColor:'white',
            zIndex: 1
        },
        container: {
            flex: 1,
        },
});

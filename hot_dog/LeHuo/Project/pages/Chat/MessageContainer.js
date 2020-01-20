import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, Image, ActivityIndicator, Alert,FlatList
} from 'react-native';
import colors from "../../../Resourse/Colors";
import Images from "../../../Resourse/Images";
import MessageText from './MessageText'
import MessageImage from './MessageImage'
import MessageVoice from './MessageVoice'
import DateUtils from '../../../Resourse/DateUtil'
import shallowEqual from "./shallowEqual";
import ASText from '../../components/ASText'
export default class MessageContainer extends Component{
    static propTypes = {
        messages:React.PropTypes.array,
        refreshing:React.PropTypes.bool,
        username:React.PropTypes.string,
    }
    static defaultProps = {
        messages:[],
        refreshing:false
    }
    constructor(props){
        super(props)
        this.ListFooterComponent=this.ListFooterComponent.bind(this)
        this.sclloviewTop=this.sclloviewTop.bind(this)
        this.state = {
             messagesData: this.prepareMessages(props.messages),
           //  messagesData:props.messages,
            refreshing:false
        };
    }
    prepareMessages(messages) {
        return messages.reduce((o, m, i) => {
            const previousMessage = messages[i + 1] || {}
            const nextMessage = messages[i - 1] || {}
            o.push({
                ...m,
                previousMessage,
                nextMessage
            })
            return o
        }, [])
    }
    onRefresh(){
        console.log('.........onRefresh')
        if(this.state.messagesData.length==0)return
        if(this.props.onPull){
            this.props.onPull()
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (!shallowEqual(this.props.messages, nextProps.messages)) {
            return true;
        }
        let result=!shallowEqual(this.state.messagesData, nextState.messagesData);
        return result
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.messagesData === nextProps.messages) {
            return;
        }
        let array=this.prepareMessages(nextProps.messages)
        this.setState({
            messagesData: array
        });
    }
    isSameDay(currentMessage = {}, diffMessage = {}) {
        let diff = 0;
        if (diffMessage.createdAt && currentMessage.createdAt) {
            //diff = Math.abs(moment(diffMessage.createdAt).startOf('milliseconds').diff(moment(currentMessage.createdAt).startOf('milliseconds'), 'ms'));
            diff = currentMessage.createdAt - diffMessage.createdAt;
            // console.info(diff)
        } else {
            diff = 7000 * 6;
        }
        if (diff < 7000 * 6) {
            return true;
        }
        return false;
    }
    renderRow(item,index){
        return(
            <View style={{transform:[{scaleY: -1}]}}>
                {!this.isSameDay(item,item.previousMessage)?<View style={{alignItems:'center',marginTop:10}}>
                    <ASText style={{fontSize:13,color:colors.TIME}} text={DateUtils.showTime(item.createdAt)}></ASText>
                </View>:null}
                {item.type=='text'? <MessageText username={this.props.username} onClickIcon={this.props.onClickIcon}
                        Message={item} index={index} MessageError={()=>{this.onMessageError(index,item)}}/>:
                    item.type=='image'? <MessageImage username={this.props.username} onClickIcon={this.props.onClickIcon}
                            Message={item} index={index} MessageError={()=>{this.onMessageError(index,item)}}/>:
                    item.type=='voice'?  <MessageVoice username={this.props.username} onClickIcon={this.props.onClickIcon}
                            Message={item} index={index} MessageError={()=>{this.onMessageError(index,item)}} />:
                            <View></View>
                }
            </View>
        )
    }
    onMessageError(index,item){
        if(this.props.onMessageError){
            this.props.onMessageError(index,item)
        }
    }
    /**
     *@desc   滚到顶部
     *@author 张羽
     *@date   2019/1/24 下午5:31
     *@param
     */
    sclloviewTop(){
        // this.flatList.scrollToIndex({ viewPosition: 0, index: 0 });
    }
    /**
     *@desc   头部
     *@author 张羽
     *@date   2018/12/29 下午3:52
     *@param
     */
    ListFooterComponent(){
        if(this.props.refreshing){
            return(
                <View style={{paddingVertical:10,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator
                        color={'#666'}
                        size="small"
                        animating={this.props.refreshing}
                    />
                </View>
            )
        }else{
            return<View></View>
        }
    }
    _keyExtractor = (item, index) => item._id+''
    render(){
        return(
            <View style={{flex:1}}>
                <FlatList
                    data = {this.state.messagesData}
                    ref={(flatList) => {
                        this.flatList = flatList
                    }}
                    renderItem={({item,index})=>this.renderRow(item,index)}
                    renderSeparator={()=>null}//分割线
                    keyExtractor={this._keyExtractor}
                    contentContainerStyle={{justifyContent: 'flex-end',flexGrow: 1,paddingTop:10}}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps="handled"
                    style={{flex:1,transform:[{scaleY: -1}]}}
                    onEndReached={()=>{this.onRefresh()}}
                    ListFooterComponent={this.ListFooterComponent}
                    onEndReachedThreshold={0.3}
                    onTouchStart={()=>{
                        console.log('................onTouchStart')
                        this.props.onTouchStart()
                    }}
                    onScroll={()=>{
                        this.props.onSollview()
                    }}
                />
            </View>
        )
    }
}

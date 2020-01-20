import React,{ Component } from 'react';
import {
    Animated,
    StyleSheet,
    ScrollView,
    View,
    Text,
    RefreshControl,
} from 'react-native';
let STATUS_INFINITE_IDLE = 1,
    STATUS_INFINITING = 2,
    STATUS_CANNOT_USE=3;

let DEFAULT_PULL_DISTANCE = 60;//触发下拉刷新的高度
let DEFAULT_HF_HEIGHT = 60;    //触发上拉加载更多的高度

export default class BScrollView extends Component {
    static propTypes = {
        enablePull: React.PropTypes.bool,          //是否包含下拉更新
        enableLoadMore: React.PropTypes.bool,      //是否包含加载更多

        isPulling: React.PropTypes.bool,           //是否正在下拉加载
        isLoadingMore:React.PropTypes.bool,        //是否正在加载更多
        isLoadMoreComplate: React.PropTypes.bool,  //加载更多是否完成

        onPull: React.PropTypes.func,
        onLoadMore: React.PropTypes.func

    }
    static defaultProps = {
        enablePull: false,
        enableLoadMore: false,
        isLoading: false,
        isLoadingMore:false,
        isLoadMoreComplate: false,
    }
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);
        this.state = {
            status: STATUS_INFINITE_IDLE,
            canUseLoadMore:false,
        }
    }
    size;
    contentSize;
    renderLoadWillLoad() {
        console.log('renderLoadWillLoad');
        return (
            <View style={styles.bottomView}>
                <View>
                    <Text style={styles.text}>上拉加载更多</Text>
                </View>
            </View>
        )
    }

    renderBottomLoading() {
        console.log('renderBottomLoading');
        return (
            <View  style={styles.bottomView}>
                <View>
                    <View>
                        <Text style={styles.text}>正在加载...</Text>
                    </View>
                </View>
            </View>
        )
    }
    renderBottomLoadComplate() {
        let message = (this.contentSize&&this.contentSize.height<=60)?'暂无数据':'已显示全部内容';
        console.log('renderBottomLoadComplate',message);
        if(message==='暂无数据'){
            return (
                <View style={styles.bottomView}>
                    <Text style={styles.text}>{message}</Text>
                </View>

            )
        }else if(message==='已显示全部内容'){
            return (
                <View style={styles.bottomView}>
                    <View>
                        <View>
                            <View>
                                <Text style={styles.text}>{message}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            )
        }

    }
    renderBottomLoadView(){
        if(this.props.enableLoadMore){
            let status = this.state.status;

            if(this.props.isLoadMoreComplate){
                return this.renderBottomLoadComplate();
            } else if(this.state.canUseLoadMore){
                if (status===STATUS_INFINITE_IDLE) {
                    console.log('STATUS_INFINITE_IDLE');
                    return this.renderLoadWillLoad();
                }
                else if (status === STATUS_INFINITING) {
                    console.log('STATUS_INFINITING');
                    return this.renderBottomLoading();
                }
            }

        }
    }
    onScrollBeginDrag(event) {
        if(!this.props.isLoadMoreComplate&&this.props.enableLoadMore&&this.state.canUseLoadMore){
            var nativeEvent = event.nativeEvent;
            if (!nativeEvent.contentInset || this.state.status!==STATUS_INFINITE_IDLE) {
                return;
            }
            let y0 = nativeEvent.contentInset.top + nativeEvent.contentOffset.y +
                nativeEvent.layoutMeasurement.height-nativeEvent.contentSize.height;
            if (y0 >=-1&&y0<=1) {
                if (!this.props.isLoadMoreComplate) {
                    if(this.state.status===STATUS_INFINITE_IDLE&&!this.props.isLoadingMore){
                        this.onLoadMore();
                    }
                }
            }
        }

    }
    onScroll(event){
        if(this.props.onScroll){
            this.props.onScroll(event)
        }
        if(this.props.enableLoadMore&&!this.props.isLoadMoreComplate&&this.state.canUseLoadMore){
            let nativeEvent = event.nativeEvent;
            let status = this.state.status;
            let y0 = nativeEvent.contentInset.top + nativeEvent.contentOffset.y +
                nativeEvent.layoutMeasurement.height-nativeEvent.contentSize.height;
            if (y0 >=-1&&y0<=1) {
                if (!this.props.isLoadMoreComplate) {
                    if(this.state.status===STATUS_INFINITE_IDLE&&!this.props.isLoadingMore){
                        this.onLoadMore();
                    }
                }
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.isLoadingMore===false){
            this.setState({
                status:STATUS_INFINITE_IDLE,
            })
        }
    }
    onLoadMore(){
        this.setState({status:STATUS_INFINITING});
        if(this.props.onLoadMore){
            this.props.onLoadMore();
        }
    }

    onLayout(event){
        let layout = event.nativeEvent.layout;
        this.size={width:layout.width,height:layout.height};
        this.resetView(this.size,this.contentSize);
    }
    onContentSizeChange(width,height){
        this.contentSize={width,height};
        this.resetView(this.size,this.contentSize);
    }
    resetView(size,contentSize){
        if(size&&contentSize){
            let y = size.height-contentSize.height;

            if(y<0){
                    this.setState({
                        canUseLoadMore:true,
                    })

            }else{
                    this.setState({
                        canUseLoadMore: false,
                    })
            }
        }
    }
    renderRefreshControl(){
        if(this.props.enablePull){
            return <RefreshControl
                refreshing={this.props.isPulling}
                onRefresh={this.props.onPull}
                enabled={true}
                tintColor={'#999999'}
                title="重新加载"
                titleColor={'#999999'}
                colors={['#999999']}
                progressBackgroundColor="white"
            />
        }
    }
    render () {
        return (
                <ScrollView
                    {...this.props}
                    ref='scrollView'
                    contentContainerStyle={[styles.contentContainer, this.props.contentContainerStyle]}
                    refreshControl={this.renderRefreshControl()}
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    onScrollEndDrag={()=>true}
                    scrollEventThrottle={2}
                    onScroll={this.onScroll}
                    onContentSizeChange={this.onContentSizeChange}
                    onLayout={this.onLayout}
                >
                    {this.props.children}
                    {this.renderBottomLoadView()}
                </ScrollView>
            
        )
    }
}
let styles = StyleSheet.create({
    contentContainer:{
        backgroundColor:'white',
        minHeight:60
    },
    bottomView:{
        height:DEFAULT_HF_HEIGHT,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        color:'#999999'
    }
});
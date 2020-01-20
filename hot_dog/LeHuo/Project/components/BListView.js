/**
 * Created by user on 16/6/2.
 */

import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Dimensions,
    Platform,
    RefreshControl,
} from 'react-native';
import ASText from '../../Resourse/ASText';
let STATUS_INFINITE_IDLE = 1,
    STATUS_INFINITING = 2,
    STATUS_CANNOT_USE=3;
let DEFAULT_PULL_DISTANCE = 60;//触发下拉刷新的高度
let DEFAULT_HF_HEIGHT = 40;    //触发上拉加载更多的高度
// FIXME: Android has a bug when scrolling ListView the view insertions
// will make it go reverse. Temporary fix - pre-render more rows
const LIST_VIEW_PAGE_SIZE = Platform.OS === 'android' ? 10 : 10;
export default class BListView extends Component {
    static propTypes = {
        enablePull: React.PropTypes.bool,          //是否包含下拉更新
        enableLoadMore: React.PropTypes.bool,      //是否包含加载更多
        isPulling: React.PropTypes.bool,           //是否正在下拉加载
        isLoadingMore:React.PropTypes.bool,        //是否正在加载更多
        isLoadMoreComplate: React.PropTypes.bool,  //加载更多是否完成
        onPull: React.PropTypes.func,
        onLoadMore: React.PropTypes.func,
        isrender:React.PropTypes.bool              //是否需要强制刷新
    };
    static defaultProps = {
        enablePull: false,
        enableLoadMore: false,
        isLoading: false,
        isLoadingMore:false,
        isLoadMoreComplate: false,
        isrender:false,
    };
    size;
    contentSize;
    constructor(props: Props) {
        super(props);
        let dataSource = new ListView.DataSource({
            getRowData: (dataBlob, sid, rid) => dataBlob[sid][rid],
            getSectionHeaderData: (dataBlob, sid) => dataBlob[sid],
            rowHasChanged:(row1, row2) => this.props.isrender?this.props.isrender:row1!== row2,
            sectionHeaderHasChanged: (s1, s2) =>  s1 !== s2,
        });
        this.state = {
            contentHeight: 0,
            dataSource: cloneWithData(dataSource, props.data),
            status: STATUS_INFINITE_IDLE,
            canUseLoadMore:false,
        };
        this.renderFooter = this.renderFooter.bind(this);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);

        this.onScroll = this.onScroll.bind(this);
        this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);
    }
    isfocerRender(){
        return this.props.isrender
    }
    componentWillReceiveProps(nextProps: Props) {
        let ds =cloneWithData(this.state.dataSource, nextProps.data);
        this.setState({
            dataSource: ds,
        });
        if(nextProps.isLoadingMore===false){
            this.setState({
                status:STATUS_INFINITE_IDLE,
            })
        }
    }
    renderLoadWillLoad() {
        return (
            <View style={styles.bottomView}>
                <View>
                    <ASText style={styles.text} text="上拉加载更多" />
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
                        <ASText style={styles.text} text="正在加载..." />
                    </View>
                </View>
            </View>
        )
    }
    renderBottomLoadComplate() {
        let message = (this.contentSize&&this.contentSize.height<=60)?'暂无数据':'--没有更多--';
        if(message==='暂无数据'){
            return (
                <View style={styles.bottomView}>
                    <ASText style={styles.text} text={message} />
                </View>

            )
        }else if(message==='--没有更多--'){
            return (
                <View style={styles.bottomView}>
                    <View>
                        <View>
                            <View>
                                <ASText style={styles.text} text={message} />
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
                    return this.renderLoadWillLoad();
                }
                else if (status === STATUS_INFINITING) {
                    return this.renderBottomLoading();
                }
            }

        }
    }
    render() {
        const {contentInset} = this.props;
        const bottom = contentInset.bottom +
            Math.max(0, this.props.minContentHeight - this.state.contentHeight);
        return (
            <ListView
                initialListSize={1}
                pageSize={LIST_VIEW_PAGE_SIZE}
                ref="listview"

                contentContainerStyle={[styles.contentContainer,this.props.contentContainerStyle]}
                refreshControl={this.renderRefreshControl()}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={()=>true}
                scrollEventThrottle={2}
                onScroll={this.onScroll}
                onContentSizeChange={this.onContentSizeChange}
                onLayout={this.onLayout}

                dataSource={this.state.dataSource}
                renderFooter={this.renderFooter}
                contentInset={{bottom, top: contentInset.top}}
                /*onContentSizeChange={this.onContentSizeChange}*/
                enableEmptySections={true}
                {...this.props}
                style={[styles.mainStyle,this.props.style]}
            />
        );
    }
    onLoadMore(){
        this.setState({status:STATUS_INFINITING});
        if(this.props.onLoadMore){
            this.props.onLoadMore();
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

            if (y0 >=-1&&y0<=1&&y0!=0) {
                if (!this.props.isLoadMoreComplate) {

                    if(this.state.status===STATUS_INFINITE_IDLE&&!this.props.isLoadingMore){
                        console.log('isLoadMoreComplate========',y0,STATUS_INFINITE_IDLE,this.props.isLoadingMore);
                        this.onLoadMore();
                    }
                }
            }
        }
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
    onLayout(event){
        let layout = event.nativeEvent.layout;
        this.size={width:layout.width,height:layout.height};
        this.resetView(this.size,this.contentSize);
    }
    onContentSizeChange(width: number, height: number) {
        if (width !== this.state.contentHeight) {
            this.setState({height});
        }
        this.contentSize={width,height};
        this.resetView(this.size,this.contentSize);
    }

    scrollTo(...args: Array<any>) {
        this.refs.listview.scrollTo(...args);
    }

    getScrollResponder(): any {
        return this.refs.listview.getScrollResponder();
    }

    renderFooter():  ReactElement{
        return this.renderBottomLoadView()
        // if (this.state.dataSource.getRowCount() === 0) {
        //     return this.props.renderEmptyList && this.props.renderEmptyList();
        // }
        // return this.props.renderFooter && this.props.renderFooter();
    }
}

BListView.defaultProps = {
    data: [],
    contentInset: { top: 0, bottom: 0 },
    // TODO: This has to be scrollview height + fake header
    minContentHeight: Dimensions.get('window').height + 20,
    renderSeparator: (sectionID, rowID) => <View style={styles.separator} key={''+rowID+sectionID} />,
};

function cloneWithData(dataSource: ListView.DataSource, data) {
    if (!data) {
        return dataSource.cloneWithRows([]);
    }
    if (Array.isArray(data)) {
        let newData=[];
        return dataSource.cloneWithRows(newData.concat(data));
    }
    let newData ={};
    Object.assign(newData,data);
    return dataSource.cloneWithRowsAndSections(newData);
}

const styles = StyleSheet.create({
    separator: {
        backgroundColor:'#dadada',
        height: 0.5,
        marginLeft:15,
    },
    contentContainer:{
    },
    mainStyle:{
        //backgroundColor:'transparent',
    },
    bottomView:{
        height:DEFAULT_HF_HEIGHT,
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        color:'#999999'
    }
});

/**
 * author：hankeke
 * describe：选择列表组件
 * time：2017-11-8
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ListView,
    Animated,
    Easing,
    Text
} from 'react-native';
import ASTouchableOpacity from './ASTouchableOpacity';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import ASText from './ASText'
export default class SelectBox extends Component {
    static propTypes = {
        shaixuan: React.PropTypes.bool,
        isLogin: React.PropTypes.bool
    };
    static defaultProps={
        shaixuan: false,
        isLogin: false
    };
    constructor(props) {
        super(props);
        this.callback = ''; // 回调方法
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            dataArray: [],
            height: screenHeight * 0.7,
            opacity: new Animated.Value(0),
            bounceValue: new Animated.Value(0)
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.modalVisible !== this.state.modalVisible) {
            return true;
        }
        return false;
    }

    onPresRow(item) {
        this.state.bounceValue.setValue(1.2);
        Animated.sequence([
            Animated.spring( // 基础的单次弹跳物理模型
                this.state.bounceValue, {
                    toValue: 1.2
                }),
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.linear
                },
            )

        ]).start(() => {
            this.setState({
                modalVisible: false,
                dataArray: []
            });
        });
        this.props.callback(item);
    }
    hideModal() {
        this.state.bounceValue.setValue(1.2);
        Animated.sequence([
            Animated.spring( // 基础的单次弹跳物理模型
                this.state.bounceValue, {
                    toValue: 1.2
                }),
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.linear
                },
            )

        ]).start(() => {
            this.setState({
                modalVisible: false,
                dataArray: []
            });
        });
    }

    show(title, dataArray) {
        this.state.bounceValue.setValue(1.2);
        if (dataArray.length < 12) {
            this.setState({
                height: 'auto',
                modalVisible: true,
                dataArray: dataArray
            });
        } else {
            this.setState({
                height: screenHeight * 0.7,
                modalVisible: true,
                dataArray: dataArray
            });
        }

        Animated.sequence([
            Animated.timing(
                this.state.opacity,
                {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear
                },
            ),
            Animated.spring( // 基础的单次弹跳物理模型
                this.state.bounceValue, {
                    toValue: 1
                })
        ]).start();
    }

    renderRow(item) {
        return (
            <ASTouchableOpacity
                onPress={() => {
                    this.onPresRow(item);
                }}
            >
                <View style={styles.renderRow}>
                    <ASText
                        style={styles.textStyle} text={item.title}
                    ></ASText>
                </View>
            </ASTouchableOpacity>
        );
    }

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        return (
            <ASTouchableOpacity
                style={styles.bgView}
                activeOpacity={1}
                onPress={() => {
                    this.hideModal();
                    }}>
                <Animated.View
                    style={[
                        {
                            opacity: this.state.opacity,
                            transform: [{ scale: this.state.bounceValue }] // 缩放
                        }
                    ]}
                >
                    <View style={[styles.listView, { height: this.state.height }]}
                    >
                        <ListView
                            keyboardShouldPersistTaps="always"
                            dataSource={
                                this.state.dataSource.cloneWithRows(this.state.dataArray)
                            } // 设置数据源
                            renderRow={item => this.renderRow(item)}// 返回cell
                            enableEmptySections
                        />
                    </View>
                </Animated.View>
            </ASTouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: screenWidth,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    listView: {
        width: screenWidth * 0.86,
        borderRadius: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    renderRow: {
        width: screenWidth * 0.85,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ededed'

    },
    textStyle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 12
    }
});

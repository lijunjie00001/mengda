/**
 * Created by cjh on 2018/5/18.
 * 封装text组件
 */

import React, { Component } from 'react';
import { Text,Platform } from 'react-native';

export default class ASText extends Component {
    static propTypes = {
        text: React.PropTypes.string,
        numberOfLines: React.PropTypes.number,
        onPress: React.PropTypes.func,
        onLongPress: React.PropTypes.func,
        selectable: React.PropTypes.func,
        onLayout: React.PropTypes.func
    };
    static defaultProps = {
        text: '',
        numberOfLines: 0
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    setNativeProps(nativeProps) {
        this.root.setNativeProps(nativeProps);
    }

    render() {
        return (
            <Text
                ref={(component) => {
                    this.root = component;
                }}
                {...this.props}
                allowFontScaling={false}
                numberOfLines={this.props.numberOfLines}
                style={[this.props.style,Platform.OS === 'android'?{fontFamily:'fontPingguo'}:{fontFamily:'PingFang HK'}]}
                onPress={this.props.onPress}
                onLongPress={this.props.onLongPress}
                selectable={this.props.selectable}
                onLayout={this.props.onLayout}
            >
                {this.props.text}
                {this.props.children}
            </Text>
        );
    }
}


/**
 * Created by cjh on 2018/5/18.
 * 封装text组件
 */

import React, {Component } from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Dimensions,
    Platform,
    RefreshControl,
    Text,
} from 'react-native';

export default class BText extends Component {
    static propTypes = {
        text:React.PropTypes.string,
        numberOfLines:React.PropTypes.number,
        onPress:React.PropTypes.func,
        onLongPress:React.PropTypes.func,
    };
    static defaultProps = {
        text:'',
        numberOfLines:1,
    };

    constructor(props: Props) {
        super(props);
        this.state = {

        };

    }

    render() {
        return (
            <Text
                allowFontScaling={false}
                numberOfLines = {this.props.numberOfLines}
                style = {this.props.style}
                onPress={this.props.onPress}
                onLongPress = {this.props.onLongPress}
            >
                {this.props.text}
            </Text>
        );
    }
}

const styles = StyleSheet.create({

});


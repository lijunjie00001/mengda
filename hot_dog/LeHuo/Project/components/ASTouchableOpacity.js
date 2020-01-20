/**
 * Created by 汪婷婷 on 2018/6/28.
 * TouchableOpacity
 */

import React, { Component } from 'react';
import {
    TouchableOpacity,
    View
} from 'react-native';

export default class ASTouchableOpacity extends Component {
    static propTypes = {
        style: View.propTypes.style,
        disabled: React.PropTypes.bool,
        onPress: React.PropTypes.func,
        activeOpacity: React.PropTypes.number,
        underlayColor: React.PropTypes.string,
        isDelay: React.PropTypes.bool
    };
    static defaultProps = {
        style: {},
        disabled: false,
        activeOpacity: 0.7,
        underlayColor: '',
        isDelay: false
    };

    constructor(props: Props) {
        super(props);
        this.isPress = true;
    }

    // 组件要被从界面上移除的时候,清除定时器
    componentWillUnmount() {
        this.timeOut && clearTimeout(this.timeOut);
    }

    onClick() {
        if (this.props.onPress == null) return;
        if (!this.isPress) return;
        if (this.props.isDelay) {
            this.isPress = false;
            this.timeOut = setTimeout(()=>{
                this.isPress = true;
                clearTimeout(this.timeOut);
            }, 500);
        }
        this.props.onPress();
    }

    render() {
        return (
            <TouchableOpacity
                style={this.props.style}
                disabled={this.props.disabled}
                activeOpacity={this.props.activeOpacity}
                underlayColor={this.props.underlayColor}
                onPress={()=>{this.onClick()}}>
                {this.props.children}
            </TouchableOpacity>
        );
    }
}



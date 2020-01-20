import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Platform,
} from 'react-native';
import containers from '../containers/containers'
@containers()
export default class test extends Component {
    static propTypes = {

    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);

    }
    componentDidMount(){
        this.props.setContainer(this,{
            title:this.props.title,
        });
    }

    render() {
        return (
            <View style={styles.container}>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'

    }
})

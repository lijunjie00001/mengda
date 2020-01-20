import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    Dimensions,
} from 'react-native';
import containers from '../containers/containers'
let WEBVIEW_REF = 'webview';
@containers()
export default class HTMLPage extends Component {
    static propTypes = {
        webUrl:React.PropTypes.string,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);

    }
    componentDidMount() {
        this.props.setContainer(this, {
            title: '天气',
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{uri:this.props.webUrl}}
                    style={styles.webView}
                    scalesPageToFit={true}
                    startInLoadingState={true}
                    automaticallyAdjustContentInsets={true}
                    ref={WEBVIEW_REF}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'

    },
    webView:{
       flex:1
    },
});

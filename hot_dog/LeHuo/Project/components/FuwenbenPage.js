import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    Dimensions,
    ScrollView
} from 'react-native';
import containers from '../containers/containers'
import colors from '../../Resourse/Colors'
import BImage from '../components/BImage'
import NewHTMLView from "react-native-render-html";
import {width} from "../../Resourse/CommonUIStyle";
@containers()
export default class FuwenbenPage extends Component {
    static propTypes = {
        H5:React.PropTypes.string,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);

    }
    componentDidMount() {
        this.props.setContainer(this, {
            title: '活动',
        });
    }
    render() {
        return (
            <View style={{paddingVertical:16,backgroundColor:colors.WHITE,marginTop:10,paddingHorizontal:10}}>
                <ScrollView>
                    <NewHTMLView
                        html={this.props.H5}
                        renderers={{
                            img: (htmlAttribs, children, style, passProps) => {
                                const { src, height } = htmlAttribs;
                                const imageHeight = height || 200;
                                let isResize=src.endsWith('.gif')?false:true
                                return (
                                    <BImage
                                        style={{ width: width-20, height: parseInt(imageHeight) }}
                                        source={{ uri: src }}
                                        isResize={isResize}
                                        imageWidth={width-20}
                                    />
                                );
                            }
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}

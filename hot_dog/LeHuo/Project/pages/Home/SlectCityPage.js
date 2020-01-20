import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SectionList,
    Text, Alert
} from 'react-native';
import containers from '../../containers/containers'
import Colors     from '../../../Resourse/Colors'
import pinyin from 'pinyin';
const data=require('../../../Resourse/areaData.min')
import ASTouchableOpacity from '../../components/ASTouchableOpacity'
@containers()
export default class SlectCityPage extends Component {
    static propTypes = {
        webUrl:React.PropTypes.string,
    };
    static defaultProps = {
    };
    constructor (props) {
        super (props);
        this.state={
            data:this.getAllCity(),
        }

    }

    /**
     *@desc   获取所有城市
     *@author 张羽
     *@date   2019-09-07 09:49
     *@param
     */
    getAllCity(){
        let array=[]
        for(let obj of data){
            let newarray=obj.citys
            array=array.concat(newarray)
        }
        let sections = [], letterArr = [];

        // 右侧字母栏数据处理
        array.map((item, index) => {
            letterArr.push(pinyin(item.name.substring(0, 1), {
                style: pinyin.STYLE_FIRST_LETTER,
            })[0][0].toUpperCase());

            letterArr = [...new Set(letterArr)].sort();
        });
        // 分组数据处理
        letterArr.map((item, index) => {
            sections.push({
                title: item,
                data: []
            })
        });

        array.map(item => {
            let listItem = item;
            sections.map(item => {
                let first = listItem.name.substring(0, 1);
                let test = pinyin(first, {style: pinyin.STYLE_FIRST_LETTER})[0][0].toUpperCase();
                if (item.title == test) {
                    item.data.push({firstName: first, name: listItem.name});
                }
            })
        });
        return sections
    }
    componentDidMount() {
        this.props.setContainer(this, {
            title: '选择城市',
        });

    }
    // 分组列表的renderItem
    _renderItem(item, index) {
        return (
                <ASTouchableOpacity onPress={()=>{
                    Alert.alert('提示','该城市暂未开通',[{text:'确定',style:'cancel'}]);
                    return
                }}
                    style={{backgroundColor: 'white',padding:10,borderBottomWidth:Colors.width_1_PixelRatio,borderBottomColor:Colors.LINE}}>
                    <Text style={{fontSize:14,color:'#3d3d3d'}}>{item.name}</Text>
                </ASTouchableOpacity>
        );
    }
    // 分组列表的头部
    _renderSectionHeader(sectionItem) {
        const {section} = sectionItem;
        return (
            <View style={{backgroundColor:Colors.BackPage,padding:10}}>
                <Text style={{fontSize:14,color:'#3d3d3d'}}>{section.title.toUpperCase()}</Text>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    ref="_sectionList"
                    renderItem={({item, index}) => this._renderItem(item, index)}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={() => <View></View>}
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

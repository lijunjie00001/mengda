
import React, { Component } from 'react'
import Swiper from 'react-native-swiper'
export default class NewSwiper extends Component {
    constructor(props){
        super(props)
    }
    render () {
        return (
                <Swiper
                    {...this.props}
                >
                    {this.props.children}
                </Swiper>
        )
    }
}

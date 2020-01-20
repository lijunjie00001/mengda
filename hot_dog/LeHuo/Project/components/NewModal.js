import React, { Component } from 'react'
import {
  Modal
} from 'react-native'
export default class NewModal extends Component {
    render () {
        return (
            <Modal {...this.props} visible={this.props.isShowMore}>
                {this.props.children}
            </Modal>
        )
    }
}

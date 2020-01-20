
import React, { Component } from 'react';
var uuid = require('uuid');
export default ()=> (Comp) => class extends Component{
    constructor (props,context) {
        super(props,context);
        this.pageId = props.pageId?props.pageId:uuid.v4();
    }
    render () {
        return (
            <Comp {...this.props} pageId={this.pageId}/>
    )
    }
}
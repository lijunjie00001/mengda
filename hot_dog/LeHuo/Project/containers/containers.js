import React,{Component} from 'react'
import { connect } from 'react-redux'
import BaseContainers from './baseContainers'
export default (mapStateToProps, mapDispatchToProps, mergeProps)=> (Comp) =>{
    return connect(mapStateToProps, mapDispatchToProps, mergeProps)(BaseContainers()(Comp))
}
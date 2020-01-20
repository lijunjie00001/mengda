import React, { Component } from 'react';
import {connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import {
    createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import Router from './Router'
class RootRouter extends Component {

    render() {
        const addListener = createReduxBoundAddListener("root");
        return (
            <Router
                navigation={addNavigationHelpers({
                   dispatch: this.props.dispatch,
                   state: this.props.nav,
                    addListener,
                })}
            />
        );
    }
}
const mapStateToProps = state => ({
    nav: state.nav,
});
export default connect(mapStateToProps)(RootRouter)

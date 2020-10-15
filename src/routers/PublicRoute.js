import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from '@reach/router';

export const PublicRoute = ({
    isAuthenticated,
    component: Component,
    ...rest
}) => (
    isAuthenticated
        ? <Redirect to="/dashboard" noThrow />
        : <Component {...rest} />
);

const mapStateToProps = state => ({
    isAuthenticated: !!state.auth.user
});

export default connect(mapStateToProps)(PublicRoute);

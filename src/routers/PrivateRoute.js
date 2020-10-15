import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from '@reach/router';
import Header from '../components/common/Header/Header';

export const PrivateRoute = ({
    isAuthenticated,
    component: Component,
    ...rest,
}) => (
    isAuthenticated ? (
        <div>
            <Header />
            <Component {...rest} />
        </div>
    ) : (
        <Redirect to="/" noThrow />
    )
);

const mapStateToProps = ({auth}) => ({
    isAuthenticated: !!auth.user
});

export default connect(mapStateToProps)(PrivateRoute);

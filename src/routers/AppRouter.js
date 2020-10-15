import React from 'react';
import {Router} from '@reach/router';
import createHistory from 'history/createBrowserHistory';
import {ToastContainer} from 'react-toastify';
import LoginPage from 'comp/Account/LoginPage';
import DashboardPage from 'comp/DashboardPage';
import Game from 'comp/Game';
import NotFoundPage from 'comp/common/NotFoundPage';
import SpaceBackground from 'comp/common/SpaceBackground';
import CreateAccountPage from 'comp/Account/CreateAccountPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import css from './style.css';

export const history = createHistory();

const AppRouter = () => (
    <>
        <SpaceBackground />
        <div className={css.wrapper}>
            <Router history={history}>
                <PublicRoute path="/" component={LoginPage} />
                <PublicRoute path="/create" component={CreateAccountPage} />
                <PrivateRoute path="/dashboard" component={DashboardPage} />
                <PrivateRoute path="/game/:id" component={Game} />

                <NotFoundPage default />
            </Router>
            <ToastContainer />
        </div>
    </>
);

export default AppRouter;

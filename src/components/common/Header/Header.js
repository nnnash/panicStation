import React from 'react';
import {Link} from '@reach/router';
import {connect} from 'react-redux';
import {startLogout} from '../../../actions/auth';

import css from './style.css';

export const Header = ({startLogout}) => (
    <header className={css.header}>
        <div className={css.content}>
            <div className={css.contentLeft}>
                <Link className={css.title} to="/dashboard">
                    <h1>Panic Station</h1>
                </Link>
            </div>

            <button className="button button--link" onClick={startLogout}>
                Logout
            </button>
        </div>
    </header>
);

export default connect(null, {startLogout})(Header);

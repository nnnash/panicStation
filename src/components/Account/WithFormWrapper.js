import React from 'react';
import {Link} from '@reach/router';
import css from './style.css';

const props = {
    email: '',
    username: '',
    password: '',
    room: ''
};

const WithFormWrapper = ({title, link, href}) => Comp => () => (
    <div className={css.wrapper}>
        <div className={css.block}>
            <h1 className={css.title}>{title}</h1>
            <Comp {...props} />
            <div className={css.loginOption}>
                <Link to={href}>{link}</Link>
            </div>
        </div>
    </div>
);

export default WithFormWrapper;

import React from 'react';
import {Link} from '@reach/router';

const NotFoundPage = () => (
    <div>
        <p>404 not found</p>
        <Link to="/">Home</Link>
    </div>
);

export default NotFoundPage;

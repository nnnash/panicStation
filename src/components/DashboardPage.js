import React from 'react';
import { Link } from '@reach/router';
import uuid from 'uuid';

const DashboardPage = ({onCreateGameClick}) => (
    <div>
        <h1 className="dashboard__form__greetings">
            Welcome to the Panic Station game!
        </h1>
        <Link to={`/game/${uuid.v4()}`}>
            <button className="dashboard__form__button" onClick={onCreateGameClick}>
                Create game
            </button>
        </Link>
    </div>
);

export default DashboardPage;

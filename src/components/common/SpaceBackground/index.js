import React from 'react';
import css from './style.css';

const SpaceBackground = () => (
    <div className={css.wrapper}>
        {
            [1, 2, 3].map(ind =>
                Array.from(Array(4 - ind)).map((_, i) => (
                    <div key={`${ind}-${i}`} className={css[`stars${ind}`]} />
                ))
            )
        }
    </div>
);

export default SpaceBackground;

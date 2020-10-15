import React from 'react';
import cn from 'classnames';

import css from './style.css';

const InputFeedback = ({error}) =>
    error ? <div className={css.inputFeedback}>{error}</div> : null;

const Label = ({error, className, children, ...props}) => (
    <label className={css.label} {...props}>
        {children}
    </label>
);

const TextInput = ({
    type,
    id,
    label,
    error,
    value,
    onChange,
    className,
    ...props
}) => {
    const classes = cn(
        css.inputGroup,
        error && css.error,
        className,
    );

    return (
        <div className={classes}>
            <Label htmlFor={id} error={error}>
                {label}
            </Label>
            <input
                id={id}
                className={css.textInput}
                type={type}
                value={value}
                onChange={onChange}
                {...props}
            />
            <InputFeedback error={error} />
        </div>
    );
};

export default TextInput;

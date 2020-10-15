import React from 'react';
import {connect} from 'react-redux';
import {withFormik} from 'formik';
import Yup from 'yup';

import {createAccount} from '~/actions/auth';

import TextInput from './TextInput';
import css from './style.css';

const formikEnhancer = withFormik({
    validationSchema: Yup.object()
        .shape({
            email: Yup.string()
                .email('This is not a valid email !')
                .required('Room Name is required!'),
            username: Yup.string()
                .min(2, 'C\'mon, your name is longer than that')
                .required('username is required.'),
            password: Yup.string()
                .min(2, 'C\'mon, your password can not be that short')
                .required('Password is required.')
        }),

    mapPropsToValues: ({user}) => ({
        ...user
    }),
    handleSubmit: (payload, formikBag) => {
        formikBag.props.createAccount({
            email: payload.email,
            password: payload.password,
            username: payload.username
        });
        formikBag.setSubmitting(false);
    },
    displayName: 'MyForm'
});

const MyForm = props => {
    const {
        values,
        touched,
        errors,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                id="email"
                type="email"
                label="E-mail"
                placeholder="ex: drwho@universe.com"
                error={touched.email && errors.email}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="username"
                type="text"
                label="Username"
                placeholder="ex: Doctor Who"
                error={touched.username && errors.username}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <TextInput
                id="password"
                type="password"
                label="Password"
                placeholder="ex: Geronimo11th"
                error={touched.password && errors.password}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <div className={css.buttonWrapper}>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                >
                    Reset
                </button>
                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </div>
        </form>
    );
};

const mapDispatchToProps = dispatch => ({
    createAccount: credentials => dispatch(createAccount(credentials))
});

export default connect(undefined, mapDispatchToProps)(formikEnhancer(MyForm));

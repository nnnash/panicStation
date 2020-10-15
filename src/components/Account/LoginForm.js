import React from 'react';
import {connect} from 'react-redux';
import {withFormik} from 'formik';
import Yup from 'yup';

import {login} from '~/actions/auth';

import TextInput from './TextInput';
import css from './style.css';

const formikEnhancer = withFormik({
    validationSchema: Yup.object()
        .shape({
            username: Yup.string()
                .min(3, 'Login is not long enough')
                .required('Room Name is required!'),
            password: Yup.string()
                .min(2, 'C\'mon, your password can not be that short')
                .required('Password is required.')
        }),

    mapPropsToValues: ({user}) => ({
        ...user
    }),
    handleSubmit: (
        payload,
        formikBag
    ) => {
        formikBag.props.login({
            username: payload.username,
            password: payload.password
        });
        formikBag.setSubmitting(false);
    },
    displayName: 'MyForm'
});

export const MyForm = ({
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    loginError,
}) => (
    <form onSubmit={handleSubmit}>
        {loginError && <p className={css.loginError}>Sorry, we cannot find this user...</p>}
        <TextInput
            id="username"
            type="username"
            label="Login"
            error={touched.username && errors.username}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
        />
        <TextInput
            id="password"
            type="password"
            label="Password"
            error={touched.password && errors.password}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
        />
        <div className={css.buttonWrapper}>
            <button
                type="button"
                className="outline"
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

const mapStateToProps = ({auth}) => ({
    loginError: auth.hasErrored
});

const mapDispatchToProps = dispatch => ({
    login: credentials => dispatch(login(credentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(formikEnhancer(MyForm));

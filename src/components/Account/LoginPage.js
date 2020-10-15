import LoginForm from './LoginForm';
import WithFormWrapper from './WithFormWrapper';

// const LoginPage = ({loginError}) => (
//     <div className="centered-form__form">
//         <h1 className="login-title">Login</h1>
//         {loginError && <p className="login-error">Sorry, we cannot find this user...</p>}
//         <LoginForm user={{username: '', password: ''}} />
//         <div className="login-option">
//             <Link to="/create">need an account?</Link>
//         </div>
//     </div>
// );
//
// const mapStateToProps = ({auth}) => ({
//     loginError: auth.hasErrored
// });
//
// export default connect(mapStateToProps)(LoginPage);

export default WithFormWrapper({
    title: 'Login',
    link: 'Need an account?',
    href: '/create',
})(LoginForm);

import WithFormWrapper from './WithFormWrapper';
import CreateAccountForm from './CreateAccountForm';

export default WithFormWrapper({
    title: 'Sign up',
    link: 'I already have an account',
    href: '/',
})(CreateAccountForm);

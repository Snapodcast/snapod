import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import login from '../../../services/login';
import Store from '../../../lib/Store';
import { useI18n } from '../../../hooks';
import Icons from '../../../components/Icons';
import { LanguagesDropdown } from '../../../components/Dropdown';

export default function Login() {
  const { t } = useI18n();
  // route navigation hook
  const history = useHistory();

  // show/hide password
  const [showPwd, setShowPwd] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);

  // login info states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginLoading, setLoading] = React.useState(false);

  // info validation states
  const [validEmail, setEmailValidity] = React.useState(true);
  const [validPwd, setPwdValidity] = React.useState(true);

  // input validation event handler
  const checkValidity = (checkingEmail: boolean) => {
    // email
    if (checkingEmail) {
      setEmailValidity(email.indexOf('@') > -1);
    } else {
      setPwdValidity(password.length >= 6 && password.length <= 20);
    }
  };

  // login event handler
  const doLogin = async () => {
    // validate email and password again
    checkValidity(true);
    checkValidity(false);

    // continue if both email and password are valid
    if (validEmail && validPwd) {
      setLoading(true);
      await login(email, password)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            // store current user data
            Store.set('currentUser.name', res.info.name);
            Store.set('currentUser.token', res.token);
            Store.set('currentUser.cuid', res.info.cuid);
            Store.set('currentUser.email', res.info.email);
            Store.set('currentUser.type', res.info.type);
            setShowAnimation(true);
            setTimeout(() => {
              // navigate to start page
              history.push('/landing/start');
            }, 500);
          } else {
            alert(`${t('errorLoggingIn')}\n${res.message}`);
            setLoading(false);
          }
        })
        .catch(() => {
          alert(t('serviceUnavailable'));
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div
        className={`z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-10 pb-11 no-drag ${
          showAnimation && 'animate-slideDown'
        }`}
      >
        <div className="mb-5">
          <h1 className="font-bold text-3xl tracking-wide">
            <span role="img" aria-label="snapod-logo" className="mr-0.5">
              🎙️
            </span>
            Snapod
          </h1>
          <p className="text-gray-400 text-sm ml-1 mt-1">
            {t('loginToContinue')}
          </p>
        </div>
        <div className="w-full">
          <p className="w-full">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
              {t('email')}
            </em>
            <input
              type="email"
              placeholder="your@email.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyUp={() => checkValidity(true)}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            {!validEmail && (
              <span className="text-xs text-gray-400 ml-1 mt-1">
                {t('invalidEmail')}
              </span>
            )}
          </p>
          <p className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                {t('password')}
              </em>
              <em className="text-xs font-medium text-gray-500 not-italic flex-1 text-right hover:text-gray-600 mr-1">
                <Link to="/landing/forgot/request">{t('forgotPassword')}</Link>
              </em>
            </span>
            <span className="grid grid-cols-7 gap-x-1.5 mt-1">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••••••"
                maxLength={20}
                minLength={6}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyUp={(e) => {
                  checkValidity(false);
                  if (e.key === 'Enter') {
                    doLogin();
                  }
                }}
                className="col-start-1 col-end-7 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
              />
              <button
                className="hover:border-gray-400 border rounded-md col-start-7 col-end-8 flex justify-center items-center align-middle"
                onClick={() => setShowPwd(!showPwd)}
                type="button"
              >
                <span className="w-5 h-5 text-gray-500">
                  {showPwd ? <Icons name="eye-off" /> : <Icons name="eye" />}
                </span>
              </button>
            </span>
            {!validPwd && (
              <span className="text-xs text-gray-400 ml-1 mt-1">
                {t('invalidPassword')}
              </span>
            )}
          </p>
        </div>
        <div className="w-full mt-8 text-center">
          <button
            onClick={() => doLogin()}
            type="submit"
            aria-label="login"
            className="flex justify-center align-middle items-center mb-3 text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md w-full py-2 text-center"
          >
            {loginLoading ? (
              <span className="h-5 w-5 duration-200">
                <Icons name="spinner" />
              </span>
            ) : (
              `${t('login')} →`
            )}
          </button>
          <Link to="/landing/signup" className="text-sm text-gray-400">
            {t('noAccountSignUp')}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-10 flex justify-center w-full animate-firstShow">
        <LanguagesDropdown />
      </div>
    </>
  );
}

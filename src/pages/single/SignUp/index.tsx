import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icons from '../../../components/Icons';
import { useI18n } from '../../../hooks';
import Store from '../../../lib/Store';
import signup from '../../../services/signup';

export default function SignUp() {
  const { t } = useI18n();
  // route navigation hook
  const history = useHistory();

  // show/hide password
  const [showPwd, setShowPwd] = React.useState(false);

  // signup info states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [signupLoading, setLoading] = React.useState(false);

  // info validation states
  const [validEmail, setEmailValidity] = React.useState(true);
  const [validPwd, setPwdValidity] = React.useState(true);
  const [validName, setNameValidity] = React.useState(true);

  // input validation event handler
  const checkValidity = (checkingEmail: boolean, checkingName: boolean) => {
    // email
    if (checkingEmail) {
      setEmailValidity(email.indexOf('@') > -1);
    } else if (checkingName) {
      setNameValidity(name.length >= 1 && name.length <= 30);
    } else {
      setPwdValidity(password.length >= 6 && password.length <= 20);
    }
  };

  // signup event handler
  const doSignUp = async () => {
    if (validEmail && validName && validPwd) {
      setLoading(true);
      await signup(name, email, password)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            // store current user data
            Store.set('currentUser.token', res.token);
            Store.set('currentUser.name', res.info.name);
            Store.set('currentUser.cuid', res.info.cuid);
            Store.set('currentUser.email', res.info.email);
            Store.set('currentUser.type', res.info.type);
            // navigate to start page
            history.push('/landing/start');
          } else {
            alert(`${t('errorSigningUp')}\n${res.message}`);
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
    <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-10 pb-11 no-drag">
      <div className="mb-5">
        <h1 className="font-bold text-3xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🎉
          </span>
          Signup
        </h1>
        <p className="text-gray-400 text-sm ml-1 mt-1">
          {t('createYourAccount')}
        </p>
      </div>
      <div className="w-full">
        <p className="w-full">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            {t('nickname')}
          </em>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyUp={() => checkValidity(false, true)}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          {!validName && (
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('invalidName')}
            </span>
          )}
        </p>
        <p className="w-full mt-3">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            {t('email')}
          </em>
          <input
            type="email"
            placeholder="your@email.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyUp={() => checkValidity(true, false)}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          {!validEmail && (
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('invalidEmail')}
            </span>
          )}
        </p>
        <p className="w-full mt-3">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            {t('password')}
          </em>
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
                checkValidity(false, false);
                if (e.key === 'Enter') {
                  doSignUp();
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
          onClick={() => doSignUp()}
          type="submit"
          aria-label="login"
          className="flex justify-center align-middle items-center mb-3 text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md w-full py-2 text-center"
        >
          {signupLoading ? (
            <span className="h-5 w-5 duration-200">
              <Icons name="spinner" />
            </span>
          ) : (
            t('signUp')
          )}
        </button>
        <Link to="/landing/login" className="text-sm text-gray-400">
          {t('alreadyHaveAccount')}
        </Link>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icons from '../../../components/Icons';
import login from '../../../services/login';
import * as Store from '../../../lib/Store';

export default function Login() {
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
            alert(`登录失败\nError logging you in\n${res.message}`);
            setLoading(false);
          }
        })
        .catch(() => {
          alert(`Snapod 服务暂时不可用\nService is currently unavailable`);
          setLoading(false);
        });
    }
  };

  return (
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
          登入你的账户以开始使用
        </p>
      </div>
      <div className="w-full">
        <p className="w-full">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            邮箱 / Email
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
              请检查电子邮箱格式
            </span>
          )}
        </p>
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              密码 / Password
            </em>
            <em className="text-xs font-medium text-gray-500 not-italic flex-1 text-right hover:text-gray-600 mr-1">
              <Link to="/landing/forgot/request">忘记密码 / Forgot</Link>
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
              密码长度应在 6 至 20 个字符之间
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
            <span className="h-5 w-5 animate-spin duration-200">
              <Icons name="clock" />
            </span>
          ) : (
            '登入 / Login'
          )}
        </button>
        <Link to="/landing/signup" className="text-sm text-gray-400">
          立即注册 / Sign Up
        </Link>
      </div>
    </div>
  );
}

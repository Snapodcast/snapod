import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icons from '../../../components/Icons';
import { forgotRequest, forgotRecover } from '../../../services/forgot';
import { useInterval } from 'react-use';

export default function Forgot() {
  // route navigation hook
  const history = useHistory();

  // login info states
  const [email, setEmail] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [submitLoading, setSubmitting] = React.useState(false);

  // info validation states
  const [validEmail, setEmailValidity] = React.useState(true);

  // show/hide password
  const [showPwd, setShowPwd] = React.useState(false);

  const [sent, setSent] = React.useState(false);
  const [resendCountDown, setCountDown] = React.useState(60);
  const [resendCooling, setCooling] = React.useState(false);

  // signup info states
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  // info validation states
  const [validPwd, setPwdValidity] = React.useState(true);
  const [validCode, setCodeValidity] = React.useState(true);

  // input validation event handler
  const checkValidity = (checkingCode: boolean, checkingEmail: boolean) => {
    if (checkingCode) {
      setCodeValidity(code.length === 44);
    } else if (checkingEmail) {
      setEmailValidity(email.indexOf('@') > -1);
    } else {
      setPwdValidity(password.length >= 6 && password.length <= 20);
    }
  };

  // signup event handler
  const doRecover = async () => {
    if (validCode && validPwd) {
      setSubmitting(true);
      await forgotRecover(code, password)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            alert('密码重设成功\nPassword has been updated');
            // navigate to start page
            history.push('/landing/login');
          } else {
            alert(`Error submitting your request\n${res.message}`);
            setSubmitting(false);
          }
        })
        .catch(() => {
          alert('Snapod 服务暂时不可用\nService is currently unavailable');
          setSubmitting(false);
        });
    }
  };

  // count down setInterval
  useInterval(
    () => {
      if (resendCountDown <= 0) {
        setCooling(false);
        setSent(false);
        setCountDown(60);
      }
      setCountDown(resendCountDown - 1);
    },
    resendCooling ? 1000 : null
  );

  // login event handler
  const doSend = async () => {
    if (validEmail) {
      setSending(true);
      await forgotRequest(email)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            alert(
              '秘钥已发送至你的邮箱\nRecovery code has been sent to your email'
            );
            setSending(false);
            setSent(true);
            setCountDown(60);
            setCooling(true);
          } else {
            alert(`提交失败\nError submitting your request\n${res.message}`);
            setSending(false);
          }
        })
        .catch(() => {
          alert(`Snapod 服务暂时不可用\nService is currently unavailable`);
          setSending(false);
        });
    }
  };

  return (
    <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-10 pb-11 no-drag">
      <div className="mb-5">
        <h1 className="font-bold text-3xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🔑
          </span>
          Snapod
        </h1>
        <p className="text-gray-400 text-sm ml-1 mt-1">
          通过电子邮件找回账户密码
        </p>
      </div>
      <div className="w-full">
        <p className="w-full">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            邮箱 / Email
          </em>
          <span className="grid grid-cols-7 gap-x-1.5 mt-1">
            <input
              type="email"
              placeholder="your@email.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyUp={(e) => {
                checkValidity(false, true);
                if (e.key === 'Enter') {
                  if (!sending && !sent && !resendCooling) {
                    doSend();
                  }
                }
              }}
              className="col-start-1 col-end-7 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <button
              className="hover:border-gray-400 border rounded-md col-start-7 col-end-8 flex justify-center items-center align-middle"
              onClick={() => {
                if (!sending && !sent && !resendCooling) {
                  doSend();
                }
              }}
              type="button"
            >
              <span
                className={`${sending ? 'w-4 h-4' : 'w-5 h-5'} ${
                  resendCooling && 'flex items-center justify-center'
                } text-gray-500 text-center`}
              >
                {sent ? (
                  <span className="-translate-y-1">{resendCountDown}</span>
                ) : sending ? (
                  <Icons name="spinner" />
                ) : (
                  <Icons name="plane" />
                )}
              </span>
            </button>
          </span>
          {!validEmail && (
            <span className="text-xs text-gray-400 ml-1 mt-1">
              请检查电子邮箱格式
            </span>
          )}
        </p>
        <p className="w-full mt-3">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            秘钥 / Recovery Code
          </em>
          <input
            type="text"
            placeholder="recovery code"
            onChange={(e) => {
              setCode(e.target.value);
            }}
            onKeyUp={() => checkValidity(true, false)}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          {!validCode && (
            <span className="text-xs text-gray-400 ml-1 mt-1">
              秘钥长度不匹配
            </span>
          )}
        </p>
        <p className="w-full mt-3">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
            新密码 / Password
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
                  doRecover();
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
          onClick={() => doRecover()}
          type="submit"
          aria-label="submit"
          className="flex justify-center align-middle items-center mb-3 text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md w-full py-2 text-center"
        >
          {submitLoading ? (
            <span className="h-5 w-5 duration-200">
              <Icons name="spinner" />
            </span>
          ) : (
            '提交 / Submit'
          )}
        </button>
        <span className="flex justify-center">
          <Link
            to="/landing/login"
            className="text-sm text-gray-400 text-right mr-1"
          >
            账户登录 / Login
          </Link>
        </span>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icons from '../../../components/Icons';
import { forgotRecover } from '../../../services/forgot';

export default function Forgot() {
  // route navigation hook
  const history = useHistory();

  // show/hide password
  const [showPwd, setShowPwd] = React.useState(false);

  // signup info states
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [forgotLoading, setLoading] = React.useState(false);

  // info validation states
  const [validPwd, setPwdValidity] = React.useState(true);
  const [validCode, setCodeValidity] = React.useState(true);

  // input validation event handler
  const checkValidity = (checkingCode: boolean) => {
    if (checkingCode) {
      setCodeValidity(code.length === 44);
    } else {
      setPwdValidity(password.length >= 6 && password.length <= 20);
    }
  };

  // signup event handler
  const doRecover = async () => {
    if (validCode && validPwd) {
      setLoading(true);
      await forgotRecover(code, password)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            alert('密码重设成功\nPassword has been updated');
            // navigate to start page
            history.push('/landing/login');
          } else {
            alert(`Error submitting your request\n${res.message}`);
            setLoading(false);
          }
        })
        .catch(() => {
          alert('Snapod 服务暂时不可用\nService is currently unavailable');
          setLoading(false);
        });
    }
  };

  return (
    <div className="w-full h-full theme-background drag">
      <main className="flex align-middle items-center h-full justify-center">
        <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-10 pb-11 no-drag">
          <div className="mb-5">
            <h1 className="font-bold text-3xl tracking-wide">
              <span role="img" aria-label="snapod-logo" className="mr-0.5">
                🔐
              </span>
              Snapod
            </h1>
            <p className="text-gray-400 text-sm ml-1 mt-1">
              通过秘钥重设账户密码
            </p>
          </div>
          <div className="w-full">
            <p className="w-full">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
                秘钥 / Recovery Code
              </em>
              <input
                type="text"
                placeholder="recovery code"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                onKeyUp={() => checkValidity(true)}
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
                    checkValidity(false);
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
              aria-label="login"
              className="flex justify-center align-middle items-center mb-3 text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md w-full py-2 text-center"
            >
              {forgotLoading ? (
                <span className="h-5 w-5 animate-spin duration-200">
                  <Icons name="clock" />
                </span>
              ) : (
                '提交 / Submit'
              )}
            </button>
            <Link
              to="/landing/forgot/request"
              className="text-sm text-gray-400"
            >
              申请秘钥 / Request Code
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

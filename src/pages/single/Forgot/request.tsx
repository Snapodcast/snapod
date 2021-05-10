import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icons from '../../../components/Icons';
import { forgotRequest } from '../../../services/forgot';

export default function Forgot() {
  // route navigation hook
  const history = useHistory();

  // login info states
  const [email, setEmail] = React.useState('');
  const [forgotLoading, setLoading] = React.useState(false);

  // info validation states
  const [validEmail, setEmailValidity] = React.useState(true);

  // input validation event handler
  const checkValidity = () => {
    setEmailValidity(email.indexOf('@') > -1);
  };

  // login event handler
  const doForgot = async () => {
    if (validEmail) {
      setLoading(true);
      await forgotRequest(email)
        .then(async (response) => {
          const res = await response.json();
          if (res.status) {
            alert(
              '秘钥已发送至你的邮箱\nRecovery code has been sent to your email'
            );
            // navigate to start page
            history.push('/landing/forgot/recover');
          } else {
            alert(`提交失败\nError submitting your request\n${res.message}`);
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
          <input
            type="email"
            placeholder="your@email.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyUp={(e) => {
              checkValidity();
              if (e.key === 'Enter') {
                doForgot();
              }
            }}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          {!validEmail && (
            <span className="text-xs text-gray-400 ml-1 mt-1">
              请检查电子邮箱格式
            </span>
          )}
        </p>
      </div>
      <div className="w-full mt-8 text-center">
        <button
          onClick={() => doForgot()}
          type="submit"
          aria-label="submit"
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
        <span className="grid grid-cols-2">
          <Link
            to="/landing/forgot/recover"
            className="text-sm text-gray-400 text-left ml-1"
          >
            输入秘钥 / Enter Code
          </Link>
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

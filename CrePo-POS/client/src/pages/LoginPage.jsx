import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-200 via-pink-200 to-blue-200 p-4'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lifted'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-primary-text'>
            CrePo-POS
          </h1>
          <p className='mt-2 text-text-secondary'>เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
        </div>

        {isLoading && (
            <div className='flex justify-center items-center p-4'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
            </div>
        )}

        <form onSubmit={submitHandler} className={`space-y-6 ${isLoading ? 'hidden' : 'block'}`}>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-semibold text-text-secondary mb-1'
            >
              ชื่อผู้ใช้
            </label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-4 py-3 text-text-primary bg-white border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition'
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold text-text-secondary mb-1'
            >
              รหัสผ่าน
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-3 text-text-primary bg-white border-2 border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 top-7 hover:text-primary-main'
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div>
            <button
              type='submit'
              className='w-full flex justify-center items-center gap-2 px-4 py-4 font-bold text-white transition-all duration-300 transform bg-primary-dark rounded-xl shadow-lg hover:bg-primary-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main active:scale-95'
              disabled={isLoading}
            >
              <FiLogIn />
              <span>เข้าสู่ระบบ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
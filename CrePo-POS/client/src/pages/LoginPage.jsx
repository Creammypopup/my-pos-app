import React, { useState, useEffect } from 'react'; // <--- เพิ่มบรรทัดนี้
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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

  if (isLoading) {
    return (
        <div className='flex items-center justify-center min-h-screen bg-purple-50'>
            <h1 className='text-2xl text-purple-700'>กำลังโหลด...</h1>
        </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200'>
      <div className='w-full max-w-sm p-10 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-800'>
            CrePo-POS
          </h2>
          <p className='mt-2 text-sm text-gray-500'>เข้าสู่ระบบเพื่อจัดการร้านค้า</p>
        </div>
        <form onSubmit={submitHandler} className='space-y-6'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-semibold text-gray-700'
            >
              ชื่อผู้ใช้
            </label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>
          <div className='relative'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold text-gray-700'
            >
              รหัสผ่าน
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-3 mt-1 text-gray-700 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 top-7 hover:text-purple-600'
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div>
            <button
              type='submit'
              className='w-full px-4 py-3 font-bold text-white transition-transform duration-200 transform bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-95'
              disabled={isLoading}
            >
              {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
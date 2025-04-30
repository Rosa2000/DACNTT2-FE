import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPasswordRequestAsync } from '../../slices';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordRequestAsync({ email }));
  };

  useEffect(() => {
    if (status === 'succeeded' && successMessage) {
      toast.success(successMessage);
      navigate('/auth');
    } else if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error, successMessage, navigate]);

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '10px' }}>
          {status === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
      <button onClick={() => navigate('/auth')} style={{ marginTop: '10px' }}>
        Quay lại đăng nhập
      </button>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, InputGroup } from 'react-bootstrap';

/**
 * AuthModal - Xác thực người dùng (Đăng nhập / Đăng ký / Quên mật khẩu)
 * Thiết kế phong cách Booking.com premium với hiệu ứng glassmorphism
 */
export default function AuthModal({ show, onHide, onLoginSuccess, authService }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: nhập email, 2: nhập mã + mật khẩu mới
  const [showNewPassword, setShowNewPassword] = useState(false);

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegUsername('');
    setRegEmail('');
    setRegFullName('');
    setRegPassword('');
    setRegConfirmPassword('');
    setForgotEmail('');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotStep(1);
    setError('');
    setSuccess('');
    setShowLoginPassword(false);
    setShowRegPassword(false);
    setShowNewPassword(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  // ============ ĐĂNG NHẬP ============
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(loginEmail.trim(), loginPassword);
      if (result.success) {
        setSuccess('Đăng nhập thành công! 🎉');
        setTimeout(() => {
          onLoginSuccess(result.user);
          resetForms();
          onHide();
        }, 800);
      } else {
        setError(result.message || 'Email hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  // ============ ĐĂNG KÝ ============
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regUsername.trim() || !regEmail.trim() || !regFullName.trim() || !regPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường bắt buộc');
      return;
    }

    if (regUsername.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Định dạng email không hợp lệ');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        full_name: regFullName.trim(),
        password: regPassword,
      });

      if (result.success) {
        setSuccess('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ 🎉');
        setTimeout(() => {
          switchTab('login');
          setLoginEmail(regEmail.trim());
        }, 1500);
      } else {
        setError(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // ============ QUÊN MẬT KHẨU - BƯỚC 1: GỬI MÃ ============
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotEmail.trim()) {
      setError('Vui lòng nhập email tài khoản của bạn');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      setError('Định dạng email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.forgotPassword(forgotEmail.trim());
      if (result.success) {
        setSuccess(result.message || 'Mã đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra (hoặc sử dụng mã hiển thị bên dưới).');
        if (result.resetToken) {
          setResetToken(result.resetToken);
        }
        setForgotStep(2);
      } else {
        setError(result.message || 'Không tìm thấy tài khoản với email này');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  // ============ QUÊN MẬT KHẨU - BƯỚC 2: ĐẶT LẠI MẬT KHẨU ============
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resetToken.trim()) {
      setError('Vui lòng nhập mã xác nhận');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.resetPassword(resetToken.trim(), newPassword);
      if (result.success) {
        setSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới 🎉');
        setTimeout(() => {
          switchTab('login');
          setForgotStep(1);
          setForgotEmail('');
          setResetToken('');
          setNewPassword('');
          setConfirmNewPassword('');
        }, 2000);
      } else {
        setError(result.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForms();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="auth-modal">
      <Modal.Body className="p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
        {/* Header gradient */}
        <div className="auth-modal-header text-center text-white py-4 px-4">
          <div className="mb-2">
            <i className="bi bi-book-half" style={{ fontSize: '2.2rem', color: '#febb02' }}></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
            NovelBooking<span style={{ color: '#febb02' }}>.vn</span>
          </h4>
          <p className="small mb-0 opacity-75">
            {activeTab === 'login' && 'Đăng nhập để trải nghiệm đầy đủ tính năng'}
            {activeTab === 'register' && 'Tạo tài khoản mới miễn phí'}
            {activeTab === 'forgot' && 'Khôi phục mật khẩu tài khoản'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="d-flex border-bottom bg-white">
          <button
            className={`auth-tab-btn flex-fill py-2 ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
          </button>
          <button
            className={`auth-tab-btn flex-fill py-2 ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            <i className="bi bi-person-plus me-1"></i> Đăng ký
          </button>
          <button
            className={`auth-tab-btn flex-fill py-2 ${activeTab === 'forgot' ? 'active' : ''}`}
            onClick={() => switchTab('forgot')}
          >
            <i className="bi bi-key me-1"></i> Quên mật khẩu
          </button>
        </div>

        {/* Form area */}
        <div className="p-4 bg-white">
          {/* Alerts */}
          {error && (
            <Alert variant="danger" className="py-2 small d-flex align-items-center gap-2" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i> {success}
            </Alert>
          )}

          {/* ========= FORM ĐĂNG NHẬP ========= */}
          {activeTab === 'login' && (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-envelope me-1 text-primary"></i> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email đã đăng ký..."
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="auth-input"
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-lock me-1 text-primary"></i> Mật khẩu
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="auth-input"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    tabIndex={-1}
                  >
                    <i className={`bi ${showLoginPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label={<span className="small text-muted">Ghi nhớ đăng nhập</span>}
                />
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={() => switchTab('forgot')}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                className="w-100 fw-bold py-2 auth-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <><Spinner size="sm" className="me-2" /> Đang xử lý...</>
                ) : (
                  <><i className="bi bi-box-arrow-in-right me-2"></i> Đăng nhập</>
                )}
              </Button>

              <div className="text-center mt-3">
                <span className="small text-muted">Chưa có tài khoản? </span>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                  onClick={() => switchTab('register')}
                >
                  Đăng ký ngay
                </button>
              </div>
            </Form>
          )}

          {/* ========= FORM ĐĂNG KÝ ========= */}
          {activeTab === 'register' && (
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-person me-1 text-primary"></i> Tên đăng nhập <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: nguyenvana"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="auth-input"
                  autoFocus
                />
                <Form.Text className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Tối thiểu 3 ký tự, không có khoảng trắng
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-envelope me-1 text-primary"></i> Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ví dụ: nguyenvana@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="auth-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-person-badge me-1 text-primary"></i> Họ và tên <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="auth-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-lock me-1 text-primary"></i> Mật khẩu <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="auth-input"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    tabIndex={-1}
                  >
                    <i className={`bi ${showRegPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-dark">
                  <i className="bi bi-lock-fill me-1 text-primary"></i> Xác nhận mật khẩu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập lại mật khẩu..."
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="auth-input"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 fw-bold py-2 auth-btn-success"
                disabled={loading}
              >
                {loading ? (
                  <><Spinner size="sm" className="me-2" /> Đang xử lý...</>
                ) : (
                  <><i className="bi bi-person-plus me-2"></i> Tạo tài khoản</>
                )}
              </Button>

              <div className="text-center mt-3">
                <span className="small text-muted">Đã có tài khoản? </span>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                  onClick={() => switchTab('login')}
                >
                  Đăng nhập
                </button>
              </div>
            </Form>
          )}

          {/* ========= FORM QUÊN MẬT KHẨU ========= */}
          {activeTab === 'forgot' && (
            <>
              {forgotStep === 1 && (
                <Form onSubmit={handleForgotSubmit}>
                  <div className="text-center mb-3">
                    <div className="auth-forgot-icon mb-2">
                      <i className="bi bi-shield-lock" style={{ fontSize: '2.5rem', color: 'var(--bkg-blue)' }}></i>
                    </div>
                    <p className="small text-muted mb-0">
                      Nhập email tài khoản của bạn, hệ thống sẽ gửi mã xác nhận để đặt lại mật khẩu.
                    </p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">
                      <i className="bi bi-envelope me-1 text-primary"></i> Email tài khoản
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email đã đăng ký..."
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="auth-input"
                      autoFocus
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-bold py-2 auth-btn-warning"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Spinner size="sm" className="me-2" /> Đang gửi mã...</>
                    ) : (
                      <><i className="bi bi-send me-2"></i> Gửi mã xác nhận</>
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() => switchTab('login')}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Quay lại đăng nhập
                    </button>
                  </div>
                </Form>
              )}

              {forgotStep === 2 && (
                <Form onSubmit={handleResetPassword}>
                  <div className="text-center mb-3">
                    <div className="auth-forgot-icon mb-2">
                      <i className="bi bi-key-fill" style={{ fontSize: '2.5rem', color: 'var(--bkg-yellow)' }}></i>
                    </div>
                    <p className="small text-muted mb-0">
                      Nhập mã xác nhận và mật khẩu mới để đặt lại.
                    </p>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">
                      <i className="bi bi-hash me-1 text-warning"></i> Mã xác nhận
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập mã xác nhận..."
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="auth-input"
                      autoFocus
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">
                      <i className="bi bi-lock me-1 text-primary"></i> Mật khẩu mới
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Tối thiểu 6 ký tự"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="auth-input"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-dark">
                      <i className="bi bi-lock-fill me-1 text-primary"></i> Xác nhận mật khẩu mới
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="auth-input"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 fw-bold py-2 auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Spinner size="sm" className="me-2" /> Đang đặt lại...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2"></i> Đặt lại mật khẩu</>
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                      onClick={() => { setForgotStep(1); setError(''); setSuccess(''); }}
                    >
                      <i className="bi bi-arrow-left me-1"></i> Gửi lại mã mới
                    </button>
                  </div>
                </Form>
              )}
            </>
          )}
        </div>

        {/* Footer notice */}
        <div className="text-center py-3 px-4 bg-light border-top">
          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-shield-check me-1"></i>
            Bảo mật bởi JWT HttpOnly Cookie · Mật khẩu mã hóa bcrypt
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
}

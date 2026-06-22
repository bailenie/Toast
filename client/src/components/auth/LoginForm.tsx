import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsBanned(false);

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate('/home');
      } else {
        const resData = res as unknown as Record<string, unknown>;
        if (resData.isBanned) {
          setIsBanned(true);
        }
        setError(res.message || '登录失败');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; isBanned?: boolean } } };
      if (axiosErr.response?.data?.isBanned) {
        setIsBanned(true);
      }
      setError(axiosErr.response?.data?.message || '认证失败：密码过短或网络超时');
    } finally {
      setLoading(false);
    }
  };

  // 封禁提示页
  if (isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] bg-danger-bg rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-120px] left-[-120px] w-[500px] h-[500px] bg-accent-bg-2 rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-danger-bg rounded-full opacity-30 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-accent-bg-2 rounded-full opacity-30 blur-3xl pointer-events-none z-0" />

        <div className="w-full max-w-sm relative z-10 text-center">
          <div className="bg-bg-card rounded-3xl p-8 cute-shadow-lg">
            <div className="text-6xl mb-4 select-none">🧊🐠</div>
            <h1 className="font-display font-black text-xl text-ink mb-3">
              你已被管理员关进【冷冻鱼缸】！
            </h1>
            <p className="font-bold text-xs text-gray-500 mb-6 leading-relaxed">
              你的账号因违规行为已被暂时冻结，如有疑问请联系管理员申诉解冻。
            </p>
            <button
              onClick={() => { setIsBanned(false); setError(''); }}
              className="bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-6 py-2.5 transition-all active:translate-y-0.5"
            >
              返回登录界
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* 装饰光斑 — 四角覆盖，保证左右也有渐变 */}
      <div className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] bg-accent-bg rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[500px] h-[500px] bg-accent-bg-2 rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-accent-bg rounded-full opacity-30 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-accent-bg-2 rounded-full opacity-30 blur-3xl pointer-events-none z-0" />

      <div className="w-full max-w-sm relative z-10">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="font-display font-black text-2xl text-ink">
            打卡考勤登录
          </h1>
          <p className="font-display font-bold text-xs text-gray-500 mt-1">
            工号验证 · 开始今日摸鱼
          </p>
        </div>

        {/* 表单卡片 */}
        <form
          onSubmit={handleSubmit}
          className="bg-bg-card rounded-3xl p-6 cute-shadow-lg"
        >
          {/* 错误提示 */}
          {error && (
            <div className="bg-danger-bg border-2 border-ink rounded-xl px-3 py-2 mb-4 flex items-start gap-2">
              <span className="text-sm select-none">⚠️</span>
              <span className="font-bold text-xs text-red-600">{error}</span>
            </div>
          )}

          {/* 邮箱 */}
          <div className="mb-3">
            <label className="font-display font-bold text-xs text-ink block mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@yourco.com"
              required
              className="w-full bg-bg-page border-2 border-ink rounded-xl px-3 py-2 font-bold text-xs text-ink placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          {/* 密码 */}
          <div className="mb-5">
            <label className="font-display font-bold text-xs text-ink block mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full bg-bg-page border-2 border-ink rounded-xl px-3 py-2 font-bold text-xs text-ink placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5"
          >
            {loading ? '飞速处理中...' : '打卡下海摸鱼 🌊'}
          </button>
        </form>

        {/* 切换链接 */}
        <p className="text-center mt-4 font-bold text-xs text-gray-500">
          没有注册过工号？{' '}
          <Link to="/register" className="text-accent font-black hover:underline">
            注册一个带薪化身账号
          </Link>
        </p>
      </div>
    </div>
  );
}

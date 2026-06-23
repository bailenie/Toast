import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { AVATARS } from '../../avatars';

export default function RegisterForm() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('moyu_otter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim()) {
      setError('注册需要填写一个萌新新昵称哦~');
      return;
    }
    if (password.length < 6) {
      setError('认证失败：密码过短或网络超时');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ email, password, nickname: nickname.trim(), avatar });
      if (res.success) {
        navigate('/home');
      } else {
        setError(res.message || '注册失败');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || '认证失败：密码过短或网络超时');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      {/* 装饰光斑 — 四角覆盖，保证左右也有渐变 */}
      <div className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] bg-accent-bg rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[500px] h-[500px] bg-accent-bg-2 rounded-full opacity-60 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-accent-bg rounded-full opacity-30 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-accent-bg-2 rounded-full opacity-30 blur-3xl pointer-events-none z-0" />

      <div className="w-full max-w-sm relative z-10">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="font-display font-black text-2xl text-ink">
            册就任工号
          </h1>
          <p className="font-display font-bold text-xs text-gray-500 mt-1">
            注册账号 · 开始带薪摸鱼
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
          <div className="mb-3">
            <label className="font-display font-bold text-xs text-ink block mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              minLength={6}
              className="w-full bg-bg-page border-2 border-ink rounded-xl px-3 py-2 font-bold text-xs text-ink placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          {/* 昵称 */}
          <div className="mb-4">
            <label className="font-display font-bold text-xs text-ink block mb-1">
              摸鱼花名
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例: 第五工室如厕家 / 下班预言师"
              maxLength={40}
              className="w-full bg-bg-page border-2 border-ink rounded-xl px-3 py-2 font-bold text-xs text-ink placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          {/* 头像选择 */}
          <div className="mb-5">
            <label className="font-display font-bold text-xs text-ink block mb-2">
              选择你的带薪化身
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAvatar(a.id)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all select-none
                    ${
                      avatar === a.id
                        ? 'border-ink bg-accent-bg shadow-sm'
                        : 'border-transparent bg-bg-page hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="font-bold text-[9px] text-gray-500 mt-0.5 leading-tight text-center">
                    {a.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5"
          >
            {loading ? '飞速处理中...' : '创建账号并滑入避难所 🦦'}
          </button>
        </form>

        {/* 切换链接 */}
        <p className="text-center mt-4 font-bold text-xs text-gray-500">
          已有工号？{' '}
          <Link to="/login" className="text-accent font-black hover:underline">
            打卡下海摸鱼 🌊
          </Link>
        </p>
      </div>
    </div>
  );
}

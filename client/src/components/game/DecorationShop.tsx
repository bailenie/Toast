import { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Decoration {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
  isPurchased?: boolean;
  purchasedAt?: string;
}

interface ExchangeRecord {
  id: string;
  userId: string;
  userName: string;
  decorationId: string;
  decorationName: string;
  cost: number;
  createdAt: string;
}

interface DecorationShopProps {
  circleId: string;
  onClose: () => void;
  onPurchased?: () => void;
}

export default function DecorationShop({ circleId, onClose, onPurchased }: DecorationShopProps) {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [records, setRecords] = useState<ExchangeRecord[]>([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'records'>('shop');

  // 加载装饰列表
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(`/decorations?circleId=${circleId}`);
        if (res.data.success) {
          setDecorations(res.data.data.decorations);
          setCoinBalance(res.data.data.coinBalance);
        }
      } catch (err) {
        console.error('加载装饰失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [circleId]);

  // 加载兑换记录
  useEffect(() => {
    if (activeTab !== 'records') return;

    const loadRecords = async () => {
      try {
        const res = await api.get(`/decorations/records?circleId=${circleId}`);
        if (res.data.success) {
          setRecords(res.data.data.records);
        }
      } catch (err) {
        console.error('加载兑换记录失败:', err);
      }
    };

    loadRecords();
  }, [circleId, activeTab]);

  // 购买装饰
  const handleBuy = async (decorationId: string) => {
    if (buying) return;

    try {
      setBuying(decorationId);
      setMessage('');
      const res = await api.post('/decorations/buy', {
        circleId,
        decorationId,
      });

      if (res.data.success) {
        setCoinBalance(res.data.data.coinBalance);
        setDecorations((prev) =>
          prev.map((d) =>
            d.id === decorationId ? { ...d, isPurchased: true, purchasedAt: new Date().toISOString() } : d
          )
        );
        setMessage(res.data.data.message);

        // 通知父组件购买成功
        if (onPurchased) {
          onPurchased();
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '购买失败';
      setMessage(errorMsg);
    } finally {
      setBuying(null);
      setShowConfirm(null);
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl cute-shadow-lg border-2 border-ink w-[500px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b-2 border-ink bg-primary/5 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">🏪 装饰商店</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">鱼币:</span>
            <span className="font-display font-bold text-primary">{coinBalance}</span>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b-2 border-ink">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 font-display font-bold text-sm transition-colors ${
              activeTab === 'shop'
                ? 'bg-primary text-white border-b-2 border-primary'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            装饰列表
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-3 font-display font-bold text-sm transition-colors ${
              activeTab === 'records'
                ? 'bg-primary text-white border-b-2 border-primary'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            兑换记录
          </button>
        </div>

        {/* 提示消息 */}
        {message && (
          <div className={`mx-4 mt-4 p-3 rounded-xl text-sm font-bold text-center ${
            message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 animate-bounce">🐟</div>
              <p className="font-bold text-sm text-gray-500">加载中...</p>
            </div>
          ) : activeTab === 'shop' ? (
            /* 装饰列表 */
            <div className="grid grid-cols-1 gap-3">
              {decorations.map((decoration) => (
                <div
                  key={decoration.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                    decoration.isPurchased
                      ? 'border-green-500 bg-green-50'
                      : 'border-ink bg-white'
                  }`}
                >
                  {/* 图标 */}
                  <span className="text-4xl">{decoration.icon}</span>

                  {/* 信息 */}
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-ink">{decoration.name}</h3>
                    <p className="text-sm text-gray-500">{decoration.description}</p>
                  </div>

                  {/* 价格/状态 */}
                  {decoration.isPurchased ? (
                    <span className="text-sm font-bold text-green-600">已拥有</span>
                  ) : (
                    <button
                      onClick={() => setShowConfirm(decoration.id)}
                      disabled={buying === decoration.id || coinBalance < decoration.price}
                      className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all ${
                        coinBalance < decoration.price
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary/90 text-white border-2 border-ink cute-shadow active:translate-y-0.5'
                      }`}
                    >
                      {buying === decoration.id ? '购买中...' : `${decoration.price} 鱼币`}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* 兑换记录 */
            <div className="space-y-3">
              {records.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="font-bold text-sm text-gray-500">暂无兑换记录</p>
                </div>
              ) : (
                records.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border-2 border-ink bg-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-ink">{record.decorationName}</span>
                      <span className="text-sm font-bold text-primary">-{record.cost} 鱼币</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{record.userName}</span>
                      <span>{formatDate(record.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 按钮栏 */}
        <div className="px-6 py-4 border-t-2 border-ink bg-surface">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 border-2 border-ink rounded-2xl font-display text-sm text-ink hover:bg-surface transition-colors"
          >
            关闭
          </button>
        </div>
      </div>

      {/* 确认购买弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl cute-shadow-lg border-2 border-ink p-6 max-w-[300px]">
            <h3 className="font-display font-bold text-ink mb-2">确认购买</h3>
            <p className="text-sm text-gray-600 mb-4">
              确认花费 {decorations.find(d => d.id === showConfirm)?.price} 鱼币购买 {decorations.find(d => d.id === showConfirm)?.name}？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-2 border-2 border-ink rounded-xl font-display text-sm text-ink hover:bg-surface transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleBuy(showConfirm)}
                disabled={buying !== null}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-display text-sm border-2 border-ink cute-shadow transition-all"
              >
                {buying === showConfirm ? '购买中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

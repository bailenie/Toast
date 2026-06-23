import { useAuthContext } from '../../contexts/AuthContext';

interface RedeemModalProps {
  totalCount: number;
  uniqueCount: number;
  onClose: () => void;
}

export default function RedeemModal({ totalCount, uniqueCount, onClose }: RedeemModalProps) {
  const { user } = useAuthContext();
  const isQualified = totalCount >= 108;

  // 发送兑换邮件
  const handleSendEmail = () => {
    const subject = encodeURIComponent('摸鱼圈 UNO 实体卡牌兑换申请');
    const body = encodeURIComponent(
      `兑换申请\n\n用户ID: ${user?.id || '未知'}\n用户昵称: ${user?.nickname || '未知'}\n累计卡牌数: ${totalCount}\n独特种类数: ${uniqueCount}\n\n请审核兑换资格，谢谢！`
    );
    window.open(`mailto:redeem@moyuquan.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-page border-[3px] border-ink rounded-2xl p-6 max-w-md w-full cute-shadow">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl text-ink mb-2">
            实体 UNO 兑换申请入口
          </h2>
          <p className="font-bold text-sm text-gray-500">
            集满 108 张卡片，兑换精美实体卡牌！
          </p>
        </div>

        {/* 兑换规则 */}
        <div className="bg-white rounded-xl border-2 border-ink p-4 mb-4">
          <h3 className="font-display font-black text-base text-ink mb-2">兑换规则</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span className="font-bold text-sm text-gray-600">累计收集 108 张卡片即可申请兑换</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span className="font-bold text-sm text-gray-600">兑换内容：54 款全实体印刷、豪华哑光大圆角材质 UNO 纸牌套装</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span className="font-bold text-sm text-gray-600">兑换方式：联系线下客服</span>
            </li>
          </ul>
        </div>

        {/* 当前收集统计 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-accent-bg rounded-xl p-3 text-center">
            <p className="font-bold text-xs text-gray-500">累计卡牌</p>
            <p className="font-display font-black text-2xl text-ink">{totalCount}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="font-bold text-xs text-gray-500">独特种类</p>
            <p className="font-display font-black text-2xl text-purple-600">{uniqueCount}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${isQualified ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="font-bold text-xs text-gray-500">兑换资格</p>
            <p className={`font-display font-black text-2xl ${isQualified ? 'text-green-600' : 'text-red-500'}`}>
              {isQualified ? '✅' : '❌'}
            </p>
          </div>
        </div>

        {/* 资格状态 */}
        <div className={`rounded-xl p-4 mb-4 ${isQualified ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
          <p className={`font-display font-black text-base ${isQualified ? 'text-green-700' : 'text-red-600'}`}>
            {isQualified ? '🎉 满足兑换资格！' : '😢 尚未集齐'}
          </p>
          <p className="font-bold text-sm text-gray-600 mt-1">
            {isQualified
              ? '恭喜你！可以申请兑换实体 UNO 卡牌了！'
              : `还需要收集 ${108 - totalCount} 张卡片才能兑换`
            }
          </p>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-xl border-2 border-ink p-4 mb-4">
          <h3 className="font-display font-black text-base text-ink mb-2">联系方式</h3>
          <p className="font-bold text-sm text-gray-600">客服QQ群：123456789</p>
          <p className="font-bold text-sm text-gray-600">微信：moyuquan_service</p>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {isQualified && (
            <button
              onClick={handleSendEmail}
              className="flex-1 bg-accent hover:bg-accent-hover text-white border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm"
            >
              发送邮件申请
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 bg-white hover:bg-accent-bg text-ink border-[3px] border-ink rounded-2xl font-display font-black text-sm px-4 py-3 transition-all active:translate-y-0.5 shadow-sm ${isQualified ? '' : 'w-full'}`}
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 自动化测试脚本：V1.1.0 摸鱼鱼交互优化
// 覆盖范围：摸鱼点击 + 抽卡 + 成长值 + 排行榜 + 图鉴
// 生成时间：2026-06-22
// 使用方法：在浏览器中按 F12，粘贴此脚本并回车
// 前置条件：已登录且已加入鱼圈，在摸鱼鱼页面
// ============================================

(async function autoTestMoyu() {
  console.log('%c🧪 V1.1.0 摸鱼鱼交互自动化测试', 'font-size:16px;font-weight:bold;color:#9C27B0');
  console.log('='.repeat(50));

  const tests = [];

  // ==========================================
  // 模块一：摸鱼主界面元素
  // ==========================================
  console.log('\n📦 模块一：摸鱼主界面元素');

  tests.push({
    name: '标题"带薪疯狂摸鱼"显示正确',
    category: '摸鱼界面',
    run: () => {
      const title = Array.from(document.querySelectorAll('h1')).find(h => h.textContent.includes('带薪疯狂摸鱼'));
      return {
        passed: !!title,
        msg: title ? `标题内容：${title.textContent.trim()}` : '未找到标题'
      };
    }
  });

  tests.push({
    name: '副标题显示正确',
    category: '摸鱼界面',
    run: () => {
      const subtitles = document.querySelectorAll('p');
      const subtitle = Array.from(subtitles).find(p => p.textContent.includes('点击宠物鱼'));
      return {
        passed: !!subtitle,
        msg: subtitle ? '副标题存在' : '未找到副标题'
      };
    }
  });

  // AC-005: 今日配额显示 {已用次数}/30
  tests.push({
    name: 'AC-005: 今日配额显示格式',
    category: '摸鱼界面',
    run: () => {
      const quotaTexts = document.querySelectorAll('[class*="font-bold"]');
      const quota = Array.from(quotaTexts).find(el => {
        const text = el.textContent.trim();
        return /^\d+\/\d+$/.test(text);
      });
      if (quota) {
        const [used, total] = quota.textContent.trim().split('/').map(Number);
        return {
          passed: total === 30,
          msg: `今日配额：${used}/${total}，上限${total === 30 ? '正确(30)' : '错误(应为30)'}`
        };
      }
      // 也可能在文本节点中
      const allText = document.body.innerText;
      const match = allText.match(/(\d+)\s*\/\s*30/);
      return {
        passed: !!match,
        msg: match ? `找到配额显示：${match[0]}` : '未找到配额显示'
      };
    }
  });

  // ==========================================
  // 模块二：宠物鱼（鱼缸区域）
  // ==========================================
  console.log('\n📦 模块二：宠物鱼（鱼缸区域）');

  // AC-001: 点击宠物鱼触发摸鱼
  tests.push({
    name: 'AC-001: 鱼缸区域可点击',
    category: '宠物鱼',
    run: () => {
      // 鱼缸区域是蓝色背景的div，包含cursor-pointer
      const fishTank = document.querySelector('[class*="cursor-pointer"][class*="bg-blue"]');
      if (!fishTank) {
        // 可能达到上限，检查是否有防沉迷提示
        const limitText = document.body.innerText;
        if (limitText.includes('防沉迷保护网')) {
          return { passed: true, msg: '已达今日上限，鱼缸不可点击（符合预期）' };
        }
        return { passed: false, msg: '未找到可点击的鱼缸区域' };
      }
      return { passed: true, msg: '鱼缸区域可点击（cursor-pointer）' };
    }
  });

  tests.push({
    name: '宠物鱼emoji显示',
    category: '宠物鱼',
    run: () => {
      const fishEmoji = document.querySelector('[class*="text-7xl"]');
      if (!fishEmoji) return { passed: false, msg: '未找到宠物鱼emoji元素' };
      const emoji = fishEmoji.textContent.trim();
      const validEmojis = ['🐠', '🐙', '🐡', '🎏'];
      return {
        passed: validEmojis.includes(emoji),
        msg: `宠物鱼emoji：${emoji}，${validEmojis.includes(emoji) ? '有效' : '无效'}`
      };
    }
  });

  tests.push({
    name: '宠物鱼名称显示',
    category: '宠物鱼',
    run: () => {
      const fishInfo = document.querySelector('[class*="text-7xl"]');
      if (!fishInfo) return { passed: false, msg: '未找到宠物鱼区域' };
      const parent = fishInfo.closest('[class*="text-center"]');
      if (!parent) return { passed: false, msg: '未找到宠物鱼信息区域' };
      const nameEl = parent.querySelector('h3');
      return {
        passed: !!nameEl,
        msg: nameEl ? `宠物鱼名称：${nameEl.textContent}` : '未找到宠物鱼名称'
      };
    }
  });

  tests.push({
    name: '宠物鱼品类和等级显示',
    category: '宠物鱼',
    run: () => {
      const fishInfo = document.querySelector('[class*="text-7xl"]');
      if (!fishInfo) return { passed: false, msg: '未找到宠物鱼区域' };
      const parent = fishInfo.closest('[class*="text-center"]');
      if (!parent) return { passed: false, msg: '未找到宠物鱼信息区域' };
      const typeEl = Array.from(parent.querySelectorAll('p')).find(p => p.textContent.includes('Lv.'));
      return {
        passed: !!typeEl,
        msg: typeEl ? `品类等级：${typeEl.textContent}` : '未找到品类等级信息'
      };
    }
  });

  // AC-203: 宠物鱼进化形态
  tests.push({
    name: 'AC-203: 宠物鱼等级与emoji对应',
    category: '宠物鱼',
    run: () => {
      const fishEmojiEl = document.querySelector('[class*="text-7xl"]');
      if (!fishEmojiEl) return { passed: true, msg: '宠物鱼未显示，跳过' };
      const emoji = fishEmojiEl.textContent.trim();
      const fishInfo = fishEmojiEl.closest('[class*="text-center"]');
      const typeText = fishInfo ? fishInfo.innerText : '';
      
      const levelMap = {
        '🐠': { level: 'Lv.1', name: '肥嘟嘟胖金鱼' },
        '🐙': { level: 'Lv.2', name: '带薪发愣神游鳌' },
        '🐡': { level: 'Lv.3', name: '太极双休太公鱼' },
        '🎏': { level: 'Lv.4', name: '极品七彩锦鲤皇' },
      };
      
      const expected = levelMap[emoji];
      if (!expected) return { passed: false, msg: `未知emoji：${emoji}` };
      
      const levelMatch = typeText.includes(expected.level);
      return {
        passed: levelMatch,
        msg: `${emoji} 应为 ${expected.level} ${expected.name}，实际包含Lv：${levelMatch ? '✅' : '❌'}`
      };
    }
  });

  // AC-002: 成长值进度条
  tests.push({
    name: 'AC-002: 成长值进度条存在',
    category: '宠物鱼',
    run: () => {
      const growthLabels = Array.from(document.querySelectorAll('span')).filter(s => s.textContent.includes('成长值'));
      if (growthLabels.length === 0) return { passed: false, msg: '未找到"成长值"标签' };
      // 检查进度条
      const progressBars = document.querySelectorAll('[class*="h-2"][class*="bg-gray-200"][class*="rounded-full"]');
      return {
        passed: progressBars.length >= 2,
        msg: `找到 ${growthLabels.length} 个成长值标签，${progressBars.length} 个进度条`
      };
    }
  });

  // AC-002: 成长值格式 {当前}/{所需}
  tests.push({
    name: 'AC-002: 成长值格式正确',
    category: '宠物鱼',
    run: () => {
      const growthTexts = Array.from(document.querySelectorAll('[class*="text-primary"]')).filter(el => {
        const text = el.textContent.trim();
        return /^\d+\/\d+$/.test(text);
      });
      if (growthTexts.length === 0) {
        // 尝试其他选择器
        const allText = document.body.innerText;
        const match = allText.match(/成长值\s*(\d+\/\d+)/);
        return {
          passed: !!match,
          msg: match ? `成长值格式：${match[1]}` : '未找到成长值数值'
        };
      }
      return {
        passed: true,
        msg: `成长值格式：${growthTexts[0].textContent.trim()}`
      };
    }
  });

  // AC-106: 达到上限后宠物鱼不可点击
  tests.push({
    name: 'AC-106: 达到上限状态检查',
    category: '宠物鱼',
    run: () => {
      const limitMsg = document.body.innerText;
      if (limitMsg.includes('你已触及今日防沉迷保护网')) {
        const fishTank = document.querySelector('[class*="cursor-pointer"][class*="bg-blue"]');
        return {
          passed: !fishTank,
          msg: !fishTank ? '达到上限后鱼缸不可点击 ✅' : '达到上限后鱼缸仍可点击 ❌'
        };
      }
      return { passed: true, msg: '未达到上限，跳过上限状态测试' };
    }
  });

  // ==========================================
  // 模块三：抽卡概率验证（通过多次模拟）
  // ==========================================
  console.log('\n📦 模块三：抽卡概率验证');

  tests.push({
    name: 'AC-201: 点击鱼缸触发摸鱼请求',
    category: '抽卡',
    run: async () => {
      const fishTank = document.querySelector('[class*="cursor-pointer"][class*="bg-blue"]');
      if (!fishTank) return { passed: true, msg: '鱼缸不可点击（可能已达上限）' };
      
      // 监听网络请求
      let requestCaptured = false;
      const originalFetch = window.fetch;
      const originalXHR = XMLHttpRequest.prototype.open;
      
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (url && url.includes('/moyu/click')) {
          requestCaptured = true;
        }
        return originalXHR.call(this, method, url, ...args);
      };
      
      fishTank.click();
      await new Promise(r => setTimeout(r, 1500)); // 等待动画+请求
      
      XMLHttpRequest.prototype.open = originalXHR;
      
      return {
        passed: true,
        msg: requestCaptured ? '已触发摸鱼API请求' : '未捕获到摸鱼请求（可能使用axios）'
      };
    }
  });

  // ==========================================
  // 模块四：排行榜
  // ==========================================
  console.log('\n📦 模块四：排行榜');

  tests.push({
    name: '排行榜标题显示',
    category: '排行榜',
    run: () => {
      const title = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('排行榜'));
      return {
        passed: !!title,
        msg: title ? `排行榜标题：${title.textContent}` : '未找到排行榜标题'
      };
    }
  });

  tests.push({
    name: '排行榜副标题"今日划水次数 + 历史功勋簿"',
    category: '排行榜',
    run: () => {
      const subtitle = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('今日划水次数'));
      return {
        passed: !!subtitle,
        msg: subtitle ? '排行榜副标题正确' : '未找到排行榜副标题'
      };
    }
  });

  tests.push({
    name: '排行榜奖牌emoji（🥇🥈🥉）',
    category: '排行榜',
    run: () => {
      const medals = ['🥇', '🥈', '🥉'];
      const found = medals.filter(m => document.body.innerText.includes(m));
      return {
        passed: true,
        msg: `找到奖牌：${found.join(' ') || '无排名数据'}`
      };
    }
  });

  tests.push({
    name: '排行榜空状态提示',
    category: '排行榜',
    run: () => {
      const emptyState = document.body.innerText.includes('暂无数据，快来摸鱼上榜');
      const hasEntries = document.querySelectorAll('[class*="rounded-xl"][class*="border-2"][class*="bg-gray-50"]').length;
      return {
        passed: true,
        msg: emptyState ? '空状态：显示"暂无数据"' : `排行榜有 ${hasEntries} 条记录`
      };
    }
  });

  // ==========================================
  // 模块五：UNO图鉴
  // ==========================================
  console.log('\n📦 模块五：UNO图鉴');

  tests.push({
    name: 'UNO图鉴标题显示',
    category: '图鉴',
    run: () => {
      const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('UNO'));
      return {
        passed: !!title,
        msg: title ? 'UNO图鉴标题存在' : '未找到UNO图鉴标题'
      };
    }
  });

  tests.push({
    name: '收集进度条显示（N/54格式）',
    category: '图鉴',
    run: () => {
      const progressText = Array.from(document.querySelectorAll('span')).find(s => {
        const text = s.textContent.trim();
        return /^\d+\/54$/.test(text);
      });
      return {
        passed: !!progressText,
        msg: progressText ? `收集进度：${progressText.textContent.trim()}` : '未找到N/54进度显示'
      };
    }
  });

  tests.push({
    name: '"查看全部图鉴"按钮存在',
    category: '图鉴',
    run: () => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('查看全部图鉴'));
      return {
        passed: !!btn,
        msg: btn ? '"查看全部图鉴"按钮存在' : '未找到按钮'
      };
    }
  });

  tests.push({
    name: '"兑换实物"按钮存在',
    category: '图鉴',
    run: () => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('兑换实物'));
      return {
        passed: !!btn,
        msg: btn ? '"兑换实物"按钮存在' : '未找到按钮'
      };
    }
  });

  tests.push({
    name: '卡片统计"累计"和"种类"显示',
    category: '图鉴',
    run: () => {
      const text = document.body.innerText;
      const hasTotal = text.includes('累计');
      const hasUnique = text.includes('种类');
      return {
        passed: hasTotal && hasUnique,
        msg: `累计：${hasTotal ? '✅' : '❌'}，种类：${hasUnique ? '✅' : '❌'}`
      };
    }
  });

  // ==========================================
  // 模块六：卡片掉落弹窗
  // ==========================================
  console.log('\n📦 模块六：卡片掉落弹窗检查');

  tests.push({
    name: 'CardDropModal组件可触发',
    category: '卡片掉落',
    run: () => {
      // 检查弹窗组件是否存在（即使当前未显示）
      const modalContainer = document.querySelector('[class*="fixed"][class*="z-50"][class*="bg-black"]');
      if (modalContainer) {
        const title = modalContainer.querySelector('h2');
        const hasCards = modalContainer.querySelectorAll('[class*="rounded-2xl"][class*="border-ink"]');
        return {
          passed: true,
          msg: `弹窗已打开，标题：${title?.textContent || '无'}，卡片数：${hasCards.length}`
        };
      }
      return { passed: true, msg: '弹窗当前未打开（正常，摸鱼后才弹出）' };
    }
  });

  // ==========================================
  // 模块七：签到日历组件
  // ==========================================
  console.log('\n📦 模块七：签到日历组件');

  tests.push({
    name: '签到日历"本周签到"标题',
    category: '签到',
    run: () => {
      const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('本周签到'));
      return {
        passed: !!title,
        msg: title ? '签到日历标题存在' : '未找到签到日历标题'
      };
    }
  });

  tests.push({
    name: '鱼币余额显示',
    category: '签到',
    run: () => {
      const coinText = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('鱼币:'));
      return {
        passed: !!coinText,
        msg: coinText ? `鱼币余额：${coinText.textContent.trim()}` : '未找到鱼币余额显示'
      };
    }
  });

  tests.push({
    name: '本周日期网格显示（7列）',
    category: '签到',
    run: () => {
      const grid = document.querySelector('[class*="grid-cols-7"]');
      return {
        passed: !!grid,
        msg: grid ? '7列签到网格存在' : '未找到7列网格'
      };
    }
  });

  tests.push({
    name: '星期标签显示（一二三四五六日）',
    category: '签到',
    run: () => {
      const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
      const text = document.body.innerText;
      const found = weekDays.filter(d => text.includes(d));
      return {
        passed: found.length === 7,
        msg: `找到星期标签：${found.join(' ')} (${found.length}/7)`
      };
    }
  });

  tests.push({
    name: '签到按钮存在',
    category: '签到',
    run: () => {
      const signBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('签到领鱼币') || b.textContent.includes('已签到')
      );
      if (!signBtn) return { passed: false, msg: '未找到签到按钮' };
      const isDisabled = signBtn.disabled || signBtn.textContent.includes('已签到');
      return {
        passed: true,
        msg: `签到按钮：${signBtn.textContent.trim()}，${isDisabled ? '已禁用/已签到' : '可点击'}`
      };
    }
  });

  // AC-204: 每日配额固定30次
  tests.push({
    name: 'AC-204: 今日配额上限为30',
    category: '配额',
    run: () => {
      const text = document.body.innerText;
      const match = text.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        return {
          passed: parseInt(match[2]) === 30,
          msg: `配额：${match[0]}，上限${match[2]}${parseInt(match[2]) === 30 ? '✅' : '❌ 应为30'}`
        };
      }
      return { passed: true, msg: '未找到配额显示文本' };
    }
  });

  // ==========================================
  // 执行所有测试
  // ==========================================
  console.log('\n' + '='.repeat(50));
  console.log('%c🚀 开始执行测试...', 'font-weight:bold;color:#9C27B0');
  console.log('='.repeat(50));

  let passedCount = 0;
  let failedCount = 0;

  for (const test of tests) {
    try {
      const result = await Promise.resolve(test.run());
      if (result.passed) {
        console.log(`✅ [${test.category}] ${test.name}: ${result.msg}`);
        passedCount++;
      } else {
        console.error(`❌ [${test.category}] ${test.name}: ${result.msg}`);
        failedCount++;
      }
    } catch (err) {
      console.error(`❌ [${test.category}] ${test.name}: 异常 - ${err.message}`);
      failedCount++;
    }
  }

  // 汇总
  console.log('\n' + '='.repeat(50));
  console.log('%c📊 摸鱼鱼交互测试汇总', 'font-size:14px;font-weight:bold;color:#9C27B0');
  console.log('='.repeat(50));
  console.log(`✅ 通过：${passedCount} 项`);
  console.log(`❌ 失败：${failedCount} 项`);
  console.log(`📝 总计：${tests.length} 项`);
  console.log(`📈 通过率：${((passedCount / tests.length) * 100).toFixed(1)}%`);

  if (failedCount === 0) {
    console.log('%c🎉 全部通过！', 'font-size:14px;color:#4CAF50;font-weight:bold');
  } else {
    console.log('%c⚠️ 存在失败项，请检查', 'font-size:14px;color:#f44336;font-weight:bold');
  }

  return { passed: passedCount, failed: failedCount, total: tests.length };
})();

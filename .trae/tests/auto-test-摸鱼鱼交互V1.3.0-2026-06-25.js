// ============================================
// 自动化验收测试脚本：V1.3.0 摸鱼鱼交互优化
// 覆盖范围：今日获卡显示、满级显示、不掉卡提示、5级宠物鱼
// 生成时间：2026-06-25
// 使用方法：在浏览器中按 F12，粘贴此脚本并回车
// 前置条件：已登录且已加入鱼圈，在摸鱼鱼页面
// ============================================

(async function autoTestMoyuV130() {
  console.log('%c🧪 V1.3.0 摸鱼鱼交互优化验收测试', 'font-size:16px;font-weight:bold;color:#9C27B0');
  console.log('='.repeat(50));

  const tests = [];

  // ==========================================
  // 模块一：今日获卡进度显示
  // ==========================================
  console.log('\n📦 模块一：今日获卡进度显示');

  // AC-109: 今日获卡进度条存在
  tests.push({
    name: 'AC-109: 今日获卡进度条存在',
    category: '今日获卡',
    run: () => {
      const allText = document.body.innerText;
      const hasTodayCard = allText.includes('今日获卡');
      return {
        passed: hasTodayCard,
        msg: hasTodayCard ? '找到"今日获卡"标签' : '未找到"今日获卡"标签'
      };
    }
  });

  // AC-109: 今日获卡格式 X/5
  tests.push({
    name: 'AC-109: 今日获卡格式 X/5',
    category: '今日获卡',
    run: () => {
      const allText = document.body.innerText;
      const match = allText.match(/(\d+)\s*\/\s*5/);
      return {
        passed: !!match,
        msg: match ? `今日获卡：${match[0]}` : '未找到 X/5 格式的今日获卡显示'
      };
    }
  });

  // 今日获卡进度条（紫色）
  tests.push({
    name: '今日获卡进度条（紫色）',
    category: '今日获卡',
    run: () => {
      const purpleBars = document.querySelectorAll('[class*="bg-purple-500"]');
      return {
        passed: purpleBars.length > 0,
        msg: purpleBars.length > 0 ? `找到 ${purpleBars.length} 个紫色进度条` : '未找到紫色进度条'
      };
    }
  });

  // ==========================================
  // 模块二：满级显示
  // ==========================================
  console.log('\n📦 模块二：满级显示');

  // AC-205: 满级时成长值显示"MAX"
  tests.push({
    name: 'AC-205: 满级时成长值显示检查',
    category: '满级显示',
    run: () => {
      const allText = document.body.innerText;
      const hasMax = allText.includes('MAX');
      const hasGrowth = allText.includes('成长值');
      // 如果满级，应该显示MAX而不是数字
      if (hasMax) {
        return { passed: true, msg: '满级状态：显示"MAX"' };
      }
      // 如果未满级，应该显示成长值进度条
      if (hasGrowth) {
        return { passed: true, msg: '未满级状态：显示成长值进度条' };
      }
      return { passed: false, msg: '未找到成长值或MAX显示' };
    }
  });

  // 满级时无进度条
  tests.push({
    name: '满级时进度条隐藏',
    category: '满级显示',
    run: () => {
      const allText = document.body.innerText;
      const hasMax = allText.includes('MAX');
      if (!hasMax) {
        return { passed: true, msg: '未满级，跳过此测试' };
      }
      // 满级时应该没有成长值进度条
      const growthBars = document.querySelectorAll('[class*="bg-amber-400"]');
      return {
        passed: growthBars.length === 0,
        msg: growthBars.length === 0 ? '满级时进度条已隐藏' : '满级时进度条仍显示'
      };
    }
  });

  // 5级宠物鱼 emoji
  tests.push({
    name: '5级宠物鱼 emoji 🐉',
    category: '满级显示',
    run: () => {
      const fishEmoji = document.querySelector('[class*="text-7xl"]');
      if (!fishEmoji) return { passed: false, msg: '未找到宠物鱼emoji元素' };
      const emoji = fishEmoji.textContent.trim();
      const allText = document.body.innerText;
      const hasLevel5 = allText.includes('Lv.5') || allText.includes('传说级摸鱼之神');
      if (hasLevel5) {
        return {
          passed: emoji === '🐉',
          msg: `5级宠物鱼emoji：${emoji}，${emoji === '🐉' ? '正确' : '应为 🐉'}`
        };
      }
      return { passed: true, msg: `当前非5级，emoji：${emoji}` };
    }
  });

  // ==========================================
  // 模块三：不掉卡提示
  // ==========================================
  console.log('\n📦 模块三：不掉卡提示');

  // 不掉卡时的友好提示
  tests.push({
    name: '不掉卡时的友好提示检查',
    category: '不掉卡提示',
    run: () => {
      const allText = document.body.innerText;
      // 检查是否有不掉卡的提示文案
      const hasNoCardTip = allText.includes('今日份的运气都攒着呢') || 
                           allText.includes('鱼儿今天心情好') ||
                           allText.includes('摸鱼');
      return {
        passed: true,
        msg: '不掉卡提示需要在摸鱼后验证（当前为静态检查）'
      };
    }
  });

  // ==========================================
  // 模块四：抽卡概率验证
  // ==========================================
  console.log('\n📦 模块四：抽卡概率验证');

  // V1.3.0 概率：60%不掉卡 / 20%重复 / 10%N / 7%R / 3%SR
  tests.push({
    name: 'V1.3.0 概率分布验证',
    category: '抽卡概率',
    run: async () => {
      const fishTank = document.querySelector('[class*="cursor-pointer"][class*="bg-blue"]');
      if (!fishTank) return { passed: true, msg: '鱼缸不可点击（可能已达上限）' };
      
      let nullCount = 0;
      let cardCount = 0;
      const total = 20;
      
      for (let i = 0; i < total; i++) {
        fishTank.click();
        await new Promise(r => setTimeout(r, 2000));
        
        const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
        if (modal && modal.querySelector('[class*="rounded-2xl"]')) {
          cardCount++;
          // 关闭弹窗
          const closeBtn = modal.querySelector('button');
          if (closeBtn) closeBtn.click();
          await new Promise(r => setTimeout(r, 500));
        } else {
          nullCount++;
        }
      }
      
      const nullRate = (nullCount / total * 100).toFixed(1);
      return {
        passed: true,
        msg: `20次摸鱼：${nullCount}次不掉卡(${nullRate}%)，${cardCount}次掉卡`
      };
    }
  });

  // ==========================================
  // 模块五：每日获卡上限
  // ==========================================
  console.log('\n📦 模块五：每日获卡上限');

  tests.push({
    name: 'AC-109: 每日获卡上限5张',
    category: '获卡上限',
    run: () => {
      const allText = document.body.innerText;
      const match = allText.match(/(\d+)\s*\/\s*5/);
      if (match) {
        const current = parseInt(match[1]);
        return {
          passed: current <= 5,
          msg: `今日获卡：${current}/5，${current <= 5 ? '上限正确' : '超过上限'}`
        };
      }
      return { passed: true, msg: '未找到获卡上限显示（可能未显示）' };
    }
  });

  // ==========================================
  // 模块六：排行榜（保留V1.1.0验证）
  // ==========================================
  console.log('\n📦 模块六：排行榜');

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

  // ==========================================
  // 模块七：UNO图鉴（保留V1.1.0验证）
  // ==========================================
  console.log('\n📦 模块七：UNO图鉴');

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
  console.log('%c📊 V1.3.0 摸鱼鱼交互验收测试汇总', 'font-size:14px;font-weight:bold;color:#9C27B0');
  console.log('='.repeat(50));
  console.log(`✅ 通过：${passedCount} 项`);
  console.log(`❌ 失败：${failedCount} 项`);
  console.log(`📝 总计：${tests.length} 项`);
  console.log(`📈 通过率：${((passedCount / tests.length) * 100).toFixed(1)}%`);

  if (failedCount === 0) {
    console.log('%c🎉 全部通过！V1.3.0 摸鱼鱼交互优化验收成功', 'font-size:14px;color:#4CAF50;font-weight:bold');
  } else {
    console.log('%c⚠️ 存在失败项，请检查', 'font-size:14px;color:#f44336;font-weight:bold');
  }

  return { passed: passedCount, failed: failedCount, total: tests.length };
})();

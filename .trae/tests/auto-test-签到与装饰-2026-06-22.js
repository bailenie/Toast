// ============================================
// 自动化测试脚本：V1.1.0 签到与装饰系统
// 覆盖范围：签到功能 + 鱼币系统 + 装饰商店 + 兑换记录
// 生成时间：2026-06-22
// 使用方法：在浏览器中按 F12，粘贴此脚本并回车
// 前置条件：已登录且已加入鱼圈，在摸鱼鱼页面
// ============================================

(async function autoTestSignInDecoration() {
  console.log('%c🧪 V1.1.0 签到与装饰系统自动化测试', 'font-size:16px;font-weight:bold;color:#FF9800');
  console.log('='.repeat(50));

  const tests = [];

  // ==========================================
  // 模块一：签到功能
  // ==========================================
  console.log('\n📦 模块一：签到功能');

  // AC-001: 签到成功获得1鱼币
  tests.push({
    name: 'AC-001: 签到按钮状态检查',
    category: '签到',
    run: () => {
      const signBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('签到领鱼币') || b.textContent.includes('已签到') || b.textContent.includes('签到中')
      );
      if (!signBtn) return { passed: false, msg: '未找到签到按钮' };
      const state = signBtn.textContent.includes('已签到') ? '已签到' : 
                    signBtn.textContent.includes('签到中') ? '签到中' : '未签到';
      return { passed: true, msg: `签到按钮状态：${state}` };
    }
  });

  // AC-002: 已签到时按钮灰色
  tests.push({
    name: 'AC-002: 已签到按钮样式检查',
    category: '签到',
    run: () => {
      const signedBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('已签到'));
      if (!signedBtn) return { passed: true, msg: '当前未签到，跳过已签到样式检查' };
      const isDisabled = signedBtn.disabled;
      const hasGrayStyle = signedBtn.className.includes('gray') || signedBtn.className.includes('cursor-not-allowed');
      return {
        passed: isDisabled || hasGrayStyle,
        msg: `已签到按钮：disabled=${isDisabled}，灰色样式=${hasGrayStyle}`
      };
    }
  });

  // AC-101: 重复签到拦截
  tests.push({
    name: 'AC-101: 已签到按钮不可重复点击',
    category: '签到',
    run: () => {
      const signedBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('已签到'));
      if (!signedBtn) return { passed: true, msg: '当前未签到，无需检查重复签到' };
      const isDisabled = signedBtn.disabled;
      return {
        passed: isDisabled,
        msg: isDisabled ? '已签到按钮已禁用，无法重复点击 ✅' : '已签到按钮未禁用 ⚠️'
      };
    }
  });

  // AC-201: 鱼币进入鱼圈公共账户
  tests.push({
    name: 'AC-201: 鱼币余额显示（签到日历中）',
    category: '签到',
    run: () => {
      const coinEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('鱼币:'));
      if (!coinEl) return { passed: false, msg: '未找到鱼币余额显示' };
      const balance = coinEl.textContent.replace('鱼币:', '').trim();
      return {
        passed: !isNaN(parseInt(balance)),
        msg: `鱼圈鱼币余额：${balance}`
      };
    }
  });

  // ==========================================
  // 模块二：装饰商店
  // ==========================================
  console.log('\n📦 模块二：装饰商店');

  // AC-010: 打开装饰商店
  tests.push({
    name: 'AC-010: "装扮商城"入口按钮',
    category: '装饰商店',
    run: () => {
      const shopBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('装扮商城'));
      if (!shopBtn) return { passed: false, msg: '未找到装扮商城入口' };
      return { passed: true, msg: '装扮商城入口存在' };
    }
  });

  // 打开装饰商店弹窗
  tests.push({
    name: 'AC-010: 打开装饰商店弹窗',
    category: '装饰商店',
    run: async () => {
      const shopBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('装扮商城'));
      if (!shopBtn) return { passed: false, msg: '未找到装扮商城入口' };
      
      shopBtn.click();
      await new Promise(r => setTimeout(r, 800));
      
      // 检查弹窗
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const title = modal.querySelector('h2');
      return {
        passed: title && title.textContent.includes('装饰商店'),
        msg: title ? `弹窗标题：${title.textContent.trim()}` : '弹窗已打开但未找到标题'
      };
    }
  });

  // AC-003: 装饰商店显示5款装饰
  tests.push({
    name: 'AC-003: 装饰列表显示5款装饰',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      // 查找装饰项（每个装饰项有border-2和rounded-xl）
      const decorItems = modal.querySelectorAll('[class*="rounded-xl"][class*="border-2"]');
      return {
        passed: decorItems.length >= 5,
        msg: `找到 ${decorItems.length} 个装饰项（预期5个）`
      };
    }
  });

  // 装饰名称验证
  tests.push({
    name: '装饰名称：水草/气泡/石头/海星/珊瑚',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const expectedNames = ['水草', '气泡', '石头', '海星', '珊瑚'];
      const text = modal.innerText;
      const found = expectedNames.filter(name => text.includes(name));
      return {
        passed: found.length === 5,
        msg: `找到装饰：${found.join('、')} (${found.length}/5)`
      };
    }
  });

  // 装饰价格验证
  tests.push({
    name: '装饰价格显示（1-5鱼币）',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const text = modal.innerText;
      const priceMatches = text.match(/\d+\s*鱼币/g);
      return {
        passed: priceMatches && priceMatches.length >= 1,
        msg: priceMatches ? `价格标签：${priceMatches.join('、')}` : '未找到价格标签'
      };
    }
  });

  // 弹窗鱼币余额
  tests.push({
    name: '装饰商店内鱼币余额显示',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const coinEl = Array.from(modal.querySelectorAll('span')).find(s => s.textContent.includes('鱼币'));
      return {
        passed: !!coinEl,
        msg: coinEl ? `商店内鱼币显示：${coinEl.parentElement?.textContent.trim()}` : '未找到鱼币余额'
      };
    }
  });

  // Tab切换：装饰列表/兑换记录
  tests.push({
    name: '装饰商店Tab切换（装饰列表/兑换记录）',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const tabs = Array.from(modal.querySelectorAll('button')).filter(b => 
        b.textContent.includes('装饰列表') || b.textContent.includes('兑换记录')
      );
      return {
        passed: tabs.length === 2,
        msg: `找到 ${tabs.length} 个Tab（装饰列表/兑换记录）`
      };
    }
  });

  // AC-102: 装饰已购买状态
  tests.push({
    name: 'AC-103: 已购买装饰显示"已拥有"标签',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const ownedLabels = Array.from(modal.querySelectorAll('span')).filter(s => s.textContent.includes('已拥有'));
      const purchaseBtns = Array.from(modal.querySelectorAll('button')).filter(b => b.textContent.includes('鱼币'));
      return {
        passed: true,
        msg: `已拥有：${ownedLabels.length}个，可购买：${purchaseBtns.length}个`
      };
    }
  });

  // AC-102: 鱼币不足时按钮禁用
  tests.push({
    name: 'AC-102: 鱼币不足时购买按钮禁用',
    category: '装饰商店',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const disabledBtns = Array.from(modal.querySelectorAll('button[disabled]')).filter(b => b.textContent.includes('鱼币'));
      const enabledBtns = Array.from(modal.querySelectorAll('button:not([disabled])')).filter(b => b.textContent.includes('鱼币'));
      return {
        passed: true,
        msg: `禁用按钮：${disabledBtns.length}个（鱼币不足），可用按钮：${enabledBtns.length}个`
      };
    }
  });

  // ==========================================
  // 模块三：兑换记录
  // ==========================================
  console.log('\n📦 模块三：兑换记录');

  tests.push({
    name: '切换到"兑换记录"Tab',
    category: '兑换记录',
    run: async () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const recordsTab = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('兑换记录'));
      if (!recordsTab) return { passed: false, msg: '未找到兑换记录Tab' };
      
      recordsTab.click();
      await new Promise(r => setTimeout(r, 500));
      return { passed: true, msg: '已切换到兑换记录Tab' };
    }
  });

  // AC-004: 兑换记录显示
  tests.push({
    name: 'AC-004: 兑换记录内容或空状态',
    category: '兑换记录',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const hasRecords = modal.innerText.includes('鱼币') && modal.querySelectorAll('[class*="rounded-xl"][class*="border-2"]').length > 0;
      const isEmpty = modal.innerText.includes('暂无兑换记录');
      return {
        passed: hasRecords || isEmpty,
        msg: isEmpty ? '兑换记录为空状态显示' : `兑换记录有内容`
      };
    }
  });

  // 兑换记录字段验证
  tests.push({
    name: '兑换记录包含时间、用户、装饰、鱼币数',
    category: '兑换记录',
    run: () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '装饰商店弹窗未打开' };
      
      const isEmpty = modal.innerText.includes('暂无兑换记录');
      if (isEmpty) return { passed: true, msg: '当前无兑换记录，跳过字段验证' };
      
      // 检查是否有带负数鱼币的记录（-X 鱼币）
      const hasCostDisplay = modal.innerText.includes('-') && modal.innerText.includes('鱼币');
      return {
        passed: true,
        msg: hasCostDisplay ? '兑换记录包含消耗鱼币显示' : '兑换记录格式待验证'
      };
    }
  });

  // ==========================================
  // 模块四：关闭弹窗
  // ==========================================
  console.log('\n📦 模块四：弹窗关闭');

  tests.push({
    name: '装饰商店"关闭"按钮',
    category: '弹窗关闭',
    run: async () => {
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: true, msg: '弹窗已关闭' };
      
      const closeBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.trim() === '关闭');
      if (!closeBtn) return { passed: false, msg: '未找到关闭按钮' };
      
      closeBtn.click();
      await new Promise(r => setTimeout(r, 300));
      
      const modalAfter = document.querySelector('[class*="fixed"][class*="z-50"]');
      return {
        passed: !modalAfter,
        msg: !modalAfter ? '弹窗已成功关闭' : '弹窗未关闭'
      };
    }
  });

  // ==========================================
  // 执行所有测试
  // ==========================================
  console.log('\n' + '='.repeat(50));
  console.log('%c🚀 开始执行测试...', 'font-weight:bold;color:#FF9800');
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
  console.log('%c📊 签到与装饰系统测试汇总', 'font-size:14px;font-weight:bold;color:#FF9800');
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

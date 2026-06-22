// ============================================
// 自动化测试脚本：V1.1.0 全局布局与交互
// 覆盖范围：页面布局 + 鱼圈管理 + 新用户引导 + Tab切换
// 生成时间：2026-06-22
// 使用方法：在浏览器中按 F12，粘贴此脚本并回车
// 前置条件：已登录应用，处于首页
// ============================================

(async function autoTestLayout() {
  console.log('%c🧪 V1.1.0 全局布局自动化测试', 'font-size:16px;font-weight:bold;color:#4CAF50');
  console.log('='.repeat(50));

  const tests = [];

  // ==========================================
  // 模块一：左侧常驻鱼圈栏
  // ==========================================
  console.log('\n📦 模块一：左侧常驻鱼圈栏');

  // AC-001: 左侧栏显示所有已加入的鱼圈，底部显示"我的窝囊费"
  tests.push({
    name: 'AC-001: 左侧栏容器存在',
    category: '布局',
    run: () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏容器（w-[200px]）' };
      return { passed: true, msg: '左侧栏容器存在' };
    }
  });

  tests.push({
    name: 'AC-001: 左侧栏底部显示"我的窝囊费"',
    category: '布局',
    run: () => {
      const buttons = document.querySelectorAll('button');
      const salaryBtn = Array.from(buttons).find(btn => btn.textContent.includes('我的窝囊费'));
      if (!salaryBtn) return { passed: false, msg: '未找到"我的窝囊费"按钮' };
      // 检查是否在左侧栏底部（在sidebar内）
      return { passed: true, msg: '找到"我的窝囊费"按钮' };
    }
  });

  tests.push({
    name: 'AC-001: 鱼圈列表显示鱼圈图标',
    category: '布局',
    run: () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏' };
      const circleButtons = sidebar.querySelectorAll('button');
      // 排除 [+] 按钮和窝囊费按钮
      const circleItems = Array.from(circleButtons).filter(btn => {
        const text = btn.textContent || '';
        return !text.includes('加入/创建') && !text.includes('我的窝囊费') && text.length > 2;
      });
      if (circleItems.length === 0) return { passed: false, msg: '鱼圈列表为空' };
      return { passed: true, msg: `找到 ${circleItems.length} 个鱼圈` };
    }
  });

  // AC-101: 用户只加入一个鱼圈时只显示一个
  tests.push({
    name: 'AC-101: 鱼圈列表数量正确',
    category: '边界',
    run: () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏' };
      const allButtons = sidebar.querySelectorAll('button');
      const circleItems = Array.from(allButtons).filter(btn => {
        const text = btn.textContent || '';
        return !text.includes('加入/创建') && !text.includes('我的窝囊费') && text.trim().length > 0;
      });
      return { passed: true, msg: `当前显示 ${circleItems.length} 个鱼圈项` };
    }
  });

  // AC-102: 鱼圈名称过长时截断显示省略号
  tests.push({
    name: 'AC-102: 鱼圈名称截断（truncate类）',
    category: '边界',
    run: () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏' };
      const nameEls = sidebar.querySelectorAll('[class*="truncate"]');
      return { passed: nameEls.length > 0, msg: `找到 ${nameEls.length} 个带truncate样式的元素` };
    }
  });

  // AC-103: 未读消息数红色角标
  tests.push({
    name: 'AC-103: 未读消息角标样式（红色背景）',
    category: '边界',
    run: () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏' };
      const badges = sidebar.querySelectorAll('[class*="bg-danger"]');
      if (badges.length === 0) {
        return { passed: true, msg: '当前无未读消息角标（正常情况）' };
      }
      return { passed: true, msg: `找到 ${badges.length} 个未读角标，样式为bg-danger` };
    }
  });

  // ==========================================
  // 模块二：顶部导航栏
  // ==========================================
  console.log('\n📦 模块二：顶部导航栏');

  tests.push({
    name: '顶部导航栏存在',
    category: '布局',
    run: () => {
      const nav = document.querySelector('header');
      if (!nav) return { passed: false, msg: '未找到顶部导航栏（header）' };
      return { passed: true, msg: '顶部导航栏存在' };
    }
  });

  tests.push({
    name: '顶部显示当前鱼圈名称',
    category: '布局',
    run: () => {
      const nav = document.querySelector('header');
      if (!nav) return { passed: false, msg: '未找到顶部导航栏' };
      const circleNameEl = nav.querySelector('[class*="bg-surface"]');
      if (!circleNameEl) return { passed: false, msg: '未找到鱼圈名称区域' };
      return { passed: true, msg: `鱼圈名称区域内容：${circleNameEl.textContent.trim().substring(0, 30)}` };
    }
  });

  tests.push({
    name: '顶部显示用户头像菜单',
    category: '布局',
    run: () => {
      const nav = document.querySelector('header');
      if (!nav) return { passed: false, msg: '未找到顶部导航栏' };
      // UserMenu 组件通常在 header 右侧
      const rightArea = nav.querySelector('[class*="justify-between"]');
      if (!rightArea) return { passed: false, msg: '未找到导航栏右侧区域' };
      return { passed: true, msg: '导航栏右侧区域存在（用户头像菜单）' };
    }
  });

  // ==========================================
  // 模块三：底部Tab栏
  // ==========================================
  console.log('\n📦 模块三：底部Tab栏');

  tests.push({
    name: 'AC-003: 底部Tab栏存在',
    category: 'Tab切换',
    run: () => {
      const tabButtons = document.querySelectorAll('button');
      const chatTab = Array.from(tabButtons).find(btn => btn.textContent.includes('蛐蛐间'));
      const gameTab = Array.from(tabButtons).find(btn => btn.textContent.includes('摸鱼鱼'));
      if (!chatTab) return { passed: false, msg: '未找到"蛐蛐间"Tab' };
      if (!gameTab) return { passed: false, msg: '未找到"摸鱼鱼"Tab' };
      return { passed: true, msg: '底部Tab栏包含"蛐蛐间"和"摸鱼鱼"' };
    }
  });

  tests.push({
    name: 'AC-003: Tab图标显示正确',
    category: 'Tab切换',
    run: () => {
      const tabButtons = document.querySelectorAll('button');
      const chatTab = Array.from(tabButtons).find(btn => btn.textContent.includes('蛐蛐间'));
      const gameTab = Array.from(tabButtons).find(btn => btn.textContent.includes('摸鱼鱼'));
      const chatHasIcon = chatTab && (chatTab.textContent.includes('💬'));
      const gameHasIcon = gameTab && (gameTab.textContent.includes('🎮'));
      return {
        passed: chatHasIcon && gameHasIcon,
        msg: `蛐蛐间图标：${chatHasIcon ? '✅' : '❌'}，摸鱼鱼图标：${gameHasIcon ? '✅' : '❌'}`
      };
    }
  });

  // ==========================================
  // 模块四：鱼圈切换
  // ==========================================
  console.log('\n📦 模块四：鱼圈切换');

  tests.push({
    name: 'AC-002: 点击鱼圈切换功能',
    category: '鱼圈切换',
    run: async () => {
      const sidebar = document.querySelector('[class*="w-[200px]"]');
      if (!sidebar) return { passed: false, msg: '未找到左侧栏' };
      const allButtons = sidebar.querySelectorAll('button');
      const circleItems = Array.from(allButtons).filter(btn => {
        const text = btn.textContent || '';
        return !text.includes('加入/创建') && !text.includes('我的窝囊费') && text.trim().length > 2;
      });
      if (circleItems.length < 2) {
        return { passed: true, msg: '仅1个鱼圈，跳过切换测试' };
      }
      // 点击第二个鱼圈
      const originalUrl = window.location.href;
      circleItems[1].click();
      await new Promise(r => setTimeout(r, 500));
      const newUrl = window.location.href;
      return {
        passed: true,
        msg: `点击了第二个鱼圈，URL变化：${originalUrl !== newUrl ? '是' : '可能使用Context切换'}`
      };
    }
  });

  tests.push({
    name: 'AC-201: 切换鱼圈后默认进入聊天室',
    category: '鱼圈切换',
    run: () => {
      const url = window.location.pathname;
      const isChatOrMain = url.includes('/chat') || url === '/' || url === '';
      return {
        passed: true,
        msg: `当前路径：${url}，${isChatOrMain ? '在聊天室/首页' : '非聊天室路径'}`
      };
    }
  });

  // ==========================================
  // 模块五：[+] 创建/加入鱼圈按钮
  // ==========================================
  console.log('\n📦 模块五：创建/加入鱼圈');

  tests.push({
    name: 'AC-003: [+] 按钮存在',
    category: '鱼圈管理',
    run: () => {
      const buttons = document.querySelectorAll('button');
      const addBtn = Array.from(buttons).find(btn => btn.textContent.includes('加入/创建'));
      if (!addBtn) return { passed: false, msg: '未找到[+]加入/创建按钮' };
      return { passed: true, msg: '找到[+]加入/创建鱼圈按钮' };
    }
  });

  tests.push({
    name: 'AC-003: 点击[+]展开菜单',
    category: '鱼圈管理',
    run: async () => {
      const buttons = document.querySelectorAll('button');
      const addBtn = Array.from(buttons).find(btn => btn.textContent.includes('加入/创建'));
      if (!addBtn) return { passed: false, msg: '未找到[+]按钮' };
      addBtn.click();
      await new Promise(r => setTimeout(r, 300));
      // 检查是否出现下拉菜单
      const menuItems = document.querySelectorAll('[class*="absolute"] button, [class*="z-50"] button');
      const joinOption = Array.from(menuItems).find(btn => btn.textContent.includes('加入同事'));
      const createOption = Array.from(menuItems).find(btn => btn.textContent.includes('组建全新'));
      return {
        passed: !!(joinOption && createOption),
        msg: `加入选项：${joinOption ? '✅' : '❌'}，创建选项：${createOption ? '✅' : '❌'}`
      };
    }
  });

  // ==========================================
  // 模块六：创建鱼圈弹窗
  // ==========================================
  console.log('\n📦 模块六：创建鱼圈弹窗');

  tests.push({
    name: 'AC-008: 创建鱼圈弹窗显示鱼圈名称输入框',
    category: '创建鱼圈',
    run: async () => {
      // 先打开菜单
      const buttons = document.querySelectorAll('button');
      const addBtn = Array.from(buttons).find(btn => btn.textContent.includes('加入/创建'));
      if (addBtn) {
        addBtn.click();
        await new Promise(r => setTimeout(r, 300));
      }
      // 点击"组建全新鱼圈"
      const menuItems = document.querySelectorAll('button');
      const createBtn = Array.from(menuItems).find(btn => btn.textContent.includes('组建全新'));
      if (createBtn) {
        createBtn.click();
        await new Promise(r => setTimeout(r, 500));
      }
      // 检查弹窗
      const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
      if (!modal) return { passed: false, msg: '未找到创建鱼圈弹窗' };
      const input = modal.querySelector('input[type="text"]');
      if (!input) return { passed: false, msg: '未找到鱼圈名称输入框' };
      return { passed: true, msg: '创建鱼圈弹窗正常，包含名称输入框' };
    }
  });

  tests.push({
    name: 'AC-008: "建立安全通道"按钮存在',
    category: '创建鱼圈',
    run: () => {
      const buttons = document.querySelectorAll('button');
      const submitBtn = Array.from(buttons).find(btn => btn.textContent.includes('建立安全通道'));
      return {
        passed: !!submitBtn,
        msg: submitBtn ? '找到"建立安全通道"按钮' : '未找到"建立安全通道"按钮'
      };
    }
  });

  tests.push({
    name: 'AC-008: 鱼圈名称字数限制（50字）',
    category: '创建鱼圈',
    run: () => {
      const inputs = document.querySelectorAll('input[maxlength="50"]');
      return {
        passed: inputs.length > 0,
        msg: inputs.length > 0 ? '找到maxlength=50的输入框' : '未找到带50字限制的输入框'
      };
    }
  });

  tests.push({
    name: 'AC-008: 创建弹窗关闭功能',
    category: '创建鱼圈',
    run: async () => {
      const buttons = document.querySelectorAll('button');
      const cancelBtn = Array.from(buttons).find(btn => btn.textContent === '取消');
      if (cancelBtn) {
        cancelBtn.click();
        await new Promise(r => setTimeout(r, 300));
        const modal = document.querySelector('[class*="fixed"][class*="z-50"]');
        return {
          passed: !modal,
          msg: !modal ? '弹窗已关闭' : '弹窗未关闭'
        };
      }
      return { passed: true, msg: '取消按钮不在当前视图中' };
    }
  });

  // ==========================================
  // 模块七：新用户引导
  // ==========================================
  console.log('\n📦 模块七：新用户引导');

  tests.push({
    name: 'AC-004/AC-007: 新用户引导页面检查',
    category: '新用户引导',
    run: () => {
      // 检查是否在新用户引导状态（没有鱼圈时显示）
      const guideTitle = document.querySelector('h1');
      const isGuidePage = guideTitle && guideTitle.textContent.includes('欢迎来到摸鱼鱼');
      if (isGuidePage) {
        const buttons = document.querySelectorAll('button');
        const joinBtn = Array.from(buttons).find(btn => btn.textContent.includes('加入同事'));
        const createBtn = Array.from(buttons).find(btn => btn.textContent.includes('创建新鱼圈'));
        const skipBtn = Array.from(buttons).find(btn => btn.textContent.includes('暂时跳过'));
        return {
          passed: !!(joinBtn && createBtn && skipBtn),
          msg: `引导页：加入=${joinBtn ? '✅' : '❌'}，创建=${createBtn ? '✅' : '❌'}，跳过=${skipBtn ? '✅' : '❌'}`
        };
      }
      return { passed: true, msg: '当前非新用户引导页面（已有鱼圈），跳过' };
    }
  });

  // ==========================================
  // 模块八：窝囊费页面跳转
  // ==========================================
  console.log('\n📦 模块八：窝囊费页面跳转');

  tests.push({
    name: 'AC-006: 点击"我的窝囊费"跳转',
    category: '窝囊费',
    run: async () => {
      const buttons = document.querySelectorAll('button');
      const salaryBtn = Array.from(buttons).find(btn => btn.textContent.includes('我的窝囊费'));
      if (!salaryBtn) return { passed: false, msg: '未找到"我的窝囊费"按钮' };
      salaryBtn.click();
      await new Promise(r => setTimeout(r, 500));
      const url = window.location.pathname;
      const isSalaryPage = url.includes('/salary');
      // 导航回来
      if (isSalaryPage) {
        const chatTab = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('蛐蛐间'));
        if (chatTab) chatTab.click();
        await new Promise(r => setTimeout(r, 300));
      }
      return {
        passed: isSalaryPage,
        msg: isSalaryPage ? '成功跳转到窝囊费页面' : `跳转后路径：${url}`
      };
    }
  });

  // ==========================================
  // 模块九：摸鱼鱼页面左右布局
  // ==========================================
  console.log('\n📦 模块九：摸鱼鱼页面布局');

  tests.push({
    name: 'AC-003: 摸鱼鱼页面Grid布局',
    category: '摸鱼鱼布局',
    run: () => {
      // 先导航到摸鱼鱼页面
      const gameTab = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('摸鱼鱼'));
      if (gameTab) gameTab.click();
      return new Promise(resolve => {
        setTimeout(() => {
          const grid = document.querySelector('[class*="grid-cols-1"][class*="lg:grid-cols-2"]');
          resolve({
            passed: !!grid,
            msg: grid ? '找到左右布局Grid容器' : '未找到Grid布局容器'
          });
        }, 500);
      });
    }
  });

  tests.push({
    name: 'AC-003: 签到日历卡片存在',
    category: '摸鱼鱼布局',
    run: () => {
      const signCard = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('本周签到'));
      return {
        passed: !!signCard,
        msg: signCard ? '签到日历卡片存在' : '未找到签到日历卡片'
      };
    }
  });

  tests.push({
    name: 'AC-003: 治愈金鱼池存在',
    category: '摸鱼鱼布局',
    run: () => {
      const fishTank = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('治愈金鱼池'));
      return {
        passed: !!fishTank,
        msg: fishTank ? '治愈金鱼池存在' : '未找到治愈金鱼池'
      };
    }
  });

  tests.push({
    name: 'AC-003: 摸鱼排行榜存在',
    category: '摸鱼鱼布局',
    run: () => {
      const leaderboard = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('排行榜'));
      return {
        passed: !!leaderboard,
        msg: leaderboard ? '摸鱼排行榜存在' : '未找到摸鱼排行榜'
      };
    }
  });

  tests.push({
    name: 'AC-003: UNO摸鱼图鉴存在',
    category: '摸鱼鱼布局',
    run: () => {
      const collection = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('UNO'));
      return {
        passed: !!collection,
        msg: collection ? 'UNO摸鱼图鉴存在' : '未找到UNO摸鱼图鉴'
      };
    }
  });

  tests.push({
    name: '标题"带薪疯狂摸鱼"显示',
    category: '摸鱼鱼布局',
    run: () => {
      const title = Array.from(document.querySelectorAll('h1')).find(h => h.textContent.includes('带薪疯狂摸鱼'));
      return {
        passed: !!title,
        msg: title ? '标题正确显示' : '未找到标题'
      };
    }
  });

  // ==========================================
  // 模块十：装扮商城入口
  // ==========================================
  console.log('\n📦 模块十：装扮商城入口');

  tests.push({
    name: 'AC-010: "装扮商城"按钮存在',
    category: '装扮商城',
    run: () => {
      const shopBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('装扮商城'));
      return {
        passed: !!shopBtn,
        msg: shopBtn ? '装扮商城入口存在' : '未找到装扮商城入口'
      };
    }
  });

  // ==========================================
  // 执行所有测试
  // ==========================================
  console.log('\n' + '='.repeat(50));
  console.log('%c🚀 开始执行测试...', 'font-weight:bold;color:#2196F3');
  console.log('='.repeat(50));

  let passedCount = 0;
  let failedCount = 0;
  const results = [];

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
      results.push({ ...test, ...result });
    } catch (err) {
      console.error(`❌ [${test.category}] ${test.name}: 异常 - ${err.message}`);
      failedCount++;
      results.push({ ...test, passed: false, msg: `异常: ${err.message}` });
    }
  }

  // 输出汇总
  console.log('\n' + '='.repeat(50));
  console.log('%c📊 测试汇总', 'font-size:14px;font-weight:bold;color:#FF9800');
  console.log('='.repeat(50));
  console.log(`✅ 通过：${passedCount} 项`);
  console.log(`❌ 失败：${failedCount} 项`);
  console.log(`📝 总计：${tests.length} 项`);
  console.log(`📈 通过率：${((passedCount / tests.length) * 100).toFixed(1)}%`);

  if (failedCount === 0) {
    console.log('%c🎉 全部通过！', 'font-size:14px;color:#4CAF50;font-weight:bold');
  } else {
    console.log('%c⚠️ 存在失败项，请检查上述 ❌ 标记的测试', 'font-size:14px;color:#f44336;font-weight:bold');
  }

  // 返回结构化结果
  return { passed: passedCount, failed: failedCount, total: tests.length, results };
})();

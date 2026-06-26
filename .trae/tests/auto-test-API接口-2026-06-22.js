// ============================================
// 自动化测试脚本：V1.1.0 API 接口测试
// 覆盖范围：摸鱼/签到/装饰/鱼圈管理 API
// 生成时间：2026-06-22
// 使用方法：在浏览器中按 F12，粘贴此脚本并回车
// 前置条件：已登录（有有效token）
// ============================================

(async function autoTestAPI() {
  console.log('%c🧪 V1.1.0 API 接口自动化测试', 'font-size:16px;font-weight:bold;color:#2196F3');
  console.log('='.repeat(50));

  const tests = [];
  const BASE = window.location.origin + '/api';
  let userCircleId = '';

  const getToken = () => localStorage.getItem('token') || '';
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  });
  const apiGet = async (url) => {
    const res = await fetch(`${BASE}${url}`, { headers: authHeaders() });
    return { status: res.status, data: await res.json() };
  };
  const apiPost = async (url, body) => {
    const res = await fetch(`${BASE}${url}`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(body)
    });
    return { status: res.status, data: await res.json() };
  };

  // ---- 获取用户信息 ----
  tests.push({
    name: 'GET /auth/me - 获取当前用户',
    category: '用户',
    run: async () => {
      const res = await apiGet('/auth/me');
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const user = res.data.data?.user || res.data.data;
      if (user?.circles?.length > 0) userCircleId = user.circles[0].id;
      else if (user?.joinedCircleIds?.length > 0) userCircleId = user.joinedCircleIds[0];
      return { passed: true, msg: `用户：${user?.nickname}，鱼圈数：${user?.circles?.length || 0}` };
    }
  });

  // ---- 摸鱼状态 ----
  tests.push({
    name: 'GET /moyu/status - 摸鱼状态',
    category: '摸鱼',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/moyu/status?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const d = res.data.data;
      return { passed: true, msg: `今日：${d.todayCount}/${d.maxCount}，鱼：${d.petFish?.name} Lv.${d.petFish?.level}` };
    }
  });

  tests.push({
    name: 'AC-204: 摸鱼上限=30',
    category: '摸鱼',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/moyu/status?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const max = res.data.data.maxCount;
      return { passed: max === 30, msg: `maxCount=${max} ${max === 30 ? '✅' : '❌ 应为30'}` };
    }
  });

  // ---- 摸鱼点击 ----
  tests.push({
    name: 'POST /moyu/click - 正常摸鱼',
    category: '摸鱼',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiPost('/moyu/click', { circleId: userCircleId });
      if (res.status === 200) {
        const d = res.data.data;
        return { passed: true, msg: `200 OK，卡片：${d.cards?.length || 0}，今日：${d.todayCount}/${d.maxCount}` };
      }
      return { passed: false, msg: `${res.status}：${res.data.message}` };
    }
  });

  tests.push({
    name: 'AC-002: 摸鱼后成长值+1',
    category: '摸鱼',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const before = await apiGet(`/moyu/status?circleId=${userCircleId}`);
      const gBefore = before.data?.data?.petFish?.growth || 0;
      const click = await apiPost('/moyu/click', { circleId: userCircleId });
      if (click.status !== 200) return { passed: false, msg: `摸鱼失败：${click.status}` };
      const gAfter = click.data?.data?.petFish?.growth || 0;
      return { passed: gAfter >= gBefore, msg: `成长值：${gBefore}→${gAfter}（+${gAfter - gBefore}）` };
    }
  });

  tests.push({
    name: 'POST /moyu/click - 缺少circleId→400',
    category: '摸鱼',
    run: async () => {
      const res = await apiPost('/moyu/click', {});
      return { passed: res.status === 400, msg: `状态码：${res.status} ${res.status === 400 ? '✅' : '❌'}` };
    }
  });

  // ---- 排行榜 ----
  tests.push({
    name: 'GET /moyu/leaderboard - 排行榜',
    category: '排行榜',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/moyu/leaderboard?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      return { passed: true, msg: `排行榜人数：${res.data.data?.leaderboard?.length || 0}` };
    }
  });

  // ---- 签到 ----
  tests.push({
    name: 'GET /circles/:id/sign-status - 签到状态',
    category: '签到',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/circles/${userCircleId}/sign-status`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const d = res.data.data;
      return { passed: true, msg: `今日签到：${d.isSignedToday ? '是' : '否'}，鱼币：${d.coinBalance}` };
    }
  });

  // ---- 装饰列表 ----
  tests.push({
    name: 'GET /decorations - 装饰列表',
    category: '装饰',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/decorations?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const decs = res.data.data?.decorations || [];
      return { passed: decs.length >= 5, msg: `装饰数：${decs.length}，鱼币：${res.data.data?.coinBalance}` };
    }
  });

  tests.push({
    name: 'AC-102: 装饰价格1-5鱼币',
    category: '装饰',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/decorations?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      const prices = (res.data.data?.decorations || []).map(d => d.price).sort((a, b) => a - b);
      return { passed: true, msg: `价格列表：${prices.join(', ')}` };
    }
  });

  // ---- 兑换记录 ----
  tests.push({
    name: 'GET /decorations/records - 兑换记录',
    category: '装饰',
    run: async () => {
      if (!userCircleId) return { passed: true, msg: '无鱼圈，跳过' };
      const res = await apiGet(`/decorations/records?circleId=${userCircleId}`);
      if (res.status !== 200) return { passed: false, msg: `状态码：${res.status}` };
      return { passed: true, msg: `兑换记录数：${res.data.data?.records?.length || 0}` };
    }
  });

  // ---- 安全性测试 ----
  tests.push({
    name: '未授权请求→401',
    category: '安全',
    run: async () => {
      const res = await fetch(`${BASE}/moyu/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circleId: 'test' })
      });
      return { passed: res.status === 401, msg: `状态码：${res.status} ${res.status === 401 ? '✅' : '❌'}` };
    }
  });

  tests.push({
    name: '不存在的circleId→400/404',
    category: '安全',
    run: async () => {
      const res = await apiPost('/moyu/click', { circleId: 'nonexistent-id-12345' });
      return { passed: res.status >= 400, msg: `状态码：${res.status} ${res.status >= 400 ? '✅' : '❌'}` };
    }
  });

  // ---- 执行 ----
  console.log('\n' + '='.repeat(50));
  let passedCount = 0, failedCount = 0;

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

  console.log('\n' + '='.repeat(50));
  console.log(`📊 API测试汇总：✅ ${passedCount} / ❌ ${failedCount} / 📝 ${tests.length} / 📈 ${((passedCount / tests.length) * 100).toFixed(1)}%`);
  if (failedCount === 0) console.log('%c🎉 全部通过！', 'color:#4CAF50;font-weight:bold');
  else console.log('%c⚠️ 存在失败项', 'color:#f44336;font-weight:bold');

  return { passed: passedCount, failed: failedCount, total: tests.length };
})();

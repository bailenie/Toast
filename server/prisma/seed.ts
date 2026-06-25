import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充种子数据...');

  // 预置5款装饰
  const decorations = [
    {
      id: 'deco-001',
      name: '水草',
      icon: '🌿',
      price: 5,
      description: '摇曳的水草，增添鱼缸生机',
    },
    {
      id: 'deco-002',
      name: '气泡',
      icon: '🫧',
      price: 10,
      description: '咕嘟咕嘟的小气泡',
    },
    {
      id: 'deco-003',
      name: '石头',
      icon: '🪨',
      price: 10,
      description: '圆润的鹅卵石',
    },
    {
      id: 'deco-004',
      name: '海星',
      icon: '⭐',
      price: 20,
      description: '可爱的海星装饰',
    },
    {
      id: 'deco-005',
      name: '珊瑚',
      icon: '🪸',
      price: 20,
      description: '华丽的珊瑚，鱼缸的C位装饰',
    },
  ];

  for (const decoration of decorations) {
    await prisma.decoration.upsert({
      where: { id: decoration.id },
      update: decoration,
      create: decoration,
    });
    console.log(`✓ 装饰 "${decoration.name}" (${decoration.icon}) 已创建/更新`);
  }

  console.log('种子数据填充完成！');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

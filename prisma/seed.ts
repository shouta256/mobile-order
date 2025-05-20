// prisma/seed.js

// 環境変数を読み込む（.env ファイル）
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ===== カテゴリーの初期データ =====
  const categoriesData = [
    { name: 'Burgers', description: 'Juicy burgers made to order', order: 1 },
    { name: 'Pizzas', description: 'Authentic Italian pizzas', order: 2 },
    { name: 'Drinks', description: 'Cold and refreshing beverages', order: 3 },
  ];

  for (const data of categoriesData) {
    await prisma.category.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
  }

  // カテゴリー ID を取得
  const burgerCategory = await prisma.category.findUnique({ where: { name: 'Burgers' } });
  const pizzaCategory  = await prisma.category.findUnique({ where: { name: 'Pizzas' } });
  const drinksCategory = await prisma.category.findUnique({ where: { name: 'Drinks' } });

  if (!burgerCategory || !pizzaCategory || !drinksCategory) {
    throw new Error('カテゴリーの取得に失敗しました');
  }

  // ===== メニューアイテムの初期データ =====
  const menuItemsData = [
    {
      name: 'Classic Cheeseburger',
      description: 'Beef patty with cheddar, lettuce, tomato & pickles',
      price: 8.99,
      categoryId: burgerCategory.id,
      available: true,
      featured: true,
    },
    {
      name: 'Veggie Burger',
      description: 'Grilled veggie patty with avocado spread',
      price: 9.49,
      categoryId: burgerCategory.id,
      available: true,
      featured: false,
    },
    {
      name: 'Margherita Pizza',
      description: 'Tomato, mozzarella, fresh basil',
      price: 12.99,
      categoryId: pizzaCategory.id,
      available: true,
      featured: true,
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni & cheese',
      price: 14.49,
      categoryId: pizzaCategory.id,
      available: true,
      featured: false,
    },
    {
      name: 'Cola',
      description: 'Sparkling soft drink',
      price: 1.99,
      categoryId: drinksCategory.id,
      available: true,
      featured: false,
    },
    {
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 2.99,
      categoryId: drinksCategory.id,
      available: true,
      featured: false,
    },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('✅ シードデータの投入が完了しました');
}

main()
  .catch((e) => {
    console.error('❌ シード中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

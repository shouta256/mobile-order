// prisma/seed.mjs
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // ① すでに同じ name のレコードがあるか探す
  let burger = await prisma.category.findFirst({
    where: { name: 'Burgers' }
  })

  // ② なければ作る
  if (!burger) {
    burger = await prisma.category.create({
      data: {
        name: 'Burgers',
        description: 'Juicy burgers',
        order: 1
      }
    })
  }

  // メニュー項目の投入（image は必ず文字列 URL を入れてください）
  await prisma.menuItem.upsert({
    where: { name: 'Classic Burger' },
    update: {},
    create: {
      name: 'Classic Burger',
      description: 'A tasty beef burger',
      price: 8.99,
      available: true,
      featured: true,
      categoryId: burger.id,
      image:
        'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
      thumbnail:
        'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

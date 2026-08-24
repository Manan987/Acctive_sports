const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sizes = JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']);
  const result = await prisma.product.updateMany({
    data: { sizes },
  });
  console.log('Updated', result.count, 'products → sizes: S, M, L, XL, XXL');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

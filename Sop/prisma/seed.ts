import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default categories
  const categories = [
    {
      name: "Damaged",
      description: "Items received in damaged condition"
    },
    {
      name: "Wrong",
      description: "Wrong item received by customer"
    },
    {
      name: "Counterfeit",
      description: "Suspected counterfeit or fake products"
    },
    {
      name: "Expired",
      description: "Products that have expired"
    },
    {
      name: "Empty Parcel/Swap Parcel",
      description: "Empty packages or swapped items"
    },
    {
      name: "Non Receipts",
      description: "Items not received by customer"
    },
    {
      name: "Faulty",
      description: "Defective or malfunctioning products"
    },
    {
      name: "Special SOP (Seller Dispute)",
      description: "Special cases requiring seller dispute resolution"
    }
  ]

  for (const category of categories) {
    await prisma.sopCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get categories
  const categories = await prisma.sopCategory.findMany()
  
  // Create sample SOPs
  const sampleSops = [
    {
      categoryName: "Damaged",
      title: "Damaged Item Return Process",
      content: `**DAMAGED ITEM RETURN SOP**

**Step 1: Evidence Verification**
- Review customer's evidence photos
- Check if damage is clearly visible and conclusive
- Verify packaging condition

**Step 2: Evidence Assessment**
- CONCLUSIVE: Clear damage visible, proper packaging photos
- INCONCLUSIVE: Blurry photos, insufficient angles, missing packaging shots

**Step 3: Required Evidence (if inconclusive)**
- Clear photos of damaged item from multiple angles
- Photos of original packaging
- Unboxing video (if available)

**Step 4: Action Steps**
- If conclusive: Approve return immediately
- If inconclusive: Request additional evidence
- Process refund within 24 hours of approval

**Step 5: Communication Template**
"Thank you for contacting Shopee. We've reviewed your case regarding the damaged item. [Based on evidence assessment, provide appropriate response]"`
    },
    {
      categoryName: "Wrong",
      title: "Wrong Item Received Process",
      content: `**WRONG ITEM RETURN SOP**

**Step 1: Item Verification**
- Compare ordered item with received item
- Check SKU and product details
- Verify seller information

**Step 2: Evidence Requirements**
- Photo of received item with clear product details
- Photo of order confirmation/receipt
- Comparison with original listing

**Step 3: Evidence Assessment**
- CONCLUSIVE: Clear difference between ordered and received item
- INCONCLUSIVE: Similar items, unclear product details

**Step 4: Resolution Process**
- Approve return for wrong item cases
- Arrange return shipping (seller responsibility)
- Process replacement or refund

**Step 5: Follow-up Actions**
- Monitor seller for repeated wrong item issues
- Update seller performance metrics`
    },
    {
      categoryName: "Counterfeit",
      title: "Counterfeit Product Investigation",
      content: `**COUNTERFEIT PRODUCT SOP**

**Step 1: Initial Assessment**
- Review customer's counterfeit claims
- Check product authenticity indicators
- Verify brand authorization

**Step 2: Evidence Collection**
- Detailed photos of product and packaging
- Comparison with authentic product images
- Serial numbers or authenticity codes

**Step 3: Brand Verification**
- Contact brand representative if needed
- Check official brand guidelines
- Verify authorized seller list

**Step 4: Decision Process**
- If confirmed counterfeit: Immediate removal and refund
- If inconclusive: Request expert verification
- If authentic: Provide explanation to customer

**Step 5: Seller Actions**
- Suspend seller if counterfeit confirmed
- Report to relevant authorities
- Monitor seller's other listings`
    }
  ]

  // Create admin user for SOPs
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@shopee.com" },
    update: {},
    create: {
      email: "admin@shopee.com",
      name: "Admin Shopee",
      role: "ADMIN"
    }
  })

  for (const sopData of sampleSops) {
    const category = categories.find(c => c.name === sopData.categoryName)
    if (category) {
      // Check if SOP already exists
      const existingSop = await prisma.sop.findFirst({
        where: { title: sopData.title }
      })
      
      if (!existingSop) {
        await prisma.sop.create({
          data: {
            title: sopData.title,
            content: sopData.content,
            categoryId: category.id,
            createdBy: adminUser.id
          }
        })
      }
    }
  }

  console.log('Sample SOPs created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

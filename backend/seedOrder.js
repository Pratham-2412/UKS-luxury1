const mongoose = require('mongoose');
const Subcategory = require('./models/Subcategory.model');
const SubcategoryItem = require('./models/SubcategoryItem.model');

const URI = 'mongodb+srv://uks-luxury:Uks1234@cluster0.rzmvfxo.mongodb.net/uks_luxury?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(URI).then(async () => {
  // Update Brands (Subcategories)
  const brands = await Subcategory.find().sort({ order: 1, createdAt: 1 });
  const brandsByCollection = {};
  
  for (const b of brands) {
    if (!brandsByCollection[b.collectionSlug]) {
      brandsByCollection[b.collectionSlug] = [];
    }
    brandsByCollection[b.collectionSlug].push(b);
  }

  for (const slug in brandsByCollection) {
    const list = brandsByCollection[slug];
    for (let i = 0; i < list.length; i++) {
      await Subcategory.updateOne({ _id: list[i]._id }, { $set: { order: i } });
    }
  }
  console.log('Updated order for Brands');

  // Update Items (SubcategoryItems)
  const items = await SubcategoryItem.find().sort({ order: 1, createdAt: 1 });
  const itemsByBrand = {};
  
  for (const item of items) {
    const parentId = item.parentSubcategory.toString();
    if (!itemsByBrand[parentId]) {
      itemsByBrand[parentId] = [];
    }
    itemsByBrand[parentId].push(item);
  }

  for (const parentId in itemsByBrand) {
    const list = itemsByBrand[parentId];
    for (let i = 0; i < list.length; i++) {
      await SubcategoryItem.updateOne({ _id: list[i]._id }, { $set: { order: i } });
    }
  }
  console.log('Updated order for Items');

  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

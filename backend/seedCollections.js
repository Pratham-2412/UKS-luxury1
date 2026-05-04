const mongoose = require('mongoose');
const Collection = require('./models/Collection.model');
const URI = 'mongodb+srv://uks-luxury:Uks1234@cluster0.rzmvfxo.mongodb.net/uks_luxury?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(URI).then(async () => {
  const standard = [
    {slug:'bespoke-kitchens',title:'Bespoke Kitchens',type:'Bespoke Kitchens',shortDescription:'German precision meets award-winning design.', order: 0},
    {slug:'dining-rooms',title:'Dining Rooms',type:'Dining Rooms',shortDescription:'Elegant spaces designed for unforgettable gatherings.', order: 1},
    {slug:'living-room',title:'Living Room',type:'Living Room',shortDescription:'Sophisticated comfort crafted with the finest materials.', order: 2},
    {slug:'offices',title:'Offices',type:'Offices',shortDescription:'Productivity meets elegance in our custom-designed workspaces.', order: 3},
    {slug:'bookcases',title:'Bookcases',type:'Bookcases',shortDescription:'Bespoke shelving solutions.', order: 4},
    {slug:'hinged-wardrobes',title:'Hinged Wardrobes',type:'Hinged Wardrobes',shortDescription:'Classic wardrobe design.', order: 5},
    {slug:'sliding-wardrobes',title:'Sliding Wardrobes',type:'Sliding Wardrobes',shortDescription:'Space-efficient luxury.', order: 6},
    {slug:'walk-in-closet',title:'Walk In Closet',type:'Walk In Closet',shortDescription:'Your personal dressing sanctuary.', order: 7},
    {slug:'storage-units',title:'Storage Units',type:'Storage Units',shortDescription:'Intelligent storage solutions.', order: 8}
  ];
  
  for(const s of standard) {
    await Collection.updateOne({slug: s.slug}, {$set: { order: s.order }}, {upsert: true});
  }
  
  console.log('Updated order for standard collections in MongoDB Atlas');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

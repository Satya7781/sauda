// ============================================================
// MOCK DATA — Sauda
// ============================================================

// Product image mapping — local files downloaded via fetch-images.js
var PRODUCT_IMAGES = {
  1: 'product-1.jpg',   // Fresh Palak
  2: 'product-2.jpg',   // Gobi
  3: 'product-3.jpg',   // Tamatar
  4: 'product-4.jpg',   // Doodh
  5: 'product-5.jpg',   // Dahi
  6: 'product-6.jpg',   // Paneer
  7: 'product-7.jpg',   // Aashirvaad Atta
  8: 'product-8.jpg',   // Chini
  9: 'product-9.jpg',   // Aam
  10: 'product-10.jpg',  // Kela
  11: 'product-11.jpg',  // Banarasi Silk Saree
  12: 'product-12.jpg',  // Cotton Kurta
  13: 'product-13.jpg',  // Designer Dupatta
  14: 'product-14.jpg',  // Anarkali Suit
  15: 'product-15.jpg',  // Palazzo Set
  16: 'product-16.jpg',  // Lehenga
  17: 'product-17.jpg',  // Custom Blouse
  18: 'product-18.jpg',  // Suit Stitching
  19: 'product-19.jpg',  // Mobile Cover
  20: 'product-20.jpg',  // Earphones
  21: 'product-21.jpg',  // Power Bank
  22: 'product-22.jpg',  // Mehendi Service
  23: 'product-23.jpg',  // Facial
  24: 'product-24.jpg',  // Threading
  25: 'product-25.jpg',  // AC Repair
  26: 'product-26.jpg',  // Plumbing
  27: 'product-27.jpg',  // Full Time Maid
  28: 'product-28.jpg',  // Part Time Maid
  29: 'product-29.jpg',  // Cook
  30: 'product-30.jpg',  // Baby Caretaker
  31: 'product-31.jpg',  // Elderly Caretaker
};

const CATEGORIES = [
  { id: 'clothes', name: 'Kapde', nameEn: 'Clothes', icon: 'fa-shirt', color: '#BE123C', bg: '#FFF1F2', count: 7 },
  { id: 'sabzi', name: 'Sabzi', nameEn: 'Vegetables', icon: 'fa-leaf', color: '#15803D', bg: '#F0FDF4', count: 3 },
  { id: 'dairy', name: 'Dairy', nameEn: 'Dairy', icon: 'fa-cow', color: '#0E7490', bg: '#ECFEFF', count: 3 },
  { id: 'fruit', name: 'Phal', nameEn: 'Fruits', icon: 'fa-apple-whole', color: '#C2410C', bg: '#FFF7ED', count: 2 },
  { id: 'kirana', name: 'Kirana', nameEn: 'Grocery', icon: 'fa-basket-shopping', color: '#7C3AED', bg: '#F5F3FF', count: 2 },
  { id: 'electronics', name: 'Electronics', nameEn: 'Electronics', icon: 'fa-mobile-screen', color: '#1D4ED8', bg: '#EFF6FF', count: 3 },
  { id: 'beauty', name: 'Beauty', nameEn: 'Beauty', icon: 'fa-spa', color: '#BE185D', bg: '#FDF2F8', count: 3 },
  { id: 'services', name: 'Seva', nameEn: 'Services', icon: 'fa-wrench', color: '#A16207', bg: '#FEFCE8', count: 7 },
];

const USERS = {
  you: { id: 'you', name: 'Aap', initials: 'A', color: '#B8680F', locality: 'Sultanpuri', relation: 'You' },
  priya: { id: 'priya', name: 'Priya Sharma', initials: 'PS', color: '#EC4899', locality: 'Sultanpuri', relation: 'Padosan (Neighbor)' },
  amit: { id: 'amit', name: 'Amit Verma', initials: 'AV', color: '#3B82F6', locality: 'Sultanpuri', relation: 'Colleague' },
  sunita: { id: 'sunita', name: 'Sunita Devi', initials: 'SD', color: '#8B5CF6', locality: 'Sultanpuri', relation: 'Building Aunty' },
  vikram: { id: 'vikram', name: 'Vikram Singh', initials: 'VS', color: '#F97316', locality: 'Sultanpuri', relation: 'Dost (Friend)' },
  meena: { id: 'meena', name: 'Meena Aunty', initials: 'MA', color: '#14B8A6', locality: 'Sultanpuri', relation: 'Landlady' },
};

const SELLERS = {
  ramesh: { id: 'ramesh', name: 'Ramesh Kumar', shop: 'Ramesh Sabzi Wala', initials: 'RK', color: '#15803D', locality: 'Sultanpuri', yearsActive: 8, aadhaarVerified: true, trustedNeighbors: 15, vouchedBy: 'priya', vouchRelation: 'Regular customer — 3 saal', category: 'sabzi', isLive: true, distance: '400m' },
  suresh: { id: 'suresh', name: 'Suresh Patel', shop: 'Suresh Dairy Farm', initials: 'SP', color: '#0E7490', locality: 'Sultanpuri', yearsActive: 12, aadhaarVerified: true, trustedNeighbors: 22, vouchedBy: 'sunita', vouchRelation: 'Family friend — 7 saal', category: 'dairy', isLive: true, distance: '600m' },
  kavita: { id: 'kavita', name: 'Kavita Joshi', shop: 'Joshi Kirana Store', initials: 'KJ', color: '#7C3AED', locality: 'Sultanpuri', yearsActive: 5, aadhaarVerified: true, trustedNeighbors: 18, vouchedBy: 'amit', vouchRelation: 'Daily customer — 2 saal', category: 'kirana', isLive: false, distance: '300m' },
  mohan: { id: 'mohan', name: 'Mohan Lal', shop: 'Mohan Fruit Wala', initials: 'ML', color: '#C2410C', locality: 'Sultanpuri', yearsActive: 15, aadhaarVerified: true, trustedNeighbors: 30, vouchedBy: 'vikram', vouchRelation: 'Bachpan ka dost — 15 saal', category: 'fruit', isLive: true, distance: '500m' },
  neeta: { id: 'neeta', name: 'Neeta Gupta', shop: 'Laxmi Saree Center', initials: 'NG', color: '#BE123C', locality: 'Sultanpuri', yearsActive: 10, aadhaarVerified: true, trustedNeighbors: 25, vouchedBy: 'priya', vouchRelation: 'Best customer — 5 saal', category: 'clothes', isLive: true, distance: '250m' },
  arjun: { id: 'arjun', name: 'Arjun Malhotra', shop: 'Fashion Hub', initials: 'AM', color: '#E11D48', locality: 'Sultanpuri', yearsActive: 6, aadhaarVerified: true, trustedNeighbors: 14, vouchedBy: 'amit', vouchRelation: 'College dost — 8 saal', category: 'clothes', isLive: true, distance: '350m' },
  seema: { id: 'seema', name: 'Seema Devi', shop: 'Seema Stitching', initials: 'SD', color: '#DB2777', locality: 'Sultanpuri', yearsActive: 9, aadhaarVerified: false, trustedNeighbors: 11, vouchedBy: 'meena', vouchRelation: 'Relative — 9 saal', category: 'clothes', isLive: true, distance: '180m' },
  rajesh: { id: 'rajesh', name: 'Rajesh Kumar', shop: 'Rajesh Mobile Corner', initials: 'RM', color: '#1D4ED8', locality: 'Sultanpuri', yearsActive: 4, aadhaarVerified: true, trustedNeighbors: 10, vouchedBy: 'vikram', vouchRelation: 'Shop neighbor — 4 saal', category: 'electronics', isLive: true, distance: '450m' },
  poonam: { id: 'poonam', name: 'Poonam Sharma', shop: 'Poonam Beauty Parlour', initials: 'PS2', color: '#BE185D', locality: 'Sultanpuri', yearsActive: 7, aadhaarVerified: true, trustedNeighbors: 20, vouchedBy: 'sunita', vouchRelation: 'Sister-in-law — 7 saal', category: 'beauty', isLive: true, distance: '300m' },
  deepak: { id: 'deepak', name: 'Deepak Verma', shop: 'Deepak Repair Center', initials: 'DV', color: '#A16207', locality: 'Sultanpuri', yearsActive: 11, aadhaarVerified: true, trustedNeighbors: 16, vouchedBy: 'amit', vouchRelation: 'Gym buddy — 3 saal', category: 'services', isLive: true, distance: '500m' },
  household: { id: 'household', name: 'Ghar Ka Saathi', shop: 'Ghar Ka Saathi', initials: 'GK', color: '#059669', locality: 'Sultanpuri', yearsActive: 5, aadhaarVerified: true, trustedNeighbors: 18, vouchedBy: 'meena', vouchRelation: 'Verified agency — 5 saal', category: 'services', isLive: true, distance: '200m' },
};

const PRODUCTS = [
  { id: 1, title: 'Fresh Palak', titleHi: 'Taza Palak', price: 20, unit: 'gaddi', seller: 'ramesh', category: 'sabzi', stock: 25 },
  { id: 2, title: 'Gobi', titleHi: 'Bandh Gobi', price: 40, unit: 'pcs', seller: 'ramesh', category: 'sabzi', stock: 15 },
  { id: 3, title: 'Tamatar', titleHi: 'Desi Tamatar', price: 30, unit: 'kg', seller: 'ramesh', category: 'sabzi', stock: 35 },
  { id: 4, title: 'Doodh', titleHi: 'Taza Doodh', price: 60, unit: 'litre', seller: 'suresh', category: 'dairy', stock: 50 },
  { id: 5, title: 'Dahi', titleHi: 'Makhan Dahi', price: 50, unit: 'kg', seller: 'suresh', category: 'dairy', stock: 20 },
  { id: 6, title: 'Paneer', titleHi: 'Taza Paneer', price: 90, unit: '200g', seller: 'suresh', category: 'dairy', stock: 15 },
  { id: 7, title: 'Aashirvaad Atta', titleHi: 'Atta', price: 45, unit: 'kg', seller: 'kavita', category: 'kirana', stock: 100 },
  { id: 8, title: 'Chini', titleHi: 'Madhur Chini', price: 42, unit: 'kg', seller: 'kavita', category: 'kirana', stock: 80 },
  { id: 9, title: 'Aam', titleHi: 'Ratnagiri Aam', price: 80, unit: 'dozen', seller: 'mohan', category: 'fruit', stock: 30 },
  { id: 10, title: 'Kela', titleHi: 'Bhuvel Kela', price: 40, unit: 'dozen', seller: 'mohan', category: 'fruit', stock: 40 },
  { id: 11, title: 'Banarasi Silk Saree', titleHi: 'Banarasi Saree', price: 2500, unit: 'pcs', seller: 'neeta', category: 'clothes', stock: 8 },
  { id: 12, title: 'Cotton Kurta', titleHi: 'Suthan Kurta', price: 450, unit: 'pcs', seller: 'neeta', category: 'clothes', stock: 20 },
  { id: 13, title: 'Designer Dupatta', titleHi: 'Designar Dupatta', price: 350, unit: 'pcs', seller: 'neeta', category: 'clothes', stock: 15 },
  { id: 14, title: 'Anarkali Suit', titleHi: 'Anarkali Suit', price: 1200, unit: 'pcs', seller: 'arjun', category: 'clothes', stock: 12 },
  { id: 15, title: 'Palazzo Set', titleHi: 'Palajo Set', price: 600, unit: 'set', seller: 'arjun', category: 'clothes', stock: 18 },
  { id: 16, title: 'Lehenga', titleHi: 'Designar Lehenga', price: 3500, unit: 'pcs', seller: 'arjun', category: 'clothes', stock: 5 },
  { id: 17, title: 'Custom Blouse', titleHi: 'Blouse Silai', price: 250, unit: 'pcs', seller: 'seema', category: 'clothes', stock: 10 },
  { id: 18, title: 'Suit Stitching', titleHi: 'Suit Silai', price: 400, unit: 'pcs', seller: 'seema', category: 'clothes', stock: 8 },
  { id: 19, title: 'Mobile Cover', titleHi: 'Mobile Kaver', price: 150, unit: 'pcs', seller: 'rajesh', category: 'electronics', stock: 50 },
  { id: 20, title: 'Earphones', titleHi: 'Iarphon', price: 299, unit: 'pcs', seller: 'rajesh', category: 'electronics', stock: 30 },
  { id: 21, title: 'Power Bank', titleHi: 'Pavar Bank', price: 500, unit: 'pcs', seller: 'rajesh', category: 'electronics', stock: 20 },
  { id: 22, title: 'Mehendi Service', titleHi: 'Mehandi', price: 200, unit: 'session', seller: 'poonam', category: 'beauty', stock: 10 },
  { id: 23, title: 'Facial', titleHi: 'Feshal', price: 300, unit: 'session', seller: 'poonam', category: 'beauty', stock: 8 },
  { id: 24, title: 'Threading', titleHi: 'Threading', price: 50, unit: 'session', seller: 'poonam', category: 'beauty', stock: 20 },
  { id: 25, title: 'AC Repair', titleHi: 'AC Repair', price: 500, unit: 'visit', seller: 'deepak', category: 'services', stock: 5 },
  { id: 26, title: 'Plumbing', titleHi: 'Nal Repair', price: 300, unit: 'visit', seller: 'deepak', category: 'services', stock: 8 },
  { id: 27, title: 'Full Time Maid', titleHi: 'Purana kalak Naukarani', price: 8000, unit: 'month', seller: 'household', category: 'services', stock: 3 },
  { id: 28, title: 'Part Time Maid', titleHi: 'Part Time Naukarani', price: 4000, unit: 'month', seller: 'household', category: 'services', stock: 5 },
  { id: 29, title: 'Cook', titleHi: 'Rasiya', price: 6000, unit: 'month', seller: 'household', category: 'services', stock: 2 },
  { id: 30, title: 'Baby Caretaker', titleHi: 'Baccho ki dekhbhal', price: 5000, unit: 'month', seller: 'household', category: 'services', stock: 2 },
  { id: 31, title: 'Elderly Caretaker', titleHi: 'B Zurgo ki dekhbhal', price: 5500, unit: 'month', seller: 'household', category: 'services', stock: 2 },
];



const VOUCHES = [
  { from: 'you', to: 'priya', relation: 'Padosan — 5 saal' },
  { from: 'you', to: 'amit', relation: 'Colleague — 3 saal' },
  { from: 'you', to: 'sunita', relation: 'Building Aunty — 10 saal' },
  { from: 'you', to: 'vikram', relation: 'Dost — 8 saal' },
  { from: 'you', to: 'meena', relation: 'Landlady — 6 saal' },
  { from: 'priya', to: 'ramesh', relation: 'Regular customer — 3 saal' },
  { from: 'priya', to: 'neeta', relation: 'Best customer — 5 saal' },
  { from: 'sunita', to: 'suresh', relation: 'Family friend — 7 saal' },
  { from: 'sunita', to: 'poonam', relation: 'Sister-in-law — 7 saal' },
  { from: 'amit', to: 'kavita', relation: 'Daily customer — 2 saal' },
  { from: 'amit', to: 'arjun', relation: 'College dost — 8 saal' },
  { from: 'amit', to: 'deepak', relation: 'Gym buddy — 3 saal' },
  { from: 'vikram', to: 'mohan', relation: 'Bachpan ka dost — 15 saal' },
  { from: 'vikram', to: 'rajesh', relation: 'Shop neighbor — 4 saal' },
  { from: 'meena', to: 'seema', relation: 'Relative — 9 saal' },
];

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
  you: { id: 'you', name: 'Aap', initials: 'A', color: '#B8680F', locality: 'Lalghati, Bhopal', relation: 'You' },
  priya: { id: 'priya', name: 'Priya Sharma', initials: 'PS', color: '#EC4899', locality: 'Lalghati, Bhopal', relation: 'Padosan (Neighbor)' },
  amit: { id: 'amit', name: 'Amit Verma', initials: 'AV', color: '#3B82F6', locality: 'Lalghati, Bhopal', relation: 'Colleague' },
  sunita: { id: 'sunita', name: 'Sunita Devi', initials: 'SD', color: '#8B5CF6', locality: 'Lalghati, Bhopal', relation: 'Building Aunty' },
  vikram: { id: 'vikram', name: 'Vikram Singh', initials: 'VS', color: '#F97316', locality: 'Lalghati, Bhopal', relation: 'Dost (Friend)' },
  meena: { id: 'meena', name: 'Meena Aunty', initials: 'MA', color: '#14B8A6', locality: 'Lalghati, Bhopal', relation: 'Landlady' },
};

const SELLERS = {
  ramesh: { id: 'ramesh', name: 'Ramesh Kumar', shop: 'Ramesh Sabzi Wala', initials: 'RK', color: '#15803D', locality: 'Lalghati, Bhopal', yearsActive: 8, aadhaarVerified: true, trustedNeighbors: 15, vouchedBy: 'priya', vouchRelation: 'Regular customer — 3 saal', category: 'sabzi', isLive: true, distance: '400m' },
  suresh: { id: 'suresh', name: 'Suresh Patel', shop: 'Suresh Dairy Farm', initials: 'SP', color: '#0E7490', locality: 'Lalghati, Bhopal', yearsActive: 12, aadhaarVerified: true, trustedNeighbors: 22, vouchedBy: 'sunita', vouchRelation: 'Family friend — 7 saal', category: 'dairy', isLive: true, distance: '600m' },
  kavita: { id: 'kavita', name: 'Kavita Joshi', shop: 'Joshi Kirana Store', initials: 'KJ', color: '#7C3AED', locality: 'Lalghati, Bhopal', yearsActive: 5, aadhaarVerified: true, trustedNeighbors: 18, vouchedBy: 'amit', vouchRelation: 'Daily customer — 2 saal', category: 'kirana', isLive: false, distance: '300m' },
  mohan: { id: 'mohan', name: 'Mohan Lal', shop: 'Mohan Fruit Wala', initials: 'ML', color: '#C2410C', locality: 'Indiranagar, Lucknow', yearsActive: 15, aadhaarVerified: true, trustedNeighbors: 30, vouchedBy: 'vikram', vouchRelation: 'Bachpan ka dost — 15 saal', category: 'fruit', isLive: true, distance: '500m' },
  neeta: { id: 'neeta', name: 'Neeta Gupta', shop: 'Laxmi Saree Center', initials: 'NG', color: '#BE123C', locality: 'Lalghati, Bhopal', yearsActive: 10, aadhaarVerified: true, trustedNeighbors: 25, vouchedBy: 'priya', vouchRelation: 'Best customer — 5 saal', category: 'clothes', isLive: true, distance: '250m' },
  arjun: { id: 'arjun', name: 'Arjun Malhotra', shop: 'Fashion Hub', initials: 'AM', color: '#E11D48', locality: 'Indiranagar, Lucknow', yearsActive: 6, aadhaarVerified: true, trustedNeighbors: 14, vouchedBy: 'amit', vouchRelation: 'College dost — 8 saal', category: 'clothes', isLive: true, distance: '350m' },
  seema: { id: 'seema', name: 'Seema Devi', shop: 'Seema Stitching', initials: 'SD', color: '#DB2777', locality: 'Lalghati, Bhopal', yearsActive: 9, aadhaarVerified: false, trustedNeighbors: 11, vouchedBy: 'meena', vouchRelation: 'Relative — 9 saal', category: 'clothes', isLive: true, distance: '180m' },
  rajesh: { id: 'rajesh', name: 'Rajesh Kumar', shop: 'Rajesh Mobile Corner', initials: 'RM', color: '#1D4ED8', locality: 'Kharadi, Pune', yearsActive: 4, aadhaarVerified: true, trustedNeighbors: 10, vouchedBy: 'vikram', vouchRelation: 'Shop neighbor — 4 saal', category: 'electronics', isLive: true, distance: '450m' },
  poonam: { id: 'poonam', name: 'Poonam Sharma', shop: 'Poonam Beauty Parlour', initials: 'PS2', color: '#BE185D', locality: 'Kharadi, Pune', yearsActive: 7, aadhaarVerified: true, trustedNeighbors: 20, vouchedBy: 'sunita', vouchRelation: 'Sister-in-law — 7 saal', category: 'beauty', isLive: true, distance: '300m' },
  deepak: { id: 'deepak', name: 'Deepak Verma', shop: 'Deepak Repair Center', initials: 'DV', color: '#A16207', locality: 'T. Nagar, Chennai', yearsActive: 11, aadhaarVerified: true, trustedNeighbors: 16, vouchedBy: 'amit', vouchRelation: 'Gym buddy — 3 saal', category: 'services', isLive: true, distance: '500m' },
  household: { id: 'household', name: 'Ghar Ka Saathi', shop: 'Ghar Ka Saathi', initials: 'GK', color: '#059669', locality: 'Lalghati, Bhopal', yearsActive: 5, aadhaarVerified: true, trustedNeighbors: 18, vouchedBy: 'meena', vouchRelation: 'Verified agency — 5 saal', category: 'services', isLive: true, distance: '200m' },
};

// SELLER_DIRECTORY — all known shops in every locality, both registered & unregistered
// registered: true means this shop has a seller entry in SELLERS (sellerId links to it)
// registered: false means the shop exists in real life but is not on Sauda yet
const SELLER_DIRECTORY = [
  // ── Lalghati, Bhopal ──
  { locality: 'Lalghati, Bhopal', shop: 'Ramesh Sabzi Wala', category: 'sabzi', registered: true, sellerId: 'ramesh' },
  { locality: 'Lalghati, Bhopal', shop: 'Suresh Dairy Farm', category: 'dairy', registered: true, sellerId: 'suresh' },
  { locality: 'Lalghati, Bhopal', shop: 'Joshi Kirana Store', category: 'kirana', registered: true, sellerId: 'kavita' },
  { locality: 'Lalghati, Bhopal', shop: 'Laxmi Saree Center', category: 'clothes', registered: true, sellerId: 'neeta' },
  { locality: 'Lalghati, Bhopal', shop: 'Seema Stitching', category: 'clothes', registered: true, sellerId: 'seema' },
  { locality: 'Lalghati, Bhopal', shop: 'Ghar Ka Saathi', category: 'services', registered: true, sellerId: 'household' },
  { locality: 'Lalghati, Bhopal', shop: 'Gupta Cloth House', category: 'clothes', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Sharma Saree Centre', category: 'clothes', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Bansal Readymade Store', category: 'clothes', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Tiwari Sabzi Bhandar', category: 'sabzi', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Verma General Store', category: 'kirana', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Shahjahan Dairy', category: 'dairy', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Sahu Mobile Point', category: 'electronics', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Gupta Beauty Salon', category: 'beauty', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Patel Fruit Corner', category: 'fruit', registered: false },
  { locality: 'Lalghati, Bhopal', shop: 'Rai Electrical Repair', category: 'services', registered: false },

  // ── Indiranagar, Lucknow ──
  { locality: 'Indiranagar, Lucknow', shop: 'Mohan Fruit Wala', category: 'fruit', registered: true, sellerId: 'mohan' },
  { locality: 'Indiranagar, Lucknow', shop: 'Fashion Hub', category: 'clothes', registered: true, sellerId: 'arjun' },
  { locality: 'Indiranagar, Lucknow', shop: 'Srivastava Saree Gallery', category: 'clothes', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Chauhan Kirana Store', category: 'kirana', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Pandey Sabzi Mandi', category: 'sabzi', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Verma Dairy Products', category: 'dairy', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Kapoor Mobile Zone', category: 'electronics', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Malhotra Beauty Point', category: 'beauty', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Yadav Repair Shop', category: 'services', registered: false },
  { locality: 'Indiranagar, Lucknow', shop: 'Tiwari Fruit Market', category: 'fruit', registered: false },

  // ── Kharadi, Pune ──
  { locality: 'Kharadi, Pune', shop: 'Rajesh Mobile Corner', category: 'electronics', registered: true, sellerId: 'rajesh' },
  { locality: 'Kharadi, Pune', shop: 'Poonam Beauty Parlour', category: 'beauty', registered: true, sellerId: 'poonam' },
  { locality: 'Kharadi, Pune', shop: 'Joshi Cloth House', category: 'clothes', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Patil Sabzi Depot', category: 'sabzi', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Kulkarni Dairy', category: 'dairy', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Deshmukh Grocery', category: 'kirana', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Shinde Electronics', category: 'electronics', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Mane Beauty Center', category: 'beauty', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Jadhav Repair Works', category: 'services', registered: false },
  { locality: 'Kharadi, Pune', shop: 'Gavde Fresh Fruits', category: 'fruit', registered: false },

  // ── T. Nagar, Chennai ──
  { locality: 'T. Nagar, Chennai', shop: 'Deepak Repair Center', category: 'services', registered: true, sellerId: 'deepak' },
  { locality: 'T. Nagar, Chennai', shop: 'Murugan Textiles', category: 'clothes', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Kumar Cloth Store', category: 'clothes', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Rajan Fancy Sarees', category: 'clothes', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Subramaniam Kirana', category: 'kirana', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Annamalai Dairy', category: 'dairy', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Murugan Sabzi Stall', category: 'sabzi', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Krishna Electronics', category: 'electronics', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Priya Beauty Centre', category: 'beauty', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Pandian Fruit Shop', category: 'fruit', registered: false },
  { locality: 'T. Nagar, Chennai', shop: 'Velavan Repair Service', category: 'services', registered: false },

  // ── Koramangala, Bangalore ──
  { locality: 'Koramangala, Bangalore', shop: 'Reddy Fashion Studio', category: 'clothes', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Nagendra Sabzi Market', category: 'sabzi', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Krishnappa Dairy Farm', category: 'dairy', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Murthy Groceries', category: 'kirana', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Shetty Electronics', category: 'electronics', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Anita Beauty Salon', category: 'beauty', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Venkatesh Repair Center', category: 'services', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Gowda Fruit Stall', category: 'fruit', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Nayaka Cloth House', category: 'clothes', registered: false },
  { locality: 'Koramangala, Bangalore', shop: 'Mohan Readymade Store', category: 'clothes', registered: false },

  // ── Salt Lake, Kolkata ──
  { locality: 'Salt Lake, Kolkata', shop: 'Banerjee Saree Bhandar', category: 'clothes', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Mukherjee Sabji Bazaar', category: 'sabzi', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Das Dairy & Sweets', category: 'dairy', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Chakraborty General Store', category: 'kirana', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Bose Mobile Gallery', category: 'electronics', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Sen Beauty Parlour', category: 'beauty', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Ghosh Repair Service', category: 'services', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Roy Fruit Centre', category: 'fruit', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Saha Fancy Cloth House', category: 'clothes', registered: false },
  { locality: 'Salt Lake, Kolkata', shop: 'Dutta Readymade Store', category: 'clothes', registered: false },

  // ── Vastrapur, Ahmedabad ──
  { locality: 'Vastrapur, Ahmedabad', shop: 'Shah Textiles', category: 'clothes', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Patel Sabzi Mart', category: 'sabzi', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Desai Dairy Products', category: 'dairy', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Mehta Kirana Store', category: 'kirana', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Patel Electronics', category: 'electronics', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Shah Beauty Parlour', category: 'beauty', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Joshi Repair Center', category: 'services', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Trivedi Fruit Shop', category: 'fruit', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Rathod Readymade Store', category: 'clothes', registered: false },
  { locality: 'Vastrapur, Ahmedabad', shop: 'Solanki Saree House', category: 'clothes', registered: false },

  // ── Malviya Nagar, Jaipur ──
  { locality: 'Malviya Nagar, Jaipur', shop: 'Sharma Cloth Market', category: 'clothes', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Gupta Sabzi Bhandar', category: 'sabzi', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Verma Dairy & Sweets', category: 'dairy', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Bhardwaj General Store', category: 'kirana', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Meena Electronics', category: 'electronics', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Jain Beauty Centre', category: 'beauty', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Saxena Repair Works', category: 'services', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Choudhary Fruit Shop', category: 'fruit', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Agarwal Fancy Sarees', category: 'clothes', registered: false },
  { locality: 'Malviya Nagar, Jaipur', shop: 'Khandelwal Readymade', category: 'clothes', registered: false },
];

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
  { id: 27, title: 'Full Time Maid', titleHi: 'Poori naukarani', price: 8000, unit: 'month', seller: 'household', category: 'services', stock: 3 },
  { id: 28, title: 'Part Time Maid', titleHi: 'Aadhi naukarani', price: 4000, unit: 'month', seller: 'household', category: 'services', stock: 5 },
  { id: 29, title: 'Cook', titleHi: 'Rasiya', price: 6000, unit: 'month', seller: 'household', category: 'services', stock: 2 },
  { id: 30, title: 'Baby Caretaker', titleHi: 'Baccho ki dekhbhal', price: 5000, unit: 'month', seller: 'household', category: 'services', stock: 2 },
  { id: 31, title: 'Elderly Caretaker', titleHi: 'Buzurgo ki dekhbhal', price: 5500, unit: 'month', seller: 'household', category: 'services', stock: 2 },
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

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
  {   id: 'clothes',   name: 'कपड़े',   nameEn: 'Clothes',   nameMr: 'कपडे',   nameBn: 'জামাকাপড়',   nameTa: 'ஆடைகள்',   nameTe: 'బట్టలు',   nameGu: 'કપડાં',   namePa: 'ਕੱਪੜੇ',   nameKn: 'ಬಟ್ಟೆ',   nameMl: 'വസ്ത്രങ്ങൾ',   nameOr: 'ପୋଷାକ',   nameUr: 'کپڑے',   nameAs: 'কাপোৰ',   nameKs: 'کٔپڑٕ',   nameKok: 'कपडे',   nameMai: 'कपड़ा',   nameSd: 'ڪپڙا',   nameNe: 'लुगा',   nameSa: 'वस्त्राणि',   nameSat: 'ᱞᱩᱜᱽᱲᱤ',   nameBrx: 'बाडिनफोर',   nameDoi: 'कपड़े',   icon: 'fa-shirt',   color: '#BE123C',   bg: '#FFF1F2',   count: 7 },
  {   id: 'sabzi',   name: 'सब्ज़ी',   nameEn: 'Vegetables',   nameMr: 'भाजी',   nameBn: 'শাকসবজি',   nameTa: 'காய்கறிகள்',   nameTe: 'కూరగాయలు',   nameGu: 'શાકભાજી',   namePa: 'ਸਬਜ਼ੀਆਂ',   nameKn: 'ತರಕಾರಿಗಳು',   nameMl: 'പച്ചക്കറികൾ',   nameOr: 'ପନିପରିବା',   nameUr: 'سبزیاں',   nameAs: 'পাচলি',   nameKs: 'شَبزٕ',   nameKok: 'भाज्यो',   nameMai: 'सब्जी',   nameSd: 'ڀاڄيون',   nameNe: 'तरकारी',   nameSa: 'शाकानि',   nameSat: 'ᱟᱹᱠᱷᱟᱹ',   nameBrx: 'आखाय',   nameDoi: 'सब्जी',   icon: 'fa-leaf',   color: '#15803D',   bg: '#F0FDF4',   count: 3 },
  {   id: 'dairy',   name: 'डेयरी',   nameEn: 'Dairy',   nameMr: 'दुग्धजन्य',   nameBn: 'দুগ্ধ',   nameTa: 'பால் பொருட்கள்',   nameTe: 'పాల ఉత్పత్తులు',   nameGu: 'ડેરી',   namePa: 'ਡੇਅਰੀ',   nameKn: 'ಡೈರಿ',   nameMl: 'പാലുൽപ്പന്നങ്ങൾ',   nameOr: 'ଦୁଗ୍ଧ',   nameUr: 'ڈیری',   nameAs: 'দুগ্ধ',   nameKs: 'ڈَیری',   nameKok: 'डेअरी',   nameMai: 'दुग्ध',   nameSd: 'ڊيري',   nameNe: 'दुग्ध',   nameSa: 'दुग्धम्',   nameSat: 'ᱟᱛᱳ',   nameBrx: 'गोरै',   nameDoi: 'डेयरी',   icon: 'fa-cow',   color: '#0E7490',   bg: '#ECFEFF',   count: 3 },
  {   id: 'fruit',   name: 'फल',   nameEn: 'Fruits',   nameMr: 'फळे',   nameBn: 'ফল',   nameTa: 'பழங்கள்',   nameTe: 'పండ్లు',   nameGu: 'ફળો',   namePa: 'ਫਲ',   nameKn: 'ಹಣ್ಣುಗಳು',   nameMl: 'പഴങ്ങൾ',   nameOr: 'ଫଳ',   nameUr: 'پھل',   nameAs: 'ফল',   nameKs: 'پھَل',   nameKok: 'फळां',   nameMai: 'फल',   nameSd: 'ميوو',   nameNe: 'फलफूल',   nameSa: 'फलानि',   nameSat: 'ᱡᱚ',   nameBrx: 'थैलाय',   nameDoi: 'फल',   icon: 'fa-apple-whole',   color: '#C2410C',   bg: '#FFF7ED',   count: 2 },
  {   id: 'kirana',   name: 'किराना',   nameEn: 'Grocery',   nameMr: 'किराणा',   nameBn: 'মুদি',   nameTa: 'மளிகை',   nameTe: 'కిరాణా',   nameGu: 'કરિયાણું',   namePa: 'ਕਿਰਾਨਾ',   nameKn: 'ಕಿರಾಣಿ',   nameMl: 'പലചരക്ക്',   nameOr: 'କିରାନା',   nameUr: 'کریانہ',   nameAs: 'মুদি',   nameKs: 'کِرینہٕ',   nameKok: 'किराणें',   nameMai: 'किराना',   nameSd: 'گروسري',   nameNe: 'किराना',   nameSa: 'खाद्यसामग्री',   nameSat: 'ᱠᱤᱨᱟᱬᱟ',   nameBrx: 'खाद्य',   nameDoi: 'किराना',   icon: 'fa-basket-shopping',   color: '#7C3AED',   bg: '#F5F3FF',   count: 2 },
  {   id: 'electronics',   name: 'इलेक्ट्रॉनिक्स',   nameEn: 'Electronics',   nameMr: 'इलेक्ट्रॉनिक्स',   nameBn: 'ইলেকট্রনিক্স',   nameTa: 'மின்னணுவியல்',   nameTe: 'ఎలక్ట్రానిక్స్',   nameGu: 'ઇલેક્ટ્રોનિક્સ',   namePa: 'ਇਲੈਕਟ੍ਰਾਨਿਕਸ',   nameKn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್',   nameMl: 'ഇലക്ട്രോണിക്സ്',   nameOr: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ସ',   nameUr: 'الیکٹرانکس',   nameAs: 'ইলেক্টনিক্স',   nameKs: 'آلہ برقی',   nameKok: 'इलेक्ट्रॉनिक्स',   nameMai: 'इलेक्ट्रॉनिक्स',   nameSd: 'اليڪٽرانڪس',   nameNe: 'इलेक्ट्रनिक्स',   nameSa: 'विद्युदुपकरणानि',   nameSat: 'ᱤᱞᱮᱠᱴᱨᱚᱱᱤᱠᱥ',   nameBrx: 'इलेक्ट्रॉनिक्स',   nameDoi: 'इलेक्ट्रॉनिक्स',   icon: 'fa-mobile-screen',   color: '#1D4ED8',   bg: '#EFF6FF',   count: 3 },
  {   id: 'beauty',   name: 'सौंदर्य',   nameEn: 'Beauty',   nameMr: 'सौंदर्य',   nameBn: 'সৌন্দর্য',   nameTa: 'அழகு',   nameTe: 'అందం',   nameGu: 'સુંદરતા',   namePa: 'ਸੁੰਦਰਤਾ',   nameKn: 'ಸೌಂದರ್ಯ',   nameMl: 'സൗന്ദര്യം',   nameOr: 'ସୌନ୍ଦର୍ଯ୍ୟ',   nameUr: 'خوبصورتی',   nameAs: 'সৌন্দর্য',   nameKs: 'خوبصورتی',   nameKok: 'सोबीकपण',   nameMai: 'सौंदर्य',   nameSd: 'خوبصورتي',   nameNe: 'सौन्दर्य',   nameSa: 'सौन्दर्यम्',   nameSat: 'ᱪᱷᱚᱵᱤ',   nameBrx: 'मोजाङ',   nameDoi: 'सोण्डर्य',   icon: 'fa-spa',   color: '#BE185D',   bg: '#FDF2F8',   count: 3 },
  {   id: 'services',   name: 'सेवाएं',   nameEn: 'Services',   nameMr: 'सेवा',   nameBn: 'সেবা',   nameTa: 'சேவைகள்',   nameTe: 'సేవలు',   nameGu: 'સેવાઓ',   namePa: 'ਸੇਵਾਵਾਂ',   nameKn: 'ಸೇವೆಗಳು',   nameMl: 'സേവനങ്ങൾ',   nameOr: 'ସେବା',   nameUr: 'خدمات',   nameAs: 'সেৱা',   nameKs: 'خدمات',   nameKok: 'सेवा',   nameMai: 'सेवा',   nameSd: 'خدمتون',   nameNe: 'सेवाहरू',   nameSa: 'सेवाः',   nameSat: 'ᱥᱮᱵᱟ',   nameBrx: 'सेवा',   nameDoi: 'सेवाएं',   icon: 'fa-wrench',   color: '#A16207',   bg: '#FEFCE8',   count: 7 },
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
  {   id: 1,   title: 'Fresh Palak',   titleHi: 'ताज़ा पालक',   titleEn: 'Fresh Spinach',   titleMr: 'ताजी पालक',   titleBn: 'তাজা পালং শাক',   titleTa: 'புதிய கீரை',   titleTe: 'తాజా పాలకూర',   titleGu: 'તાજી પાલક',   titlePa: 'ਤਾਜ਼ੀ ਪਾਲਕ',   titleKn: 'ತಾಜಾ ಪಾಲಕ್ ಸೊಪ್ಪು',   titleMl: 'പുതിയ ചീര',   titleOr: 'ତାଜା ପାଳଙ୍ଗ',   titleUr: 'تازہ پالک',   titleAs: 'তাজা পালেঙ',   titleKs: 'تازٕ پالک',   titleKok: 'ताजी पालक',   titleMai: 'ताजा पालक',   titleSd: 'تازو پالڪ',   titleNe: 'ताजा पालक',   titleSa: 'नवीनं पालक्यम्',   titleSat: 'ᱛᱟᱡᱟ ᱥᱟᱠᱟᱢ',   titleBrx: 'गोदान पालक',   titleDoi: 'ताजा पालक',   price: 20,   unit: 'gaddi',   seller: 'ramesh',   category: 'sabzi',   stock: 25 },
  {   id: 2,   title: 'Gobi',   titleHi: 'फूलगोभी',   titleEn: 'Cauliflower',   titleMr: 'फुलकोबी',   titleBn: 'ফুলকপি',   titleTa: 'காலிஃபிளவர்',   titleTe: 'కాలీఫ్లవర్',   titleGu: 'ફૂલકોબી',   titlePa: 'ਫੁੱਲਗੋਭੀ',   titleKn: 'ಹೂಕೋಸು',   titleMl: 'കോളിഫ്ലവർ',   titleOr: 'ଫୁଲକୋବି',   titleUr: 'پھول گوبھی',   titleAs: 'ফুলকবি',   titleKs: 'پھول گوبھی',   titleKok: 'फुलकोबी',   titleMai: 'फूलगोभी',   titleSd: 'گوبي',   titleNe: 'काउली',   titleSa: 'पुष्पगोभी',   titleSat: 'ᱯᱷᱩᱞᱠᱳᱵᱤ',   titleBrx: 'फुलकोबी',   titleDoi: 'फूलगोभी',   price: 40,   unit: 'pcs',   seller: 'ramesh',   category: 'sabzi',   stock: 15 },
  {   id: 3,   title: 'Tamatar',   titleHi: 'टमाटर',   titleEn: 'Tomatoes',   titleMr: 'टोमॅटो',   titleBn: 'টমেটো',   titleTa: 'தக்காளி',   titleTe: 'టమాటో',   titleGu: 'ટમેટું',   titlePa: 'ਟਮਾਟਰ',   titleKn: 'ಟೊಮೆಟೊ',   titleMl: 'തക്കാളി',   titleOr: 'ଟମାଟୋ',   titleUr: 'ٹماٹر',   titleAs: 'টমেটো',   titleKs: 'ٹَماٹَر',   titleKok: 'टोमेटो',   titleMai: 'टमाटर',   titleSd: 'ٽماٽو',   titleNe: 'टमाटर',   titleSa: 'रक्तफलम्',   titleSat: 'ᱴᱟᱢᱟᱴᱳ',   titleBrx: 'टमाटर',   titleDoi: 'टमाटर',   price: 30,   unit: 'kg',   seller: 'ramesh',   category: 'sabzi',   stock: 35 },
  {   id: 4,   title: 'Doodh',   titleHi: 'दूध',   titleEn: 'Milk',   titleMr: 'दूध',   titleBn: 'দুধ',   titleTa: 'பால்',   titleTe: 'పాలు',   titleGu: 'દૂધ',   titlePa: 'ਦੁੱਧ',   titleKn: 'ಹಾಲು',   titleMl: 'പാൽ',   titleOr: 'ଦୁଧ',   titleUr: 'دودھ',   titleAs: 'গাখীৰ',   titleKs: 'دۄد',   titleKok: 'दूद',   titleMai: 'दूध',   titleSd: 'کير',   titleNe: 'दूध',   titleSa: 'दुग्धम्',   titleSat: 'ᱛᱩᱫᱩᱜ',   titleBrx: 'गोरैज',   titleDoi: 'दूध',   price: 60,   unit: 'litre',   seller: 'suresh',   category: 'dairy',   stock: 50 },
  {   id: 5,   title: 'Dahi',   titleHi: 'दही',   titleEn: 'Yogurt',   titleMr: 'दही',   titleBn: 'দই',   titleTa: 'தயிர்',   titleTe: 'పెరుగు',   titleGu: 'દહીં',   titlePa: 'ਦਹੀਂ',   titleKn: 'ಮೊಸರು',   titleMl: 'തൈര്',   titleOr: 'ଦହି',   titleUr: 'دہی',   titleAs: 'দৈ',   titleKs: 'دَہیٖن',   titleKok: 'दही',   titleMai: 'दही',   titleSd: 'ڏهي',   titleNe: 'दही',   titleSa: 'दधि',   titleSat: 'ᱫᱚᱭ',   titleBrx: 'दहि',   titleDoi: 'दही',   price: 50,   unit: 'kg',   seller: 'suresh',   category: 'dairy',   stock: 20 },
  {   id: 6,   title: 'Paneer',   titleHi: 'पनीर',   titleEn: 'Paneer',   titleMr: 'पनीर',   titleBn: 'পনির',   titleTa: 'பனீர்',   titleTe: 'పనీర్',   titleGu: 'પનીર',   titlePa: 'ਪਨੀਰ',   titleKn: 'ಪನೀರ್',   titleMl: 'പനീർ',   titleOr: 'ପନୀର',   titleUr: 'پنیر',   titleAs: 'পনীৰ',   titleKs: 'پَنیر',   titleKok: 'पनीर',   titleMai: 'पनीर',   titleSd: 'پنير',   titleNe: 'पनीर',   titleSa: 'पनीरम्',   titleSat: 'ᱯᱟᱱᱤᱨ',   titleBrx: 'पनीर',   titleDoi: 'पनीर',   price: 90,   unit: '200g',   seller: 'suresh',   category: 'dairy',   stock: 15 },
  {   id: 7,   title: 'Aashirvaad Atta',   titleHi: 'आशीर्वाद आटा',   titleEn: 'Aashirvaad Atta',   titleMr: 'आशीर्वाद पीठ',   titleBn: 'আশীর্বাদ আটা',   titleTa: 'ஆசீர்வாத் மாவு',   titleTe: 'ఆశీర్వాద్ ఆటా',   titleGu: 'આશીર્વાદ લોટ',   titlePa: 'ਆਸ਼ੀਰਵਾਦ ਆਟਾ',   titleKn: 'ಆಶೀರ್ವಾದ್ ಹಿಟ್ಟು',   titleMl: 'ആശീർവാദ് മാവ്',   titleOr: 'ଆଶୀର୍ବାଦ ଅଟା',   titleUr: 'آشیرواد آٹا',   titleAs: 'আশীৰ্বাদ আটা',   titleKs: 'آشیرواد آٹا',   titleKok: 'आशीर्वाद पीठ',   titleMai: 'आशीर्वाद आटा',   titleSd: 'آشيرواد اٽو',   titleNe: 'आशीर्वाद आटो',   titleSa: 'आशीर्वादचूर्णम्',   titleSat: 'ᱟᱥᱤᱨᱵᱟᱫᱽ ᱟᱴᱟ',   titleBrx: 'आशीर्वाद आटा',   titleDoi: 'आशीर्वाद आटा',   price: 45,   unit: 'kg',   seller: 'kavita',   category: 'kirana',   stock: 100 },
  {   id: 8,   title: 'Chini',   titleHi: 'चीनी',   titleEn: 'Sugar',   titleMr: 'साखर',   titleBn: 'চিনি',   titleTa: 'சர்க்கரை',   titleTe: 'చక్కెర',   titleGu: 'ખાંડ',   titlePa: 'ਖੰਡ',   titleKn: 'ಸಕ್ಕರೆ',   titleMl: 'പഞ്ചസാര',   titleOr: 'ଚିନି',   titleUr: 'شکر',   titleAs: 'চিনি',   titleKs: 'شکَر',   titleKok: 'साकर',   titleMai: 'चीनी',   titleSd: 'کنڊ',   titleNe: 'चिनी',   titleSa: 'शर्करा',   titleSat: 'ᱪᱤᱱᱤ',   titleBrx: 'सिमाय',   titleDoi: 'शक्कर',   price: 42,   unit: 'kg',   seller: 'kavita',   category: 'kirana',   stock: 80 },
  {   id: 9,   title: 'Aam',   titleHi: 'आम',   titleEn: 'Mango',   titleMr: 'आंबा',   titleBn: 'আম',   titleTa: 'மாம்பழம்',   titleTe: 'మామిడి',   titleGu: 'કેરી',   titlePa: 'ਅੰਬ',   titleKn: 'ಮಾವು',   titleMl: 'മാങ്ങ',   titleOr: 'ଆମ୍ବ',   titleUr: 'آم',   titleAs: 'আম',   titleKs: 'آمب',   titleKok: 'आम्बो',   titleMai: 'आम',   titleSd: 'انب',   titleNe: 'आँप',   titleSa: 'आम्रम्',   titleSat: 'ᱩᱞ',   titleBrx: 'थैलाय',   titleDoi: 'अम्ब',   price: 80,   unit: 'dozen',   seller: 'mohan',   category: 'fruit',   stock: 30 },
  {   id: 10,   title: 'Kela',   titleHi: 'केला',   titleEn: 'Banana',   titleMr: 'केळे',   titleBn: 'কলা',   titleTa: 'வாழைப்பழம்',   titleTe: 'అరటిపండు',   titleGu: 'કેળું',   titlePa: 'ਕੇਲਾ',   titleKn: 'ಬಾಳೆಹಣ್ಣು',   titleMl: 'വാഴപ്പഴം',   titleOr: 'କଦଳୀ',   titleUr: 'کیلا',   titleAs: 'কল',   titleKs: 'کیلھ',   titleKok: 'केंळ',   titleMai: 'केला',   titleSd: 'ڪيلو',   titleNe: 'केरा',   titleSa: 'कदलीफलम्',   titleSat: 'ᱠᱟᱭᱨᱟ',   titleBrx: 'थैलाय',   titleDoi: 'केला',   price: 40,   unit: 'dozen',   seller: 'mohan',   category: 'fruit',   stock: 40 },
  {   id: 11,   title: 'Banarasi Silk Saree',   titleHi: 'बनारसी रेशम साड़ी',   titleEn: 'Banarasi Silk Saree',   titleMr: 'बनारसी रेशीम साडी',   titleBn: 'বেনারসি রেশম শাড়ি',   titleTa: 'பனாரஸி பட்டு புடவை',   titleTe: 'బనారసి పట్టు చీర',   titleGu: 'બનારસી રેશમ સાડી',   titlePa: 'ਬਨਾਰਸੀ ਰੇਸ਼ਮ ਸਾੜ੍ਹੀ',   titleKn: 'ಬನಾರಸಿ ರೇಷ್ಮೆ ಸೀರೆ',   titleMl: 'ബനാറസി പട്ട് സാരി',   titleOr: 'ବନାରସୀ ରେଶମ ସାଡ଼ି',   titleUr: 'بنارسی ریشم ساڑھی',   titleAs: 'বেনাৰছী ৰেচম শাৰী',   titleKs: 'بنارسی ریشم ساڑھی',   titleKok: 'बनारसी रेशीम साडी',   titleMai: 'बनारसी रेशम साड़ी',   titleSd: 'بنارسي ريشم ساڙي',   titleNe: 'बनारसी रेशम साडी',   titleSa: 'बनारसीकौशेयशाटिका',   titleSat: 'ᱵᱟᱱᱟᱨᱥᱤ ᱨᱮᱥᱚᱢ ᱥᱟᱨᱤ',   titleBrx: 'बनारसी रेखम सारी',   titleDoi: 'बनारसी रेशम साड़ी',   price: 2500,   unit: 'pcs',   seller: 'neeta',   category: 'clothes',   stock: 8 },
  {   id: 12,   title: 'Cotton Kurta',   titleHi: 'सूती कुर्ता',   titleEn: 'Cotton Kurta',   titleMr: 'सूती कुर्ता',   titleBn: 'সুতি কুর্তা',   titleTa: 'பருத்தி குர்த்தா',   titleTe: 'పత్తి కుర్తా',   titleGu: 'સૂતરાઉ કુર્તા',   titlePa: 'ਸੂਤੀ ਕੁੜਤਾ',   titleKn: 'ಹತ್ತಿ ಕುರ್ತಾ',   titleMl: 'പരുത്തി കുർത്ത',   titleOr: 'ସୂତା କୁର୍ତ୍ତା',   titleUr: 'سوتی قمیض',   titleAs: 'সূতী কুৰ্তা',   titleKs: 'سوتی کُرتا',   titleKok: 'सूती कुर्तो',   titleMai: 'सूती कुर्ता',   titleSd: 'سوتی ڪرتو',   titleNe: 'सूती कुर्ता',   titleSa: 'कार्पासकुर्तः',   titleSat: 'ᱥᱩᱛᱤ ᱠᱩᱨᱛᱟ',   titleBrx: 'हग्रानै कुर्ता',   titleDoi: 'सूती कुर्ता',   price: 450,   unit: 'pcs',   seller: 'neeta',   category: 'clothes',   stock: 20 },
  {   id: 13,   title: 'Designer Dupatta',   titleHi: 'डिज़ाइनर दुपट्टा',   titleEn: 'Designer Dupatta',   titleMr: 'डिझायनर दुपट्टा',   titleBn: 'ডিজাইনার দুপাট্টা',   titleTa: 'டிசைனர் துப்பட்டா',   titleTe: 'డిజైనర్ దుపట్టా',   titleGu: 'ડિઝાઇનર દુપટ્ટો',   titlePa: 'ਡਿਜ਼ਾਈਨਰ ਦੁਪੱਟਾ',   titleKn: 'ಡಿಸೈನರ್ ದುಪಟ್ಟಾ',   titleMl: 'ഡിസൈനർ ദുപ്പട്ട',   titleOr: 'ଡିଜାଇନର ଦୁପଟ୍ଟା',   titleUr: 'ڈیزائنر دوپٹہ',   titleAs: 'ডিজাইনার দুপট্টা',   titleKs: 'ڈیزائنر دوپٹہ',   titleKok: 'डिझायनर दुपट्टो',   titleMai: 'डिजाइनर दुपट्टा',   titleSd: 'ڊزائنر دوپٽو',   titleNe: 'डिजाइनर दुपट्टा',   titleSa: 'अभिकल्पितदुपट्टिका',   titleSat: 'ᱰᱤᱡᱟᱭᱱᱟᱨ ᱫᱩᱯᱟᱴᱟ',   titleBrx: 'डिजाइनर दुपट्टा',   titleDoi: 'डिज़ाइनर दुपट्टा',   price: 350,   unit: 'pcs',   seller: 'neeta',   category: 'clothes',   stock: 15 },
  {   id: 14,   title: 'Anarkali Suit',   titleHi: 'अनारकली सूट',   titleEn: 'Anarkali Suit',   titleMr: 'अनारकली सूट',   titleBn: 'আনারকলি স্যুট',   titleTa: 'அனார்கலி சூட்',   titleTe: 'అనార్కలి సూట్',   titleGu: 'અનારકલી સૂટ',   titlePa: 'ਅਨਾਰਕਲੀ ਸੂਟ',   titleKn: 'ಅನಾರ್ಕಲಿ ಸೂಟ್',   titleMl: 'അനാർകലി സ്യൂട്ട്',   titleOr: 'ଅନାରକଲି ସୁଟ',   titleUr: 'انارکلی سوٹ',   titleAs: 'আনাৰকলি চুট',   titleKs: 'انارکلی سوٹ',   titleKok: 'अनारकली सूट',   titleMai: 'अनारकली सूट',   titleSd: 'انارڪلي سوٽ',   titleNe: 'अनारकली सुट',   titleSa: 'अनारकलीपोशाकः',   titleSat: 'ᱟᱱᱟᱨᱠᱟᱞᱤ ᱥᱩᱴ',   titleBrx: 'अनारकली सूट',   titleDoi: 'अनारकली सूट',   price: 1200,   unit: 'pcs',   seller: 'arjun',   category: 'clothes',   stock: 12 },
  {   id: 15,   title: 'Palazzo Set',   titleHi: 'पलाज़ो सेट',   titleEn: 'Palazzo Set',   titleMr: 'पलाजो सेट',   titleBn: 'পালাজ্জো সেট',   titleTa: 'பலாஸ்ஸோ செட்',   titleTe: 'పలాజ్జో సెట్',   titleGu: 'પલાઝો સેટ',   titlePa: 'ਪਲਾਜ਼ੋ ਸੈੱਟ',   titleKn: 'ಪಲಾಜ್ಜೋ ಸೆಟ್',   titleMl: 'പലാസ്സോ സെറ്റ്',   titleOr: 'ପାଲାଜୋ ସେଟ',   titleUr: 'پلازو سیٹ',   titleAs: 'পালাজ্জো ছেট',   titleKs: 'پلازو سیٹ',   titleKok: 'पलाजो सेट',   titleMai: 'पलाजो सेट',   titleSd: 'پلازو سيٽ',   titleNe: 'पलाजो सेट',   titleSa: 'पलाज्जोसमूहः',   titleSat: 'ᱯᱟᱞᱟᱡᱳ ᱥᱮᱴ',   titleBrx: 'पलाजो सेट',   titleDoi: 'पलाज़ो सेट',   price: 600,   unit: 'set',   seller: 'arjun',   category: 'clothes',   stock: 18 },
  {   id: 16,   title: 'Lehenga',   titleHi: 'लहंगा',   titleEn: 'Lehenga',   titleMr: 'लहेंगा',   titleBn: 'লেহেঙ্গা',   titleTa: 'லெஹங்கா',   titleTe: 'లెహంగా',   titleGu: 'લહેંગો',   titlePa: 'ਲਹਿੰਗਾ',   titleKn: 'ಲೆಹೆಂಗಾ',   titleMl: 'ലെഹങ്ക',   titleOr: 'ଲେହେଙ୍ଗା',   titleUr: 'لہنگا',   titleAs: 'লেহেঙ্গা',   titleKs: 'لہنٛگہ',   titleKok: 'ल्हेंगो',   titleMai: 'लहंगा',   titleSd: 'لهنگو',   titleNe: 'लहंगा',   titleSa: 'लहङ्गः',   titleSat: 'ᱞᱮᱦᱮᱝᱜᱟ',   titleBrx: 'लहंगा',   titleDoi: 'लहंगा',   price: 3500,   unit: 'pcs',   seller: 'arjun',   category: 'clothes',   stock: 5 },
  {   id: 17,   title: 'Custom Blouse',   titleHi: 'कस्टम ब्लाउज़',   titleEn: 'Custom Blouse',   titleMr: 'ब्लाउज शिलाई',   titleBn: 'কাস্টম ব্লাউজ',   titleTa: 'கஸ்டம் பிளவுஸ்',   titleTe: 'కస్టమ్ బ్లౌజ్',   titleGu: 'કસ્ટમ બ્લાઉઝ',   titlePa: 'ਕਸਟਮ ਬਲਾਊਜ਼',   titleKn: 'ಕಸ್ಟಮ್ ಬ್ಲೌಸ್',   titleMl: 'കസ്റ്റം ബ്ലൗസ്',   titleOr: 'କଷ୍ଟମ ବ୍ଲାଉଜ',   titleUr: 'کسٹم بلاؤز',   titleAs: 'কাষ্টম ব্লাউজ',   titleKs: 'کسٹم بلاؤز',   titleKok: 'ब्लाउज शिवप',   titleMai: 'कस्टम ब्लाउज',   titleSd: 'ڪسٽم بلائوز',   titleNe: 'कस्टम ब्लाउज',   titleSa: 'निर्मितकञ्चुलिका',   titleSat: 'ᱠᱟᱥᱴᱚᱢ ᱵᱞᱟᱩᱡᱽ',   titleBrx: 'ब्लाउज सायाव',   titleDoi: 'कस्टम ब्लाउज़',   price: 250,   unit: 'pcs',   seller: 'seema',   category: 'clothes',   stock: 10 },
  {   id: 18,   title: 'Suit Stitching',   titleHi: 'सूट सिलाई',   titleEn: 'Suit Stitching',   titleMr: 'सूट शिलाई',   titleBn: 'স্যুট সেলাই',   titleTa: 'சூட் தையல்',   titleTe: 'సూట్ కుట్టు',   titleGu: 'સૂટ સિલાઈ',   titlePa: 'ਸੂਟ ਸਿਲਾਈ',   titleKn: 'ಸೂಟ್ ಹೊಲಿಗೆ',   titleMl: 'സ്യൂട്ട് തയ്യൽ',   titleOr: 'ସୁଟ ସିଲାଇ',   titleUr: 'سوٹ سلائی',   titleAs: 'চুট চিলাই',   titleKs: 'سوٹ سِوٲن',   titleKok: 'सूट शिवप',   titleMai: 'सूट सिलाई',   titleSd: 'سوٽ سلي',   titleNe: 'सुट सिलाइ',   titleSa: 'पोशाकसीवनम्',   titleSat: 'ᱥᱩᱴ ᱥᱤᱞᱟᱭ',   titleBrx: 'सूट सायाव',   titleDoi: 'सूट सिलाई',   price: 400,   unit: 'pcs',   seller: 'seema',   category: 'clothes',   stock: 8 },
  {   id: 19,   title: 'Mobile Cover',   titleHi: 'मोबाइल कवर',   titleEn: 'Mobile Cover',   titleMr: 'मोबाइल कव्हर',   titleBn: 'মোবাইল কভার',   titleTa: 'மொபைல் கவர்',   titleTe: 'మొబైల్ కవర్',   titleGu: 'મોબાઇલ કવર',   titlePa: 'ਮੋਬਾਇਲ ਕਵਰ',   titleKn: 'ಮೊಬೈಲ್ ಕವರ್',   titleMl: 'മൊബൈൽ കവർ',   titleOr: 'ମୋବାଇଲ କଭର',   titleUr: 'موبائل کور',   titleAs: 'মোবাইল কভাৰ',   titleKs: 'موبائل کور',   titleKok: 'मोबाइल कव्हर',   titleMai: 'मोबाइल कवर',   titleSd: 'موبائل ڪور',   titleNe: 'मोबाइल कभर',   titleSa: 'दूरभाषआवरणम्',   titleSat: 'ᱢᱳᱵᱟᱭᱤᱞ ᱠᱚᱵᱷᱟᱨ',   titleBrx: 'मोबाइल कवर',   titleDoi: 'मोबाइल कवर',   price: 150,   unit: 'pcs',   seller: 'rajesh',   category: 'electronics',   stock: 50 },
  {   id: 20,   title: 'Earphones',   titleHi: 'इयरफ़ोन',   titleEn: 'Earphones',   titleMr: 'इअरफोन',   titleBn: 'ইয়ারফোন',   titleTa: 'காது போன்கள்',   titleTe: 'ఇయర్ఫోన్లు',   titleGu: 'ઇયરફોન',   titlePa: 'ਈਅਰਫ਼ੋਨ',   titleKn: 'ಇಯರ್ಫೋನ್',   titleMl: 'ഇയർഫോൺ',   titleOr: 'ଇୟରଫୋନ',   titleUr: 'ائرفون',   titleAs: 'ইয়াৰফোন',   titleKs: 'ایر فون',   titleKok: 'इअरफोन',   titleMai: 'इयरफोन',   titleSd: 'ايئرفون',   titleNe: 'इयरफोन',   titleSa: 'श्रोत्रफोनः',   titleSat: 'ᱤᱭᱚᱨᱯᱷᱳᱱ',   titleBrx: 'इयरफोन',   titleDoi: 'इयरफोन',   price: 299,   unit: 'pcs',   seller: 'rajesh',   category: 'electronics',   stock: 30 },
  {   id: 21,   title: 'Power Bank',   titleHi: 'पावर बैंक',   titleEn: 'Power Bank',   titleMr: 'पॉवर बँक',   titleBn: 'পাওয়ার ব্যাঙ্ক',   titleTa: 'பவர் பேங்க்',   titleTe: 'పవర్ బ్యాంక్',   titleGu: 'પાવર બેંક',   titlePa: 'ਪਾਵਰ ਬੈਂਕ',   titleKn: 'ಪವರ್ ಬ್ಯಾಂಕ್',   titleMl: 'പവർ ബാങ്ക്',   titleOr: 'ପାୱାର ବ୍ୟାଙ୍କ',   titleUr: 'پاور بینک',   titleAs: 'পাৱাৰ বেংক',   titleKs: 'پاور بینک',   titleKok: 'पॉवर बँक',   titleMai: 'पावर बैंक',   titleSd: 'پاور بئنڪ',   titleNe: 'पावर बैंक',   titleSa: 'विद्युत्कोशः',   titleSat: 'ᱯᱟᱣᱟᱨ ᱵᱮᱸᱠ',   titleBrx: 'पावर बैंक',   titleDoi: 'पावर बैंक',   price: 500,   unit: 'pcs',   seller: 'rajesh',   category: 'electronics',   stock: 20 },
  {   id: 22,   title: 'Mehendi Service',   titleHi: 'मेहंदी सेवा',   titleEn: 'Mehendi Service',   titleMr: 'मेंदी सेवा',   titleBn: 'মেহেদি সেবা',   titleTa: 'மெஹந்தி சேவை',   titleTe: 'మెహందీ సేవ',   titleGu: 'મેંદી સેવા',   titlePa: 'ਮਹਿੰਦੀ ਸੇਵਾ',   titleKn: 'ಮೆಹಂದಿ ಸೇವೆ',   titleMl: 'മെഹന്തി സേവനം',   titleOr: 'ମେହେନ୍ଦି ସେବା',   titleUr: 'مہندی سروس',   titleAs: 'মেহেদী সেৱা',   titleKs: 'مہندی سروس',   titleKok: 'मेंदी सेवा',   titleMai: 'मेहंदी सेवा',   titleSd: 'مهندي سروس',   titleNe: 'मेहेन्दी सेवा',   titleSa: 'मेहन्दीसेवा',   titleSat: 'ᱢᱮᱦᱮᱱᱫᱤ ᱥᱮᱵᱟ',   titleBrx: 'मेहंदी सेवा',   titleDoi: 'मेहंदी सेवा',   price: 200,   unit: 'session',   seller: 'poonam',   category: 'beauty',   stock: 10 },
  {   id: 23,   title: 'Facial',   titleHi: 'फेशियल',   titleEn: 'Facial',   titleMr: 'फेशिअल',   titleBn: 'ফেসিয়াল',   titleTa: 'முக சிகிச்சை',   titleTe: 'ఫేషియల్',   titleGu: 'ફેશિયલ',   titlePa: 'ਫੇਸ਼ੀਅਲ',   titleKn: 'ಫೇಶಿಯಲ್',   titleMl: 'ഫേഷ്യൽ',   titleOr: 'ଫେସିଆଲ',   titleUr: 'فیشل',   titleAs: 'ফেচিয়েল',   titleKs: 'فیشل',   titleKok: 'फेशिअल',   titleMai: 'फेशियल',   titleSd: 'فيشل',   titleNe: 'फेशियल',   titleSa: 'मुखशोधनम्',   titleSat: 'ᱯᱷᱮᱥᱤᱭᱟᱞ',   titleBrx: 'फेशियल',   titleDoi: 'फेशियल',   price: 300,   unit: 'session',   seller: 'poonam',   category: 'beauty',   stock: 8 },
  {   id: 24,   title: 'Threading',   titleHi: 'थ्रेडिंग',   titleEn: 'Threading',   titleMr: 'थ्रेडिंग',   titleBn: 'থ্রেডিং',   titleTa: 'த்ரெடிங்',   titleTe: 'థ్రెడింగ్',   titleGu: 'થ્રેડિંગ',   titlePa: 'ਥ੍ਰੈਡਿੰਗ',   titleKn: 'ಥ್ರೆಡಿಂಗ್',   titleMl: 'ത്രെഡിംഗ്',   titleOr: 'ଥ୍ରେଡିଙ୍ଗ',   titleUr: 'تھریڈنگ',   titleAs: 'থ্রেডিং',   titleKs: 'تھریڈنگ',   titleKok: 'थ्रेडिंग',   titleMai: 'थ्रेडिंग',   titleSd: 'ٿريڊنگ',   titleNe: 'थ्रेडिङ',   titleSa: 'सूत्ररोमापनम्',   titleSat: 'ᱛᱷᱨᱮᱰᱤᱝ',   titleBrx: 'थ्रेडिंग',   titleDoi: 'थ्रेडिंग',   price: 50,   unit: 'session',   seller: 'poonam',   category: 'beauty',   stock: 20 },
  {   id: 25,   title: 'AC Repair',   titleHi: 'एसी रिपेयर',   titleEn: 'AC Repair',   titleMr: 'एसी दुरुस्ती',   titleBn: 'এসি মেরামত',   titleTa: 'ஏசி பழுது பார்த்தல்',   titleTe: 'AC మరమ్మతు',   titleGu: 'એસી રિપેર',   titlePa: 'AC ਮੁਰੰਮਤ',   titleKn: 'ಎಸಿ ರಿಪೇರಿ',   titleMl: 'എസി റിപ്പയർ',   titleOr: 'AC ମରାମତି',   titleUr: 'اے سی مرمت',   titleAs: 'এচি মেৰামতি',   titleKs: 'اے سی مرمت',   titleKok: 'एसी दुरुस्ती',   titleMai: 'एसी मरम्मत',   titleSd: 'اي سي مرمت',   titleNe: 'एसी मर्मत',   titleSa: 'वातानुकूलनमरम्मतिः',   titleSat: 'ᱮᱥᱤ ᱨᱤᱯᱮᱭᱟᱨ',   titleBrx: 'एसी रिपेयर',   titleDoi: 'एसी रिपेयर',   price: 500,   unit: 'visit',   seller: 'deepak',   category: 'services',   stock: 5 },
  {   id: 26,   title: 'Plumbing',   titleHi: 'प्लंबिंग',   titleEn: 'Plumbing',   titleMr: 'प्लंबिंग',   titleBn: 'প্লাম্বিং',   titleTa: 'குழாய் வேலை',   titleTe: 'ప్లంబింగ్',   titleGu: 'પ્લમ્બિંગ',   titlePa: 'ਪਲੰਬਿੰਗ',   titleKn: 'ಪ್ಲಂಬಿಂಗ್',   titleMl: 'പ്ലംബിംഗ്',   titleOr: 'ପ୍ଲମ୍ବିଂ',   titleUr: 'پلمبنگ',   titleAs: 'প্লাম্বিং',   titleKs: 'پلمبنگ',   titleKok: 'प्लंबिंग',   titleMai: 'प्लंबिंग',   titleSd: 'پلمبنگ',   titleNe: 'प्लम्बिङ',   titleSa: 'नलकर्म',   titleSat: 'ᱯᱞᱟᱢᱵᱤᱝ',   titleBrx: 'प्लंबिंग',   titleDoi: 'प्लंबिंग',   price: 300,   unit: 'visit',   seller: 'deepak',   category: 'services',   stock: 8 },
  {   id: 27,   title: 'Full Time Maid',   titleHi: 'पूर्णकालिक नौकरानी',   titleEn: 'Full Time Maid',   titleMr: 'पूर्णवेळ नोकरानी',   titleBn: 'পূর্ণকালীন গৃহকর্মী',   titleTa: 'முழுநேர வேலைக்காரி',   titleTe: 'ఫుల్ టైమ్ మెయిడ్',   titleGu: 'પૂર્ણ સમય નોકરાણી',   titlePa: 'ਪੂਰੇ ਸਮੇਂ ਦੀ ਨੌਕਰਾਣੀ',   titleKn: 'ಪೂರ್ಣಾವಧಿ ಕೆಲಸದವಳು',   titleMl: 'ഫുൾ ടൈം വേലക്കാരി',   titleOr: 'ପୂର୍ଣ୍ଣକାଳୀନ କାମୁଡ଼ୀ',   titleUr: 'فل ٹائم نوکرانی',   titleAs: 'পূৰ্ণকালীন কামৰাণী',   titleKs: 'مکمل وقت کامین',   titleKok: 'पूर्ण वेळ नोकरानी',   titleMai: 'पूर्णकालिक नौकरानी',   titleSd: 'مڪمل وقت نوڪراڻي',   titleNe: 'पूर्णकालिन नोकरानी',   titleSa: 'पूर्णकालिकपरिचारिका',   titleSat: 'ᱫᱟᱹᱲᱜᱤᱡ',   titleBrx: 'फुंथाइ समैनि नोकरानी',   titleDoi: 'पूरा टाइम नौकरानी',   price: 8000,   unit: 'month',   seller: 'household',   category: 'services',   stock: 3 },
  {   id: 28,   title: 'Part Time Maid',   titleHi: 'अंशकालिक नौकरानी',   titleEn: 'Part Time Maid',   titleMr: 'अर्धवेळ नोकरानी',   titleBn: 'খণ্ডকালীন গৃহকর্মী',   titleTa: 'பகுதிநேர வேலைக்காரி',   titleTe: 'పార్ట్ టైమ్ మెయిడ్',   titleGu: 'અંશ સમય નોકરાણી',   titlePa: 'ਅੱਧੇ ਸਮੇਂ ਦੀ ਨੌਕਰਾਣੀ',   titleKn: 'ಅರೆಕಾಲಿಕ ಕೆಲಸದವಳು',   titleMl: 'പാർട്ട് ടൈം വേലക്കാരി',   titleOr: 'ଅଂଶକାଳୀନ କାମୁଡ଼ୀ',   titleUr: 'پارٹ ٹائم نوکرانی',   titleAs: 'অংশকালীন কামৰাণী',   titleKs: 'آدھا وقت کامین',   titleKok: 'अर्धवेळ नोकरानी',   titleMai: 'अंशकालिक नौकरानी',   titleSd: 'اڌ وقت نوڪراڻي',   titleNe: 'पार्ट टाइम नोकरानी',   titleSa: 'अंशकालिकपरिचारिका',   titleSat: 'ᱟᱫᱷᱟᱹ ᱫᱟᱹᱲᱜᱤᱡ',   titleBrx: 'आदि समैनि नोकरानी',   titleDoi: 'आधा टाइम नौकरानी',   price: 4000,   unit: 'month',   seller: 'household',   category: 'services',   stock: 5 },
  {   id: 29,   title: 'Cook',   titleHi: 'रसोइया',   titleEn: 'Cook',   titleMr: 'स्वयंपाकी',   titleBn: 'রাঁধুনি',   titleTa: 'சமையல்காரர்',   titleTe: 'వంటవాడు',   titleGu: 'રસોઈયો',   titlePa: 'ਰਸੋਈਆ',   titleKn: 'ಅಡುಗೆಯವನು',   titleMl: 'പാചകക്കാരൻ',   titleOr: 'ରନ୍ଧନୀ',   titleUr: 'کھانا پکانے والا',   titleAs: 'ৰান্ধনী',   titleKs: 'کھؠنُن وول',   titleKok: 'स्वयंपाकी',   titleMai: 'रसोइया',   titleSd: 'باڊي',   titleNe: 'भान्से',   titleSa: 'सूपकारः',   titleSat: 'ᱞᱟᱹᱣᱠᱟᱹ',   titleBrx: 'सानजाब',   titleDoi: 'रसोइया',   price: 6000,   unit: 'month',   seller: 'household',   category: 'services',   stock: 2 },
  {   id: 30,   title: 'Baby Caretaker',   titleHi: 'बेबी केयरटेकर',   titleEn: 'Baby Caretaker',   titleMr: 'बाळांची काळजी घेणारी',   titleBn: 'বেবি কেয়ারটেকার',   titleTa: 'குழந்தை பராமரிப்பாளர்',   titleTe: 'బేబీ కేర్టేకర్',   titleGu: 'બાળકોની સંભાળ રાખનાર',   titlePa: 'ਬੇਬੀ ਕੇਅਰਟੇਕਰ',   titleKn: 'ಮಗುವಿನ ಆರೈಕೆದಾರ',   titleMl: 'ബേബി കെയർടേക്കർ',   titleOr: 'ଶିଶୁ ଯତ୍ନକାରୀ',   titleUr: 'بیبی کیئر ٹیکر',   titleAs: 'শিশু যত্নকৰ্তা',   titleKs: 'شیر خوار نگہداشت کرن',   titleKok: 'ल्हान भुरग्याची काळजी',   titleMai: 'बच्चा देखभालकर्ता',   titleSd: 'ٻار جي سنڀال ڪندڙ',   titleNe: 'बच्चा हेरचाहकर्ता',   titleSa: 'शिशुपरिचारकः',   titleSat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱥᱟ.ᱜᱩᱱᱤᱡ',   titleBrx: 'गोदो आरजाद',   titleDoi: 'बेबी केअरटेकर',   price: 5000,   unit: 'month',   seller: 'household',   category: 'services',   stock: 2 },
  {   id: 31,   title: 'Elderly Caretaker',   titleHi: 'बुज़ुर्ग केयरटेकर',   titleEn: 'Elderly Caretaker',   titleMr: 'वृद्धांची काळजी घेणारी',   titleBn: 'বৃদ্ধ কেয়ারটেকার',   titleTa: 'வயதானவர் பராமரிப்பாளர்',   titleTe: 'ఎల్డర్లీ కేర్టేకర్',   titleGu: 'વડીલોની સંભાળ રાખનાર',   titlePa: 'ਬਜ਼ੁਰਗ ਕੇਅਰਟੇਕਰ',   titleKn: 'ವೃದ್ಧರ ಆರೈಕೆದಾರ',   titleMl: 'പ്രായമായവരുടെ കെയർടേക്കർ',   titleOr: 'ବୃଦ୍ଧ ଯତ୍ନକାରୀ',   titleUr: 'بزرگ کیئر ٹیکر',   titleAs: 'বৃদ্ধ যত্নকৰ্তা',   titleKs: 'بزرگ نگہداشت کرن',   titleKok: 'जाण्ट्या लोकांची काळजी',   titleMai: 'बुजुर्ग देखभालकर्ता',   titleSd: 'بزرگ جي سنڀال ڪندڙ',   titleNe: 'वृद्ध हेरचाहकर्ता',   titleSa: 'वृद्धपरिचारकः',   titleSat: 'ᱵᱩᱰᱷᱤ ᱥᱟ.ᱜᱩᱱᱤᱡ',   titleBrx: 'बुजुर्ग आरजाद',   titleDoi: 'बुज़ुर्ग केअरटेकर',   price: 5500,   unit: 'month',   seller: 'household',   category: 'services',   stock: 2 },
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

// ============================================================
// LANGUAGE SYSTEM — Sauda (22 Indian Languages)
// ============================================================

const LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', iso639: 'hi' },
  { code: 'en', name: 'English', native: 'English', iso639: 'en' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', iso639: 'mr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', iso639: 'bn' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', iso639: 'ta' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', iso639: 'te' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', iso639: 'gu' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', iso639: 'pa' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', iso639: 'kn' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', iso639: 'ml' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', iso639: 'or' },
  { code: 'ur', name: 'Urdu', native: 'اردو', iso639: 'ur' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', iso639: 'as' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', iso639: 'ks' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', iso639: 'kok' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', iso639: 'mai' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', iso639: 'sd' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', iso639: 'ne' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', iso639: 'sa' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', iso639: 'sat' },
  { code: 'brx', name: 'Bodo', native: 'बर', iso639: 'brx' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', iso639: 'doi' },
];

var REAL_TIME_TRANSLATION_ENABLED = true;
var TRANSLATION_CACHE = {};

function loadTranslationCache() {
  try {
    var cached = localStorage.getItem('sauda_translation_cache');
    if (cached) {
      TRANSLATION_CACHE = JSON.parse(cached);
    }
  } catch (e) {
    TRANSLATION_CACHE = {};
  }
}

function saveTranslationCache() {
  try {
    var cacheStr = JSON.stringify(TRANSLATION_CACHE);
    if (cacheStr.length < 4000000) {
      localStorage.setItem('sauda_translation_cache', cacheStr);
    }
  } catch (e) {
    console.warn('Could not save translation cache:', e);
  }
}

function getCacheKey(text, fromLang, toLang) {
  return fromLang + '_' + toLang + '_' + text.trim().substring(0, 200);
}

function getISO639Code(code) {
  var lang = LANGUAGES.find(function(l) { return l.code === code; });
  if (lang && lang.iso639) return lang.iso639;
  return code;
}

async function translateWithMyMemory(text, fromLang, toLang) {
  if (!text || !text.trim()) return text;
  if (fromLang === toLang) return text;

  var cacheKey = getCacheKey(text, fromLang, toLang);
  if (TRANSLATION_CACHE[cacheKey]) {
    return TRANSLATION_CACHE[cacheKey];
  }

  var fromISO = getISO639Code(fromLang);
  var toISO = getISO639Code(toLang);

  try {
    var langPair = fromISO + '|' + toISO;
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + encodeURIComponent(langPair);
    
    var response = await fetch(url);
    var data = await response.json();

    if (data && data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      var translated = data.responseData.translatedText;
      TRANSLATION_CACHE[cacheKey] = translated;
      saveTranslationCache();
      return translated;
    }
  } catch (e) {
    console.warn('MyMemory translation failed:', e);
  }

  return text;
}

async function translateWithLibreTranslate(text, fromLang, toLang) {
  if (!text || !text.trim()) return text;
  if (fromLang === toLang) return text;

  var cacheKey = getCacheKey(text, fromLang, toLang);
  if (TRANSLATION_CACHE[cacheKey]) {
    return TRANSLATION_CACHE[cacheKey];
  }

  var fromISO = getISO639Code(fromLang);
  var toISO = getISO639Code(toLang);

  try {
    var response = await fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: fromISO,
        target: toISO,
        format: 'text'
      })
    });
    
    var data = await response.json();
    
    if (data && data.translatedText) {
      TRANSLATION_CACHE[cacheKey] = data.translatedText;
      saveTranslationCache();
      return data.translatedText;
    }
  } catch (e) {
    console.warn('LibreTranslate translation failed:', e);
  }

  return text;
}

async function translateText(text, toLang, fromLang) {
  if (!text) return '';
  if (!toLang) toLang = state ? (state.userLang || 'hi') : 'hi';
  if (!fromLang) fromLang = 'en';
  
  if (fromLang === toLang) return text;
  
  var result = await translateWithMyMemory(text, fromLang, toLang);
  
  if (result === text && fromLang !== 'en') {
    var englishText = await translateWithMyMemory(text, fromLang, 'en');
    if (englishText !== text) {
      result = await translateWithMyMemory(englishText, 'en', toLang);
    }
  }
  
  return result;
}

async function translateDynamicContent(element, toLang) {
  if (!element || !toLang) return;
  
  var textContent = element.textContent || element.innerText;
  if (textContent && textContent.trim() && textContent.length < 500) {
    var translated = await translateText(textContent, toLang);
    if (translated !== textContent) {
      element.setAttribute('data-original-text', textContent);
      element.textContent = translated;
    }
  }
  
  var placeholder = element.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) {
    var translatedPlaceholder = await translateText(placeholder, toLang);
    if (translatedPlaceholder !== placeholder) {
      element.setAttribute('data-original-placeholder', placeholder);
      element.setAttribute('placeholder', translatedPlaceholder);
    }
  }
  
  var children = element.children;
  for (var i = 0; i < children.length; i++) {
    if (!children[i].hasAttribute('data-i18n')) {
      await translateDynamicContent(children[i], toLang);
    }
  }
}

function toggleRealTimeTranslation(enabled) {
  REAL_TIME_TRANSLATION_ENABLED = enabled;
  localStorage.setItem('sauda_rt_translation', enabled ? '1' : '0');
  return REAL_TIME_TRANSLATION_ENABLED;
}

function isRealTimeTranslationEnabled() {
  var stored = localStorage.getItem('sauda_rt_translation');
  if (stored !== null) {
    REAL_TIME_TRANSLATION_ENABLED = stored === '1';
  }
  return REAL_TIME_TRANSLATION_ENABLED;
}

loadTranslationCache();
isRealTimeTranslationEnabled();

function getProductTitle(product) {
  var lang = state.userLang || 'hi';
  var map = {
    hi: product.titleHi, en: product.titleEn, mr: product.titleMr,
    bn: product.titleBn, ta: product.titleTa, te: product.titleTe,
    gu: product.titleGu, pa: product.titlePa, kn: product.titleKn,
    ml: product.titleMl, or: product.titleOr, ur: product.titleUr,
    as: product.titleAs, ks: product.titleKs, kok: product.titleKok,
    mai: product.titleMai, sd: product.titleSd, ne: product.titleNe,
    sa: product.titleSa, sat: product.titleSat, brx: product.titleBrx,
    doi: product.titleDoi,
  };
  return map[lang] || product.title;
}

const TRANS = {
  aadhaar: { hi: 'Aadhaar', en: 'Aadhaar', mr: 'Aadhaar', bn: 'আধার', ta: 'ஆதார்', te: 'ఆధార్', gu: 'આધાર', pa: 'ਆਧਾਰ', kn: 'ಆಧಾರ್', ml: 'ആധാർ', or: 'ଆଧାର', ur: 'آدھار', as: 'আধাৰ', ks: 'آدھار', kok: 'आधार', mai: 'आधार', sd: 'آڌار', ne: 'आधार', sa: 'आधारः', sat: 'ᱟᱫᱷᱟᱨ', brx: 'आधार', doi: 'आधार', },
  aadhaar_tag: { hi: 'Aadhaar', en: 'Aadhaar', mr: 'Aadhaar', bn: 'আধার', ta: 'ஆதார்', te: 'ఆధార్', gu: 'આધાર', pa: 'ਆਧਾਰ', kn: 'ಆಧಾರ್', ml: 'ആധാർ', or: 'ଆଧାର', ur: 'آدھار', as: 'আধাৰ', ks: 'آدھار', kok: 'आधार', mai: 'आधार', sd: 'آڌار', ne: 'आधार', sa: 'आधारः', sat: 'ᱟᱫᱷᱟᱨ', brx: 'आधार', doi: 'आधार', },
  aadhaar_verified: { hi: 'Aadhaar Verified', en: 'Aadhaar Verified', mr: 'आधार सत्यापित', bn: 'আধার যাচাইকৃত', ta: 'ஆதார் சரிபார்க்கப்பட்டது', te: 'ఆధార్ ధృవీకరించబడింది', gu: 'આધાર ચકાસાયેલ', pa: 'ਆਧਾਰ ਪ੍ਰਮਾਣਿਤ', kn: 'ಆಧಾರ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ', ml: 'ആധാർ സ്ഥിരീകരിച്ചു', or: 'ଆଧାର ଯାଞ୍ଚ', ur: 'آدھار تصدیق شدہ', as: 'আধাৰ যাচাই', ks: 'آدھار تصدیق شدٕ', kok: 'आधार पडताळून', mai: 'आधार प्रमाणित', sd: 'آڌار تصديق ٿيل', ne: 'आधार प्रमाणित', sa: 'आधारः प्रमाणितः', sat: 'ᱟᱫᱷᱟᱨ ᱵᱷᱟᱹᱨᱛᱤ', brx: 'आधार जायगाबाय', doi: 'आधार तस्दीक होई गेआ', },
  aadhaar_verify: { hi: 'Aadhaar Verification', en: 'Aadhaar Verification', mr: 'आधार व्हेरिफिकेशन', bn: 'আধার যাচাইকরণ', ta: 'ஆதார் சரிபார்ப்பு', te: 'ఆధార్ ధ్రువీకరణ', gu: 'આધાર વેરિફિકેશન', pa: 'ਆਧਾਰ ਪੁਸ਼ਟੀਕਰਨ', kn: 'ಆಧಾರ್ ಪರಿಶೀಲನೆ', ml: 'ആധാർ പരിശോധന', or: 'ଆଧାର ଯାଞ୍ଚ', ur: 'آدھار تصدیق', as: 'আধাৰ পৰীক্ষণ', ks: 'آدھار تصدیق', kok: 'आधार पडताळणी', mai: 'आधार सत्यापन', sd: 'آڌار تصديق', ne: 'आधार प्रमाणीकरण', sa: 'आधारप्रमाणीकरणम्', sat: 'ᱟᱫᱷᱟᱨ ᱯᱨᱚᱢᱟᱱ', brx: 'आधार जांच', doi: 'आधार जांच', },
  aage_badhein: { hi: 'Aage Badhein', en: 'Next', mr: 'Pudhe Ja', bn: 'এগিয়ে যান', ta: 'அடுத்து', te: 'తర్వాత', gu: 'આગળ વધો', pa: 'ਅੱਗੇ ਵਧੋ', kn: 'ಮುಂದೆ', ml: 'അടുത്തത്', or: 'ଆଗକୁ ଯାଆନ୍ତୁ', ur: 'آگے بڑھیں', as: 'আগুৱান যাওক', ks: 'اَگٕہ بَڑھیو', kok: 'फुडें वचात', mai: 'आगू बढू', sd: 'اڳتي وڃو', ne: 'अगाडि बढ्नुहोस्', sa: 'अग्रे गच्छतु', sat: 'ᱟᱜ ᱥᱮᱱ ᱢᱮ', brx: 'आगो थांग', doi: 'अग्गे वधो', },
  aaj_orders: { hi: 'Aaj Orders', en: "Today's Orders", mr: 'Aajche Orders', bn: 'আজকের অর্ডার', ta: 'இன்றைய ஆர்டர்கள்', te: 'నేటి ఆర్డర్లు', gu: 'આજના ઓર્ડર', pa: 'ਅੱਜ ਦੇ ਆਰਡਰ', kn: 'ಇಂದಿನ ಆರ್ಡರ್‌ಗಳು', ml: 'ഇന്നത്തെ ഓർഡറുകൾ', or: 'ଆଜିର ଅର୍ଡର', ur: 'آج کے آرڈر', as: 'আজিৰ অৰ্ডাৰ', ks: 'اَزِ آرڈر', kok: 'आयजचे ऑर्डर', mai: 'आओक आर्डर', sd: 'اڄ جا آرڊر', ne: 'आजको अर्डर', sa: 'अद्य आदेशाः', sat: 'ᱛᱤᱦᱤᱧ ᱟᱨᱰᱚᱨ', brx: 'दिनैनि आर्डर', doi: 'अज्ज दा आर्डर', },
  aap_kaun_hain: { hi: 'Aap kaun hain?', en: 'Who are you?', mr: 'Tumhi kon aahat?', bn: 'আপনি কে?', ta: 'நீங்கள் யார்?', te: 'మీరు ఎవరు?', gu: 'તમે કોણ છો?', pa: 'ਤੁਸੀਂ ਕੌਣ ਹੋ?', kn: 'ನೀವು ಯಾರು?', ml: 'നിങ്ങൾ ആരാണ്?', or: 'ଆପଣ କିଏ?', ur: 'آپ کون ہیں؟', as: 'আপুনি কোন?', ks: 'तुह्य कुस छु?', kok: 'तुमी कोण?', mai: 'अहाँ की छी?', sd: 'تون ڪير آهيو؟', ne: 'तपाईं को हुनुहुन्छ?', sa: 'भवान् कः?', sat: 'ᱟᱢ ᱚᱠᱚᱭ?', brx: 'नों सो?', doi: 'तुस की कोन हो?', },
  aapki_aawaz: { hi: 'Aapki Aawaz', en: 'Your Voice', mr: 'Tumchi Aawaz', bn: 'আপনার কণ্ঠ', ta: 'உங்கள் குரல்', te: 'మీ గొంతు', gu: 'તમારી અવાજ', pa: 'ਤੁਹਾਡੀ ਆਵਾਜ਼', kn: 'ನಿಮ್ಮ ಧ್ವನಿ', ml: 'നിങ്ങളുടെ ശബ്ദം', or: 'ଆପଣଙ୍କ କଣ୍ଠ', ur: 'آپ کی آواز', as: 'আপোনাৰ কণ্ঠ', ks: 'پنٕہِ آواز', kok: 'तुमचो आवाज', mai: 'अहाँक आवाज', sd: 'توهان جي آواز', ne: 'तपाईंको आवाज', sa: 'भवतः स्वरः', sat: 'ᱟᱢᱟᱜ ᱨᱟᱦᱟ', brx: 'आंनि राव', doi: 'तुहाडी आवाज', },
  abhi: { hi: 'Abhi', en: 'Just now', mr: 'आत्ताच', bn: 'এইমাত্র', ta: 'இப்போதுதான்', te: 'ఇప్పుడే', gu: 'હમણાં', pa: 'ਹੁਣੇ', kn: 'ಈಗಷ್ಟೇ', ml: 'ഇപ്പോൾ', or: 'ଏବେ', ur: 'ابھی', as: 'এতিয়া', ks: 'أسے', kok: 'आताच', mai: 'अखनी', sd: 'هنئي', ne: 'अहिले', sa: 'सद्यः', sat: 'ᱱᱤᱛ', brx: 'दान', doi: 'हुणे', },
  active: { hi: 'Active', en: 'Active', mr: 'सक्रिय', bn: 'সক্রিয়', ta: 'செயலில்', te: 'యాక్టివ్', gu: 'સક્રિય', pa: 'ਸਰਗਰਮ', kn: 'ಸಕ್ರಿಯ', ml: 'സജീവം', or: 'ସକ୍ରିୟ', ur: 'فعال', as: 'সক্ৰিয়', ks: 'فعال', kok: 'सक्रिय', mai: 'सक्रिय', sd: 'فعال', ne: 'सक्रिय', sa: 'सक्रियः', sat: 'ᱠᱟᱹᱢᱤ', brx: 'जों', doi: 'सक्रिय', },
  add_item: { hi: 'Add Item', en: 'Add Item', mr: 'Item Add Kara', bn: 'আইটেম যোগ করুন', ta: 'பொருளைச் சேர்க்க', te: 'అంశాన్ని జోడించు', gu: 'આઇટમ ઉમેરો', pa: 'ਆਈਟਮ ਸ਼ਾਮਲ ਕਰੋ', kn: 'ವಸ್ತುವನ್ನು ಸೇರಿಸಿ', ml: 'ഇനം ചേർക്കുക', or: 'ଆଇଟମ ଯୋଡନ୍ତୁ', ur: 'آئٹم شامل کریں', as: 'আইটেম যোগ কৰক', ks: 'آئٹم شامل کٔرِو', kok: 'आयटम जोडात', mai: 'आइटम जोड़ू', sd: 'آئٽم شامل ڪريو', ne: 'वस्तु थप्नुहोस्', sa: 'वस्तुम् योजयतु', sat: 'ᱟᱭᱴᱮᱢ ᱥᱮᱞᱮᱫ', brx: 'आइटम सोलों', doi: 'आइटम जोड़ो', },
  apna_item_bolo: { hi: 'Apna item bolo', en: 'Say your item', mr: 'Tumcha item sanga', bn: 'আপনার আইটেম বলুন', ta: 'உங்கள் பொருளைச் சொல்லுங்கள்', te: 'మీ వస్తువు చెప్పండి', gu: 'તમારો આઇટમ બોલો', pa: 'ਆਪਣਾ ਆਈਟਮ ਬੋਲੋ', kn: 'ನಿಮ್ಮ ವಸ್ತುವನ್ನು ಹೇಳಿ', ml: 'നിങ്ങളുടെ ഇനം പറയുക', or: 'ଆପଣଙ୍କ ଆଇଟମ କୁହନ୍ତୁ', ur: 'اپنا آئٹم بولیں', as: 'আপোনাৰ আইটেম কওক', ks: 'پنٕہِ آئٹم تھٲیِو', kok: 'तुमचो आयटम सांगात', mai: 'अपन आइटम बोलू', sd: 'پنهنجو آئٽم ڳالهايو', ne: 'आफ्नो वस्तु बोल्नुहोस्', sa: 'स्ववस्तुम् वदतु', sat: 'ᱟᱢᱟᱜ ᱟᱭᱴᱮᱢ ᱢᱮᱢᱮ', brx: 'आंनि आइटमखौ राव', doi: 'अपना आइटम बोलो', },
  apna_mohalla: { hi: 'Apna mohalla batayein', en: 'Tell us your locality', mr: 'Tumcha mohalla sanga', bn: 'আপনার এলাকা বলুন', ta: 'உங்கள் பகுதியைச் சொல்லுங்கள்', te: 'మీ ప్రాంతం చెప్పండి', gu: 'તમારો મોહલ્લો કહો', pa: 'ਆਪਣਾ ਮੁਹੱਲਾ ਦੱਸੋ', kn: 'ನಿಮ್ಮ ಪ್ರದೇಶವನ್ನು ಹೇಳಿ', ml: 'നിങ്ങളുടെ സ്ഥലം പറയുക', or: 'ଆପଣଙ୍କ ଅଞ୍ଚଳ କୁହନ୍ତୁ', ur: 'اپنا محلہ بتائیں', as: 'আপোনাৰ অঞ্চল কওক', ks: 'پنٕہِ محلہ تھٲیِو', kok: 'तुमचो मोहल्लो सांगात', mai: 'अपन मोहल्ला बताउ', sd: 'پنهنجو محلو ٻڌايو', ne: 'आफ्नो टोल भन्नुहोस्', sa: 'स्वस्य प्रदेशं वदतु', sat: 'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱢᱮᱢᱮ', brx: 'आंनि मोहल्लाखौ फोन', doi: 'अपना मुहल्ला दस्सो', },
  apna_naam: { hi: 'Apna naam batayein', en: 'Tell us your name', mr: 'Tumche nav sanga', bn: 'আপনার নাম বলুন', ta: 'உங்கள் பெயரைச் சொல்லுங்கள்', te: 'మీ పేరు చెప్పండి', gu: 'તમારું નામ કહો', pa: 'ਆਪਣਾ ਨਾਂ ਦੱਸੋ', kn: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ಹೇಳಿ', ml: 'നിങ്ങളുടെ പേര് പറയുക', or: 'ଆପଣଙ୍କ ନାମ କୁହନ୍ତୁ', ur: 'اپنا نام بتائیں', as: 'আপোনাৰ নাম কওক', ks: 'پنٕہِ ناو تھٲیِو', kok: 'तुमचें नांव सांगात', mai: 'अपन नाम बताउ', sd: 'پنهنجو نالو ٻڌايو', ne: 'आफ्नो नाम भन्नुहोस्', sa: 'स्वनाम वदतु', sat: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱢᱮᱢᱮ', brx: 'आंनि मुं खालाम', doi: 'अपना नां दस्सो', },
  apne_mohalle_trusted: { hi: 'So we can show nearby trusted sellers', en: 'So we can show nearby trusted sellers', mr: 'जेणेकरून आम्ही जवळील विश्वासू विक्रेते दाखवू शकू', bn: 'যাতে আমরা কাছের বিশ্বস্ত বিক্রেতাদের দেখাতে পারি', ta: 'அதனால் அருகில் உள்ள நம்பிக்கையான விற்பனையாளர்களைக் காட்டலாம்', te: 'తద్వారా సమీపంలోని నమ్మకమైన విక్రేతలను చూపించగలం', gu: 'જેથી અમે નજીકના વિશ્વાસુ વિક્રેતાઓ બતાવી શકીએ', pa: 'ਤਾਂ ਕਿ ਅਸੀਂ ਨਜ਼ਦੀਕੀ ਭਰੋਸੇਯੋਗ ਵਿਕਰੇਤਾਵਾਂ ਨੂੰ ਦਿਖਾ ਸਕੀਏ', kn: 'ಇದರಿಂದ ಹತ್ತಿರದ ವಿಶ್ವಾಸಾರ್ಹ ಮಾರಾಟಗಾರರನ್ನು ತೋರಿಸಬಹುದು', ml: 'അതിനാൽ സമീപത്തെ വിശ്വസ്ത വിൽപ്പനക്കാരെ കാണിക്കാം', or: 'ଯାହାଫଳରେ ଆମେ ନିକଟସ୍ଥ ବିଶ୍ୱସ୍ତ ବିକ୍ରେତାମାନଙ୍କୁ ଦେଖାଇ ପାରିବା', ur: 'تاکہ ہم قریبی معتبر فروخت کنندگان دکھا سکیں', as: 'যাতে আমি ওচৰৰ বিশ্বস্ত বিক্ৰেতাসকল দেখুৱাব পাৰো', ks: 'تَتہٕ أس نٔزدیٖک معتبر فروخت کنن ہُنیٚن ہیٚکھہٕ', kok: 'जास्त जाल्ले विश्वासू विक्रेते दाखोवंक मेळटलें', mai: 'जे अहाँ निकटक भरोसेमंद विक्रेतादेखाबै', sd: 'تہ جيئن اسين ويجھا معتبر وڪرو ڪندڙ ڏيکاري سگهون', ne: 'ताकि हामी नजिकका भरपर्दो बिक्रेताहरू देखाउन सकौं', sa: 'यथा वयं समीपविश्वसनीयविक्रेतृन् दर्शयेम', sat: 'ᱡᱮᱥᱮᱫ ᱟᱵᱚ ᱟ.ᱨᱩ ᱨᱤᱱ ᱵᱷᱚᱨᱚᱥᱟ ᱟ.ᱠᱤᱱ ᱩᱫᱩᱜᱟ', brx: 'अब्ला आंखो जायो आंनि मोहल्लानि फैसलाजो खातिरदार मोनो', doi: 'जिस करी अस नेड़े दे भरोसेमंद वेचण आलियां नूं वेखा सकीए', },
  auto_detect: { hi: 'Auto-detect Location', en: 'Auto-detect Location', mr: 'आपोआप शोधा', bn: 'স্বয়ংক্রিয়ভাবে অবস্থান সনাক্ত করুন', ta: 'தானியங்கி இருப்பிடம்', te: 'స్వయంచాలక స్థానం', gu: 'ઓટો-ડિટેક્ટ સ્થાન', pa: 'ਆਟੋ-ਡਿਟੈਕਟ ਸਥਾਨ', kn: 'ಸ್ವಯಂ-ಪತ್ತೆ ಸ್ಥಳ', ml: 'സ്വയം കണ്ടെത്തൽ', or: 'ସ୍ୱୟଂ-ଚିହ୍ନଟ ଅଞ୍ଚଳ', ur: 'خودکار مقام', as: 'স্বয়ংক্রিয় স্থান', ks: 'خودکار مقام', kok: 'आपसूक शोध', mai: 'ऑटो स्थान', sd: 'پاڻمرادو هنڌ', ne: 'आफैं पत्ता लगाउनुहोस्', sa: 'स्वयं-स्थानम्', sat: 'ᱟᱡᱛᱮ ᱴᱷᱟᱶ', brx: 'आपुनआपु जेगा', doi: 'ऑटो स्थान', },
  available: { hi: ' available', en: ' available', mr: ' उपलब्ध', bn: ' উপলব্ধ', ta: ' கிடைக்கும்', te: ' అందుబాటులో', gu: ' ઉપલબ્ધ', pa: ' ਉਪਲਬਧ', kn: ' ಲಭ್ಯವಿದೆ', ml: ' ലഭ്യമാണ്', or: ' ଉପଲବ୍ଧ', ur: ' دستیاب', as: ' উপলব্ধ', ks: ' دستیاب', kok: ' उपलब्ध', mai: ' उपलब्ध', sd: ' موجود', ne: ' उपलब्ध', sa: ' उपलब्धम्', sat: ' ᱧᱟᱢᱚᱜ', brx: ' लामजाब', doi: ' उपलब्ध', },
  back: { hi: 'Back', en: 'Back', mr: 'Back', bn: 'Back', ta: 'Back', te: 'Back', gu: 'Back', pa: 'Back', kn: 'Back', ml: 'Back', or: 'Back', ur: 'Back', as: 'Back', ks: 'Back', kok: 'Back', mai: 'Back', sd: 'Back', ne: 'Back', sa: 'Back', sat: 'Back', brx: 'Back', doi: 'Back' },
  bol: { hi: 'Bol', en: 'Voice', mr: 'Bol', bn: 'বলো', ta: 'பேசு', te: 'మాట్లాడు', gu: 'બોલ', pa: 'ਬੋਲ', kn: 'ಮಾತನಾಡು', ml: 'സംസാരിക്കുക', or: 'କୁହ', ur: 'بولو', as: 'কোৱা', ks: 'بولو', kok: 'बोल', mai: 'बोलू', sd: 'ڳالهايو', ne: 'बोल', sa: 'वद', sat: 'ᱨᱳᱲ', brx: 'राव', doi: 'बोल' },
  bol_ke_becho: { hi: 'Bol ke Becho', en: 'Voice Sell', mr: 'Bolun Viku', bn: 'বলে বিক্রি করো', ta: 'குரலில் விற்க', te: 'గొంతులో అమ్ము', gu: 'બોલીને વેચો', pa: 'ਬੋਲ ਕੇ ਵੇਚੋ', kn: 'ಧ್ವನಿಯಲ್ಲಿ ಮಾರು', ml: 'ശബ്ദത്തിൽ വിൽക്കുക', or: 'କହି ବିକ', ur: 'بول کر بیچو', as: 'কৈ বেচা', ks: 'بول کٔرِ بیٖچھو', kok: 'उलोवन विक', mai: 'बोलि बेचू', sd: 'ڳالهائي وڪرو', ne: 'बोलेर बेच्नुहोस्', sa: 'वदित्वा विक्रय', sat: 'ᱨᱳᱲ ᱛᱮ ᱟ.ᱠᱤᱱ', brx: 'रावनो बेराय', doi: 'बोल के वेचो' },
  bol_ke_becho_title: { hi: 'Naya Listing Banao', en: 'Create New Listing', mr: 'Navi Yadi Banva', bn: 'নতুন লিস্টিং তৈরি করো', ta: 'புதிய பட்டியல்', te: 'కొత్త లిస్టింగ్', gu: 'નવી લિસ્ટિંગ', pa: 'ਨਵੀਂ ਲਿਸਟਿੰਗ', kn: 'ಹೊಸ ಲಿಸ್ಟಿಂಗ್', ml: 'പുതിയ ലിസ്റ്റിംഗ്', or: 'ନୂଆ ଲିସ୍ଟିଂ', ur: 'نیا لسٹنگ بنائیں', as: 'নতুন লিষ্টিং', ks: 'نئو لسٹنگ', kok: 'नवी यादी', mai: 'नव लिस्टिंग', sd: 'نئون لسٽنگ', ne: 'नयाँ लिस्टिङ', sa: 'नवीन सूची', sat: 'ᱱᱟᱶᱟ ᱞᱤᱥᱴᱤᱝ', brx: 'गोदान लिस्टिंग', doi: 'नई लिस्टिंग' },
  bol_ke_kharido: { hi: 'बोल के खरीदो', en: 'Voice Shopping', mr: 'बोलून खरेदी', bn: 'বলে কেনাকাটা', ta: 'குரலில் ஷாப்பிங்', te: 'గొంతుతో షాపింగ్', gu: 'બોલીને ખરીદી', pa: 'ਬੋਲ ਕੇ ਖਰੀਦਦਾਰੀ', kn: 'ಮಾತನಾಡಿ ಶಾಪಿಂಗ್', ml: 'ശബ്ദത്തിൽ ഷോപ്പിംഗ്', or: 'କହି କିଣାକିଣି', ur: 'بول کر خریداری', as: 'মাতি কিনাকাটি', ks: 'وَتھ کٔرِتھ خریدٲری', kok: 'उलोवन घेवप', mai: 'बोलि किनबेच', sd: 'ڳالهائي خريداري', ne: 'बोलेर किनमेल', sa: 'वाचा क्रयविक्रयम्', sat: 'ᱨᱚᱲ ᱠᱟᱛᱮ ᱥᱮᱞᱮᱫ', brx: 'रावजों लिरबनाय', doi: 'बोल के खरीददारी', },
  bolein: { hi: 'Bolein', en: 'Speak', mr: 'Bola', bn: 'বলুন', ta: 'பேசுங்கள்', te: 'మాట్లాడండి', gu: 'બોલો', pa: 'ਬੋਲੋ', kn: 'ಮಾತನಾಡಿ', ml: 'സംസാരിക്കുക', or: 'କୁହନ୍ତୁ', ur: 'بولیں', as: 'কওক', ks: 'تھٲیِو', kok: 'उलोवात', mai: 'बोलू', sd: 'ڳالهايو', ne: 'बोल्नुहोस्', sa: 'वदतु', sat: 'ᱨᱳᱲ', brx: 'राव', doi: 'बोलो', },
  browse_categories: { hi: 'Browse Categories', en: 'Browse Categories', mr: 'Categories Explor Kara', bn: 'বিভাগগুলি ব্রাউজ করুন', ta: 'வகைகளை உலாவுக', te: 'వర్గాలను బ్రౌజ్ చేయండి', gu: 'શ્રેણીઓ બ્રાઉઝ કરો', pa: 'ਸ਼੍ਰੇਣੀਆਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ', kn: 'ವರ್ಗಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ', ml: 'വിഭാഗങ്ങൾ ബ്രൗസ് ചെയ്യുക', or: 'ଶ୍ରେଣୀଗୁଡ଼ିକ ବ୍ରାଉଜ କରନ୍ତୁ', ur: 'زمرہ جات براؤز کریں', as: 'শ্ৰেণীসমূহ ব্ৰাউজ কৰক', ks: 'زمرے براؤز کٔرِو', kok: 'वर्ग ब्राउज करात', mai: 'श्रेणी ब्राउज करू', sd: 'قسمون براؤز ڪريو', ne: 'कोटिहरू ब्राउज गर्नुहोस्', sa: 'वर्गान् आलोच्यताम्', sat: 'ᱛᱷᱳᱠ ᱠᱚ ᱧᱮᱞᱢᱮ', brx: 'श्रेणी फेराय', doi: 'श्रेणियाँ ब्राउज करो', },
  buyer: { hi: 'Buyer', en: 'Buyer', mr: 'खरेदीदार', bn: 'ক্রেতা', ta: 'வாங்குபவர்', te: 'కొనుగోలుదారు', gu: 'ખરીદનાર', pa: 'ਖਰੀਦਦਾਰ', kn: 'ಖರೀದಿದಾರ', ml: 'വാങ്ങുന്നയാൾ', or: 'କ୍ରେତା', ur: 'خریدار', as: 'ক্ৰেতা', ks: 'خریدار', kok: 'विकत घेवपी', mai: 'खरीददार', sd: 'خريد ڪندڙ', ne: 'क्रेता', sa: 'क्रेता', sat: 'ᱠᱤᱨᱤᱧᱤᱡ', brx: 'बेरजो', doi: 'खरीददार', },
  buyer_desc: { hi: 'Mohalle se best deals dhundho', en: 'Find the best deals in your neighborhood', mr: 'मोहल्ल्यातील सर्वोत्तम डील शोधा', bn: 'পাড়ায় সেরা ডিল খুঁজুন', ta: 'அக்கம்பக்கத்தில் சிறந்த ஒப்பந்தங்களைக் கண்டறியவும்', te: 'మీ పరిసరాల్లో ఉత్తమ డీల్స్ కనుగొనండి', gu: 'મોહલ્લામાં શ્રેષ્ઠ ડીલ્સ શોધો', pa: 'ਮੁਹੱਲੇ ਵਿੱਚ ਵਧੀਆ ਡੀਲ ਲੱਭੋ', kn: 'ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಡೀಲ್ಗಳನ್ನು ಹುಡುಕಿ', ml: 'അയൽപക്കത്ത് ഏറ്റവും മികച്ച ഡീലുകൾ കണ്ടെത്തുക', or: 'ପଡ଼ିଆରେ ସର୍ବୋତ୍ତମ ଡିଲ୍ ଖୋଜନ୍ତୁ', ur: 'محلے میں بہترین ڈیلز تلاش کریں', as: 'চুবুৰীয়াত ভাল ডিল বিচাৰক', ks: 'محلہَس منٛز بہترین ڈیل تلاش کٔرِو', kok: 'मोहल्ल्यांतल्या सगळ्यांत बऱ्या डील सोदात', mai: 'मोहल्ले में बढ़िया डील खोजू', sd: 'محلي ۾ بهترين ڊيلون ڳوليو', ne: 'टोलमा उत्तम डीलहरू खोज्नुहोस्', sa: 'समीपे श्रेष्ठं क्रयविक्रयम् अन्विष्यताम्', sat: 'ᱴᱚᱞᱟ ᱨᱮ ᱥᱚᱨᱮᱥ ᱰᱤᱞ ᱧᱟᱢᱢᱮ', brx: 'मोहल्लाव आबै डील जाय', doi: 'मुहल्ले च बेहतरीन डील लभो', },
  categories_nav: { hi: 'Categories', en: 'Categories', mr: 'Categories', bn: 'ক্যাটাগরিস', ta: 'வகைகள்', te: 'వర్గాలు', gu: 'શ્રેણીઓ', pa: 'ਸ਼੍ਰੇਣੀਆਂ', kn: 'ವರ್ಗಗಳು', ml: 'വിഭാഗങ്ങൾ', or: 'ଶ୍ରେଣୀମାନ', ur: 'زمرہ جات', as: 'শ্ৰেণীসমূহ', ks: 'زمرے', kok: 'वर्ग', mai: 'श्रेणी', sd: 'قسمون', ne: 'कोटिहरू', sa: 'वर्गाः', sat: 'ᱛᱷᱚᱠ', brx: 'श्रेणी', doi: 'श्रेणियाँ' },
  categories_section: { hi: 'Categories', en: 'Categories', mr: 'Categories', bn: 'ক্যাটাগরিস', ta: 'வகைகள்', te: 'వర్గాలు', gu: 'শ्रेণીઓ', pa: 'ਸ਼੍ਰੇਣੀਆਂ', kn: 'ವರ್ಗಗಳು', ml: 'വിഭാഗങ്ങൾ', or: 'ଶ୍ରେଣୀମାନ', ur: 'زمرہ جات', as: 'শ্রেণীসমূহ', ks: 'زمرے', kok: 'वर्ग', mai: 'श्रेणी', sd: 'قسمون', ne: 'कोटिहरू', sa: 'वर्गाः', sat: 'ᱛᱷᱚᱠ', brx: 'श्रेणी', doi: 'श्रेणियाँ', },
  category_select_label: { hi: 'SHREENI (SARI LAGU HONE PAR CHUNEIN)', en: 'CATEGORY (Select all that apply)', mr: 'वर्ग (सर्व लागू असल्यास निवडा)', bn: 'বিভাগ (প্রযোজ্য সব নির্বাচন করুন)', ta: 'வகை (பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்)', te: 'వర్గం (వర్తించేవన్నీ ఎంచుకోండి)', gu: 'શ્રેણી (બધા લાગુ પડે તે પસંદ કરો)', pa: 'ਸ਼੍ਰੇਣੀ (ਸਭ ਲਾਗੂ ਚੁਣੋ)', kn: 'ವರ್ಗ (ಎಲ್ಲಾ ಅನ್ವಯಿಸುವವುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ)', ml: 'വിഭാഗം (ബാധകമായതെല്ലാം തിരഞ്ഞെടുക്കുക)', or: 'ଶ୍ରେଣୀ (ସମସ୍ତ ପ୍ରଯୁଜ୍ୟ ଚୟନ କରନ୍ତୁ)', ur: 'زمرہ (تمام لاگو کا انتخاب کریں)', as: 'শ্ৰেণী (প্ৰযোজ্য সকলো নিৰ্বাচন কৰক)', ks: 'زمرہ (تمام لاگو منتخب کٔرِو)', kok: 'वर्ग (सगले लागू जाल्ले निवडात)', mai: 'श्रेणी (सब लागू होइत चुनू)', sd: 'قسم (سڀ لاڳو چونڊيو)', ne: 'कोटि (सबै लागु हुने चयन गर्नुहोस्)', sa: 'वर्गः (सर्वान् अन्वितान् चिनुत)', sat: 'ᱛᱷᱚᱠ (ᱡᱳᱛ ᱮᱱᱮᱢ ᱵᱟᱪᱷᱟᱣ)', brx: 'श्रेणी (सब लागो फिन सोलों)', doi: 'श्रेणी (सारे लागू चुनो)', },
  choose_language: { hi: 'अपनी भाषा चुनें', en: 'Choose your language', mr: 'तुमची भाषा निवडा', bn: 'আপনার ভাষা নির্বাচন করুন', ta: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', te: 'మీ భాషను ఎంచుకోండి', gu: 'તમારી ભાષા પસંદ કરો', pa: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', or: 'ଆପଣଙ୍କ ଭାଷା ଚୟନ କରନ୍ତୁ', ur: 'اپنی زبان منتخب کریں', as: 'আপোনাৰ ভাষা বাছনি কৰক', ks: 'پنٕہِ زبان منتخب کٔرِو', kok: 'तुमची भास निवडात', mai: 'अहाँक भाषा चुनू', sd: 'پنهنجي ٻولي چونڊيو', ne: 'आफ्नो भाषा चुन्नुहोस्', sa: 'स्वभाषां चिनुत', sat: 'ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱚᱱ ᱢᱮ', brx: 'आंनि जोंखानि खालाम', doi: 'अपनी भाषा चुनो', },
  choose_role: { hi: 'Choose your role to get started', en: 'Choose your role to get started', mr: 'सुरु करण्यासाठी तुमची भूमिका निवडा', bn: 'শুরু করতে আপনার ভূমিকা বেছে নিন', ta: 'தொடங்க உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்', te: 'ప్రారంభించడానికి మీ పాత్రను ఎంచుకోండి', gu: 'શરૂ કરવા તમારી ભૂમિકા પસંદ કરો', pa: 'ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ', kn: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'ആരംഭിക്കാൻ നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക', or: 'ଆରମ୍ଭ କରିବାକୁ ଆପଣଙ୍କ ଭୂମିକା ବାଛନ୍ତୁ', ur: 'شروع کرنے کے لیے اپنا کردار منتخب کریں', as: 'আৰম্ভ কৰিবলৈ আপোনাৰ ভূমিকা বাছক', ks: 'شروع کرنہٕ خاطرِ پنٕہِ کردار منتخب کٔرِو', kok: 'सुरु करपा खातीर तुमची भूमिका निवडात', mai: 'शुरू करैक लेल अपन भूमिका चुनू', sd: 'شروع ڪرڻ لاءِ پنهنجو ڪردار چونڊيو', ne: 'सुरु गर्न आफ्नो भूमिका छान्नुहोस्', sa: 'आरम्भाय स्वभूमिकां चिनुत', sat: 'ᱮᱩ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱯᱟᱴ ᱵᱟᱪᱷᱟᱣᱢᱮ', brx: 'सुरु खालामनो आंनि भूमिका सोलों', doi: 'शुरू करन लई आपदी भूमिका चुनो', },
  closed_now: { hi: 'Band hai', en: 'Closed now', mr: 'आता बंद आहे', bn: 'এখন বন্ধ', ta: 'இப்போது மூடப்பட்டுள்ளது', te: 'ఇప్పుడు మూసివేయబడింది', gu: 'હવે બંધ છે', pa: 'ਹੁਣ ਬੰਦ ਹੈ', kn: 'ಈಗ ಮುಚ್ಚಲಾಗಿದೆ', ml: 'ഇപ്പോൾ അടച്ചിരിക്കുന്നു', or: 'ବର୍ତ୍ତମାନ ବନ୍ଦ', ur: 'ابھی بند ہے', as: 'এতিয়া বন্ধ', ks: 'أس بند چھُ', kok: 'आता बंद आसा', mai: 'अखनी बंद अछि', sd: 'هاڻي بند آهي', ne: 'अहिले बन्द छ', sa: 'साम्प्रतम् पिहितम्', sat: 'ᱱᱤᱛ ᱵᱚᱸᱫᱽ', brx: 'दान बंद', doi: 'हल्ली बंद है', },
  confirmed: { hi: 'CONFIRMED', en: 'CONFIRMED', mr: 'CONFIRMED', bn: 'নিশ্চিত', ta: 'உறுதி', te: 'నిర్ధారించబడింది', gu: 'પુષ્ટિ', pa: 'ਪੁਸ਼ਟੀ', kn: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ', ml: 'സ്ഥിരീകരിച്ചു', or: 'ନିଶ୍ଚିତ', ur: 'مصنوعہ', as: 'নিশ্চিত', ks: 'مصنوعہ', kok: 'पक्को', mai: 'पुष्टि', sd: 'تصديق ٿيل', ne: 'पुष्टि', sa: 'निर्धारितम्', sat: 'ᱥᱤᱠᱟᱨ', brx: 'फैसालाम', doi: 'पक्का', },
  deal_active: { hi: 'Deal Active!', en: 'Deal Active!', mr: 'Deal Active!', bn: 'ডিল সক্রিয়!', ta: 'ஒப்பந்தம் செயலில்!', te: 'డీల్ యాక్టివ్!', gu: 'ડીલ સક્રિય!', pa: 'ਡੀਲ ਐਕਟਿਵ!', kn: 'ಡೀಲ್ ಸಕ್ರಿಯ!', ml: 'ഡീൽ സജീവം!', or: 'ଡିଲ୍ ସକ୍ରିୟ!', ur: 'ڈیل فعال!', as: 'ডিল সক্ৰিয়!', ks: 'ڈیل فعال!', kok: 'डील सक्रिय!', mai: 'डील सक्रिय!', sd: 'ڊيل فعال!', ne: 'डिल सक्रिय!', sa: 'क्रयविक्रयम् सक्रियम्!', sat: 'ᱰᱤᱞ ᱠᱟᱹᱢᱤᱨᱮ!', brx: 'डील जों!', doi: 'डील सक्रिय!', },
  dekho_kaun: { hi: 'Dekho kaun kisko trust karta hai', en: 'See who trusts whom', mr: 'पाहा कोण कोणावर विश्वास ठेवतो', bn: 'দেখুন কে কাকে বিশ্বাস করে', ta: 'யார் யாரை நம்புகிறார்கள் எனப் பாருங்கள்', te: 'ఎవరు ఎవరిని నమ్ముతారో చూడండి', gu: 'જુઓ કોણ કોના પર વિશ્વાસ કરે છે', pa: 'ਦੇਖੋ ਕੌਣ ਕਿਸ \'ਤੇ ਭਰੋਸਾ ਕਰਦਾ ਹੈ', kn: 'ಯಾರು ಯಾರನ್ನು ನಂಬುತ್ತಾರೆ ನೋಡಿ', ml: 'ആര് ആരെ വിശ്വസിക്കുന്നു എന്ന് കാണുക', or: 'ଦେଖନ୍ତୁ କିଏ କାହାକୁ ବିଶ୍ୱାସ କରେ', ur: 'دیکھیں کون کس پر بھروسہ کرتا ہے', as: 'চাওক কোনে কাক বিশ্বাস কৰে', ks: 'وُچھِو کُس کسِس پیٹھ اعتماد چھُ', kok: 'पळयात कोण कोणाचेर विश्वास दवरता', mai: 'देखू कोन कोना पर भरोसा करैत अछि', sd: 'ڏسو ڪير ڪنهن تي ڀروسو ڪري ٿو', ne: 'हेर्नुहोस् कसले कसलाई विश्वास गर्छ', sa: 'पश्यतु कः कस्मिन् विश्वसिति', sat: 'ᱧᱮᱞᱢᱮ ᱚᱠᱚᱭ ᱚᱠᱚᱭ ᱵᱷᱚᱨᱥᱟ ᱠᱟᱱᱟᱭ', brx: 'नाव सोनो सोनोआव फैसलाजो होनाय', doi: 'वेखो कौन किस्ते भरोसा करदा', },
  demo_hindi: { hi: 'Demo: Hindi Voice Simulation', en: 'Demo: Hindi Voice Simulation', mr: 'Demo: Hindi Voice Simulation', bn: 'Demo: Hindi Voice Simulation', ta: 'Demo: Hindi Voice Simulation', te: 'Demo: Hindi Voice Simulation', gu: 'Demo: Hindi Voice Simulation', pa: 'Demo: Hindi Voice Simulation', kn: 'Demo: Hindi Voice Simulation', ml: 'Demo: Hindi Voice Simulation', or: 'Demo: Hindi Voice Simulation', ur: 'Demo: Hindi Voice Simulation', as: 'Demo: Hindi Voice Simulation', ks: 'Demo: Hindi Voice Simulation', kok: 'Demo: Hindi Voice Simulation', mai: 'Demo: Hindi Voice Simulation', sd: 'Demo: Hindi Voice Simulation', ne: 'Demo: Hindi Voice Simulation', sa: 'Demo: Hindi Voice Simulation', sat: 'Demo: Hindi Voice Simulation', brx: 'Demo: Hindi Voice Simulation', doi: 'Demo: Hindi Voice Simulation', },
  din_pehle: { hi: ' din pehle', en: ' days ago', mr: ' दिवसापूर्वी', bn: ' দিন আগে', ta: ' நாள் முன்பு', te: ' రోజు క్రితం', gu: ' દિવસ પહેલા', pa: ' ਦਿਨ ਪਹਿਲਾਂ', kn: ' ದಿನದ ಹಿಂದೆ', ml: ' ദിവസം മുമ്പ്', or: ' ଦିନ ପୂର୍ବେ', ur: ' دن پہلے', as: ' দিন আগত', ks: ' دۄہ پہلے', kok: ' दीसा आदीं', mai: ' दिन पहिने', sd: ' ڏينهن اڳي', ne: ' दिन अघि', sa: ' दिनात् प्राक्', sat: ' ᱢᱟᱦᱟ ᱞᱟᱦᱟ', brx: ' दिन सिगां', doi: ' दिन पैह्ले', },
  dukaan: { hi: 'Dukaan', en: 'Shop', mr: 'Dukaan', bn: 'দোকান', ta: 'கடை', te: 'షాప్', gu: 'દુકાન', pa: 'ਦੁਕਾਨ', kn: 'ಅಂಗಡಿ', ml: 'കട', or: 'ଦୋକାନ', ur: 'دوکان', as: 'দোকান', ks: 'دوکان', kok: 'दुकान', mai: 'दुकान', sd: 'دڪان', ne: 'पसल', sa: 'आपणम्', sat: 'ᱫᱳᱠᱟᱱ', brx: 'दुकान', doi: 'दुकान' },
  edit_profile: { hi: 'Profile Edit karein', en: 'Edit Profile', mr: 'प्रोफाइल संपादित करा', bn: 'প্রোফাইল সম্পাদনা করুন', ta: 'சுயவிவரத்தைத் திருத்தவும்', te: 'ప్రొఫైల్‌ను సవరించండి', gu: 'પ્રોફાઇલ સંપાદિત કરો', pa: 'ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ', kn: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', ml: 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക', or: 'ପ୍ରୋଫାଇଲ ସମ୍ପାଦନା କରନ୍ତୁ', ur: 'پروفائل میں ترمیم کریں', as: 'প্ৰফাইল সম্পাদনা কৰক', ks: 'پروفائل اڈیٹ کٔرِو', kok: 'प्रोफायल एडिट करात', mai: 'प्रोफाइल संपादित करू', sd: 'پروفائيل ترميم ڪريو', ne: 'प्रोफाइल सम्पादन गर्नुहोस्', sa: 'वृत्तं संपादयतु', sat: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱵᱚᱫᱚᱞ', brx: 'प्रोफाइल सोलाय', doi: 'प्रोफाइल तबदील करो', },
  friend: { hi: 'Friend', en: 'Friend', mr: 'Friend', bn: 'Friend', ta: 'Friend', te: 'Friend', gu: 'Friend', pa: 'Friend', kn: 'Friend', ml: 'Friend', or: 'Friend', ur: 'Friend', as: 'Friend', ks: 'Friend', kok: 'Friend', mai: 'Friend', sd: 'Friend', ne: 'Friend', sa: 'Friend', sat: 'Friend', brx: 'Friend', doi: 'Friend' },
  full_name: { hi: 'FULL NAME', en: 'FULL NAME', mr: 'पूर्ण नाव', bn: 'পুরো নাম', ta: 'முழு பெயர்', te: 'పూర్తి పేరు', gu: 'પૂરું નામ', pa: 'ਪੂਰਾ ਨਾਂ', kn: 'ಪೂರ್ಣ ಹೆಸರು', ml: 'പൂർണ്ണമായ പേര്', or: 'ପୂରା ନାମ', ur: 'پورا نام', as: 'পূৰ্ণ নাম', ks: 'پوٗرٕ ناو', kok: 'पूर्ण नांव', mai: 'पूरा नाम', sd: 'پورو نالو', ne: 'पूरा नाम', sa: 'पूर्णनाम', sat: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ', brx: 'फुंथाइ मुं', doi: 'पूरा नां', },
  ghante_pehle: { hi: ' ghante pehle', en: ' hours ago', mr: ' तासापूर्वी', bn: ' ঘন্টা আগে', ta: ' மணி முன்பு', te: ' గంట క్రితం', gu: ' કલાક પહેલા', pa: ' ਘੰਟੇ ਪਹਿਲਾਂ', kn: ' ಗಂಟೆಯ ಹಿಂದೆ', ml: ' മണിക്കൂർ മുമ്പ്', or: ' ଘଣ୍ଟା ପୂର୍ବେ', ur: ' گھنٹے پہلے', as: ' ঘণ্টা আগত', ks: ' گھنٹے پہلے', kok: ' वरा आदीं', mai: ' घंटा पहिने', sd: ' ڪلاڪ اڳي', ne: ' घण्टा अघि', sa: ' होरातः प्राक्', sat: ' ᱴᱟᱲᱟᱝ ᱞᱟᱦᱟ', brx: ' घंटा सिगां', doi: ' कुंआ पैह्ले', },
  group_deal: { hi: 'Group Deal', en: 'Group Deal', mr: 'Group Deal', bn: 'গ্রুপ ডিল', ta: 'குழு ஒப்பந்தம்', te: 'గ్రూప్ డీల్', gu: 'ગ્રુપ ડીલ', pa: 'ਗਰੁੱਪ ਡੀਲ', kn: 'ಗ್ರೂಪ್ ಡೀಲ್', ml: 'ഗ്രൂപ്പ് ഡീൽ', or: 'ଗ୍ରୁପ୍ ଡିଲ୍', ur: 'گروپ ڈیل', as: 'গ্ৰুপ ডিল', ks: 'گروپ ڈیل', kok: 'ग्रुप डील', mai: 'ग्रुप डील', sd: 'گروپ ڊيل', ne: 'ग्रुप डिल', sa: 'समूहक्रयविक्रयम्', sat: 'ᱜᱽᱨᱩᱯ ᱰᱤᱞ', brx: 'ग्रुप डील', doi: 'ग्रुप डील', },
  group_deal_join: { hi: 'Group Deal Mein Shamil Ho', en: 'Join Group Deal', mr: 'Group Deal मध्ये सामील व्हा', bn: 'গ্রুপ ডিলে যোগ দিন', ta: 'குழு ஒப்பந்தத்தில் சேர்க்க', te: 'గ్రూప్ డీల్‌లో చేరండి', gu: 'ગ્રુપ ડીલમાં જોડાઓ', pa: 'ਗਰੁੱਪ ਡੀਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ', kn: 'ಗ್ರೂಪ್ ಡೀಲ್‌ನಲ್ಲಿ ಸೇರಿ', ml: 'ഗ്രൂപ്പ് ഡീലിൽ ചേരുക', or: 'ଗ୍ରୁପ୍ ଡିଲରେ ଯୋଗଦାନ କରନ୍ତୁ', ur: 'گروپ ڈیل میں شامل ہوں', as: 'গ্ৰুপ ডিলত যোগদান কৰক', ks: 'گروپ ڈیلس شٲمل گژھیو', kok: 'ग्रुप डीलांत सामील जात', mai: 'ग्रुप डील मे शामिल हो', sd: 'گروپ ڊيل ۾ شامل ٿيو', ne: 'ग्रुप डिलमा सामेल हुनुहोस्', sa: 'समूहक्रयविक्रये संयोज्यताम्', sat: 'ᱜᱽᱨᱩᱯ ᱰᱤᱞ ᱨᱮ ᱥᱮᱞᱮᱫ ᱢᱮ', brx: 'ग्रुप डीलाव सोलों', doi: 'ग्रुप डील च शामल हो', },
  group_deal_joined_notif: { hi: 'Group Deal active! Banarasi Silk Saree — 20% off', en: 'Group Deal active! Banarasi Silk Saree — 20% off', mr: 'Group Deal active! Banarasi Silk Saree — 20% off', bn: 'Group Deal active! Banarasi Silk Saree — 20% off', ta: 'Group Deal active! Banarasi Silk Saree — 20% off', te: 'Group Deal active! Banarasi Silk Saree — 20% off', gu: 'Group Deal active! Banarasi Silk Saree — 20% off', pa: 'Group Deal active! Banarasi Silk Saree — 20% off', kn: 'Group Deal active! Banarasi Silk Saree — 20% off', ml: 'Group Deal active! Banarasi Silk Saree — 20% off', or: 'Group Deal active! Banarasi Silk Saree — 20% off', ur: 'Group Deal active! Banarasi Silk Saree — 20% off', as: 'Group Deal active! Banarasi Silk Saree — 20% off', ks: 'Group Deal active! Banarasi Silk Saree — 20% off', kok: 'Group Deal active! Banarasi Silk Saree — 20% off', mai: 'Group Deal active! Banarasi Silk Saree — 20% off', sd: 'Group Deal active! Banarasi Silk Saree — 20% off', ne: 'Group Deal active! Banarasi Silk Saree — 20% off', sa: 'Group Deal active! Banarasi Silk Saree — 20% off', sat: 'Group Deal active! Banarasi Silk Saree — 20% off', brx: 'Group Deal active! Banarasi Silk Saree — 20% off', doi: 'Group Deal active! Banarasi Silk Saree — 20% off' },
  group_deal_joined_toast: { hi: 'Group Deal mein shamil ho gaye! 20% sasta!', en: 'You joined the group deal! 20% off!', mr: 'Group Deal mein shamil ho gaye! 20% sasta!', bn: 'Group Deal mein shamil ho gaye! 20% sasta!', ta: 'Group Deal mein shamil ho gaye! 20% sasta!', te: 'Group Deal mein shamil ho gaye! 20% sasta!', gu: 'Group Deal mein shamil ho gaye! 20% sasta!', pa: 'Group Deal mein shamil ho gaye! 20% sasta!', kn: 'Group Deal mein shamil ho gaye! 20% sasta!', ml: 'Group Deal mein shamil ho gaye! 20% sasta!', or: 'Group Deal mein shamil ho gaye! 20% sasta!', ur: 'Group Deal mein shamil ho gaye! 20% sasta!', as: 'Group Deal mein shamil ho gaye! 20% sasta!', ks: 'Group Deal mein shamil ho gaye! 20% sasta!', kok: 'Group Deal mein shamil ho gaye! 20% sasta!', mai: 'Group Deal mein shamil ho gaye! 20% sasta!', sd: 'Group Deal mein shamil ho gaye! 20% sasta!', ne: 'Group Deal mein shamil ho gaye! 20% sasta!', sa: 'Group Deal mein shamil ho gaye! 20% sasta!', sat: 'Group Deal mein shamil ho gaye! 20% sasta!', brx: 'Group Deal mein shamil ho gaye! 20% sasta!', doi: 'Group Deal mein shamil ho gaye! 20% sasta!' },
  group_deal_sub: { hi: '3 log milke — 20% sasta', en: '3 people together — 20% off', mr: '3 जण मिळून — 20% स्वस्त', bn: '3 জন মিলে — 20% সস্তা', ta: '3 பேர் சேர்ந்து — 20% தள்ளுபடி', te: '3 మంది కలిసి — 20% తగ్గింపు', gu: '3 લોકો ભેગા — 20% સસ્તું', pa: '3 ਲੋਕ ਰਲ ਕੇ — 20% ਸਸਤਾ', kn: '3 ಜನ ಸೇರಿ — 20% ರಿಯಾಯಿತಿ', ml: '3 പേർ ഒത്തുചേർന്ന് — 20% വിലക്കുറവ്', or: '3 ଲୋକ ମିଶି — 20% ସସ୍ତା', ur: '3 لوگ مل کر — 20% سستا', as: '3 লোকে লগ লাগি — 20% সস্তা', ks: '3 نفر شریک — 20% سستا', kok: '3 जाण एकठांय — 20% स्वस्त', mai: '3 लोक मिलि — 20% सस्त', sd: '3 ماڻهو گڏجي — 20% سستو', ne: '3 जना मिलेर — 20% सस्तो', sa: '3 जनाः संयुक्ता — 20% न्यूनम्', sat: '3 ᱦᱚᱲ ᱢᱤᱫ ᱠᱟᱛᱮ — 20% ᱠᱚᱢ', brx: '3 मानसियै जागाय — 20% होग्रा', doi: '3 लोक रल के — 20% सस्ता', },
  heart_icon_hint: { hi: 'Product detail mein heart icon tap karein', en: 'Tap the heart icon on product detail', mr: 'उत्पादन तपशीलात हार्ट आयकॉन दाबा', bn: 'পণ্যের বিস্তারিততে হার্ট আইকন ট্যাপ করুন', ta: 'பொருள் விவரத்தில் ஹார்ட் ஐகானைத் தட்டவும்', te: 'ఉత్పత్తి వివరాలలో హార్ట్ ఐకాన్ నొక్కండి', gu: 'પ્રોડક્ટની વિગતમાં હાર્ટ આઇકોન ટેપ કરો', pa: 'ਉਤਪਾਦ ਦੇ ਵੇਰਵੇ ਵਿੱਚ ਦਿਲ ਆਈਕਨ \'ਤੇ ਟੈਪ ਕਰੋ', kn: 'ಉತ್ಪನ್ನದ ವಿವರದಲ್ಲಿ ಹಾರ್ಟ್ ಐಕಾನ್ ಟ್ಯಾಪ್ ಮಾಡಿ', ml: 'ഉൽപ്പന്ന വിവരങ്ങളിൽ ഹാർട്ട് ഐക്കണിൽ ടാപ്പ് ചെയ്യുക', or: 'ପଣ୍ୟ ବିସ୍ତୃତିରେ ହାର୍ଟ ଆଇକନ ଟାପ କରନ୍ତୁ', ur: 'مصنوعات کی تفصیل میں ہارٹ آئیکن پر ٹیپ کریں', as: 'পণ্যৰ বিৱৰণত হাৰ্ট আইকনত টেপ কৰক', ks: 'پنہِ مصنوع کِس تفصیلَس منٛز ہارٹ آئیکن تھپتھپایِو', kok: 'उत्पादन तपशिलांत हार्ट आयकन दाबात', mai: 'उत्पादन विवरण में हार्ट आइकन टैप करू', sd: 'پراڊڪٽ جي تفصيل ۾ دل جي آئڪن تي ٽيپ ڪريو', ne: 'उत्पादन विवरणमा हार्ट आइकन ट्याप गर्नुहोस्', sa: 'उत्पादविवरणे हृदयचिह्नं नोदयतु', sat: 'ᱥᱟᱢᱟᱱ ᱵᱟᱵᱚᱛ ᱨᱮ ᱦᱟᱨᱴ ᱪᱤᱱᱦᱟᱹ ᱴᱟᱯᱮ', brx: 'उत्पादननि फिसायै हार्ट आइकन खामालाम', doi: 'उत्पादन दे गल्ल च हार्ट आइकन ते टैप करो', },
  in_stock: { hi: ' in stock', en: ' in stock', mr: ' स्टॉकमध्ये', bn: ' স্টকে', ta: ' இருப்பில்', te: ' స్టాక్లో', gu: ' સ્ટોકમાં', pa: ' ਸਟਾਕ ਵਿੱਚ', kn: ' ಸ್ಟಾಕ್‌ನಲ್ಲಿ', ml: ' സ്റ്റോക്കിൽ', or: ' ଷ୍ଟକ୍ରେ', ur: ' اسٹاک میں', as: ' ষ্টকত', ks: ' اسٹاکس منٛز', kok: ' स्टॉकांत', mai: ' स्टॉक में', sd: ' اسٽاڪ ۾', ne: ' स्टकमा', sa: ' सम्भारे', sat: ' ᱥᱴᱚᱠ ᱨᱮ', brx: ' स्टॉकाव', doi: ' स्टॉक च', },
  interests_label: { hi: 'Interests', en: 'Interests', mr: 'आवडी', bn: 'আগ্রহ', ta: 'ஆர்வங்கள்', te: 'ఆసక్తులు', gu: 'રુચિઓ', pa: 'ਦਿਲਚਸਪੀਆਂ', kn: 'ಆಸಕ್ತಿಗಳು', ml: 'താൽപ്പര്യങ്ങൾ', or: 'ଆଗ୍ରହ', ur: 'دلچسپیاں', as: 'আগ্ৰহ', ks: 'دلچسپیاں', kok: 'आवडी', mai: 'रुचि', sd: 'دلچسپيون', ne: 'रुचिहरू', sa: 'रुचयः', sat: 'ᱨᱩᱪᱤ', brx: 'मोनथाइ', doi: 'रुचियां', },
  item_added_manual: { hi: 'Item add ho gayi! Dukaan mein dikhegi.', en: 'Item added! It will appear in your shop.', mr: 'वस्तू जोडली! तुमच्या दुकानात दिसेल.', bn: 'আইটেম যোগ হয়েছে! আপনার দোকানে দেখাবে।', ta: 'பொருள் சேர்க்கப்பட்டது! உங்கள் கடையில் தெரியும்.', te: 'అంశం జోడించబడింది! మీ షాప్‌లో కనిపిస్తుంది.', gu: 'આઇટમ ઉમેરાયું! તમારી દુકાનમાં દેખાશે.', pa: 'ਆਈਟਮ ਜੋੜ ਦਿੱਤੀ! ਤੁਹਾਡੀ ਦੁਕਾਨ \'ਚ ਦਿਸੇਗੀ।', kn: 'ವಸ್ತು ಸೇರಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.', ml: 'ഇനം ചേർത്തു! നിങ്ങളുടെ കടയിൽ ദൃശ്യമാകും.', or: 'ଆଇଟମ ଯୋଡ଼ାଗଲା! ଆପଣଙ୍କ ଦୋକାନରେ ଦେଖାଯିବ।', ur: 'آئٹم شامل ہو گئی! آپ کی دکان میں نظر آئے گی۔', as: 'আইটেম যোগ হৈ গল! আপোনাৰ দোকানত দেখা যাব।', ks: 'آئٹم شامل گژھ! پنٕہِ دکانس منٛز نظر ییہ۔', kok: 'आयटम जोडलो! तुमच्या दुकानात दिसतलो।', mai: 'आइटम जुड़ि गेल! अहाँक दुकान में देखाएत।', sd: 'آئٽم شامل ٿي ويو! توهان جي دڪان ۾ نظر ايندو۔', ne: 'वस्तु थपियो! तपाईंको पसलमा देखिनेछ।', sa: 'वस्तुः योजिता! भवतः आपणे दृश्यते।', sat: 'ᱟᱭᱴᱮᱢ ᱥᱮᱞᱮᱫ! ᱟᱢᱟᱜ ᱫᱳᱠᱟᱱ ᱨᱮ ᱧᱮᱞᱚᱜᱟ।', brx: 'आइटम सोलोबाय! आंनि दुकानाव जों।', doi: 'आइटम जुड़ गी! तुहाडी दुकान च दिस्सी।', },
  item_added_voice: { hi: 'Item add ho gayi! Voice se add kiya.', en: 'Item added! Added by voice.', mr: 'वस्तू जोडली! वॉइसवरून जोडली.', bn: 'আইটেম যোগ হয়েছে! ভয়েস দিয়ে যোগ করা হয়েছে.', ta: 'பொருள் சேர்க்கப்பட்டது! குரலில் சேர்க்கப்பட்டது.', te: 'అంశం జోడించబడింది! వాయిస్ ద్వారా జోడించబడింది.', gu: 'આઇટમ ઉમેરાયું! વૉઇસ દ્વારા ઉમેરાયું.', pa: 'ਆਈਟਮ ਜੋੜ ਦਿੱਤੀ! ਆਵਾਜ਼ ਰਾਹੀਂ ਜੋੜੀ.', kn: 'ವಸ್ತು ಸೇರಿಸಲಾಗಿದೆ! ಧ್ವನಿ ಮೂಲಕ ಸೇರಿಸಲಾಗಿದೆ.', ml: 'ഇനം ചേർത്തു! ശബ്ദത്തിലൂടെ ചേർത്തു.', or: 'ଆଇଟମ ଯୋଡ଼ାଗଲା! ଭଏସରେ ଯୋଡ଼ାଗଲା.', ur: 'آئٹم شامل ہو گئی! آواز سے شامل کی۔', as: 'আইটেম যোগ হৈ গল! কণ্ঠেৰে যোগ হৈ গল।', ks: 'آئٹم شامل گژھ! آواز سۭتہ شامل۔', kok: 'आयटम जोडलो! आवाजान जोडलो.', mai: 'आइटम जुड़ि गेल! आवाज स जुड़ल।', sd: 'آئٽم شامل ٿي ويو! آواز سان شامل.', ne: 'वस्तु थपियो! आवाजबाट थपियो।', sa: 'वस्तुः योजिता! स्वरेण योजिता।', sat: 'ᱟᱭᱴᱮᱢ ᱥᱮᱞᱮᱫ! ᱨᱟᱦᱟ ᱛᱮ ᱥᱮᱞᱮᱫ।', brx: 'आइटम सोलोबाय! रावनो सोलोबाय।', doi: 'आइटम जुड़ गी! आवाज च जुड़ी।', },
  item_published: { hi: 'Listing publish ho gayi! Dukaan mein dikhegi.', en: 'Listing published! It will appear in your shop.', mr: 'यादी प्रकाशित झाली! दुकानात दिसेल.', bn: 'লিস্টিং প্রকাশিত! দোকানে দেখাবে।', ta: 'பட்டியல் வெளியிடப்பட்டது! கடையில் தெரியும்।', te: 'లిస్టింగ్ ప్రచురించబడింది! షాప్‌లో కనిపిస్తుంది।', gu: 'લિસ્ટિંગ પ્રકાશિત! દુકાનમાં દેખાશે।', pa: 'ਲਿਸਟਿੰਗ ਪ੍ਰਕਾਸ਼ਿਤ! ਦੁਕਾਨ \'ਚ ਦਿਸੇਗੀ।', kn: 'ಲಿಸ್ಟಿಂಗ್ ಪ್ರಕಟಿಸಲಾಗಿದೆ! ಅಂಗಡಿಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ।', ml: 'ലിസ്റ്റിംഗ് പ്രസിദ്ധീകരിച്ചു! കടയിൽ ദൃശ്യമാകും।', or: 'ଲିସ୍ଟିଂ ପ୍ରକାଶିତ! ଦୋକାନରେ ଦେଖାଯିବ।', ur: 'لسٹنگ شائع! دکان میں نظر آئے گی۔', as: 'লিষ্টিং প্ৰকাশিত! দোকানত দেখা যাব।', ks: 'لسٹنگ شایع! دکانس منٛز نظر ییہ۔', kok: 'यादी प्रकाशित! दुकानात दिसतली।', mai: 'लिस्टिंग प्रकाशित! दुकान में देखाएत।', sd: 'لسٽنگ شايع! دڪان ۾ نظر ايندي۔', ne: 'लिस्टिङ प्रकाशित! पसलमा देखिनेछ।', sa: 'सूची प्रकाशिता! आपणे दृश्यते।', sat: 'ᱞᱤᱥᱴᱤᱝ ᱯᱟᱨᱥᱟᱞ! ᱫᱳᱠᱟᱱ ᱨᱮ ᱧᱮᱞᱚᱜᱟ।', brx: 'लिस्टिंग फैसालाय! आंनि दुकानाव जों।', doi: 'लिस्टिंग प्रकाशित! दुकान च दिस्सी।', },
  items_label: { hi: ' items', en: ' items', mr: ' वस्तू', bn: ' টি আইটেম', ta: ' பொருட்கள்', te: ' వస్తువులు', gu: ' આઇટમ', pa: ' ਆਈਟਮ', kn: ' ವಸ್ತುಗಳು', ml: ' ഇനങ്ങൾ', or: ' ଆଇଟମ', ur: ' آئیٹمز', as: ' আইটেম', ks: ' آئٹم', kok: ' वस्तू', mai: ' आइटम', sd: ' آئٽم', ne: ' वस्तुहरू', sa: ' वस्तूनि', sat: ' ᱟᱭᱴᱮᱢ', brx: ' आइटम', doi: ' आइटम', },
  joined: { hi: 'Joined', en: 'Joined', mr: 'Joined', bn: 'যুক্ত হয়েছে', ta: 'இணைந்தார்', te: 'చేరారు', gu: 'જોડાયા', pa: 'ਸ਼ਾਮਿਲ', kn: 'ಸೇರಿದ್ದಾರೆ', ml: 'ചേർന്നു', or: 'ଯୋଗଦେଲେ', ur: 'شامل ہو گئے', as: 'যোগদান কৰিলে', ks: 'شامل گژھنہٕ', kok: 'जोडले', mai: 'जुड़ गेल', sd: 'شامل ٿيو', ne: 'सामेल भए', sa: 'संयुतः', sat: 'ᱥᱮᱞᱮᱫ', brx: 'जोरोदों', doi: 'शामल', },
  koi_listing_nahi: { hi: 'Koi listing nahi mila', en: 'No listings found', mr: 'कोणतीही यादी सापडली नाही', bn: 'কোনো লিস্টিং পাওয়া যায়নি', ta: 'பட்டியல் எதுவும் கிடைக்கவில்லை', te: 'జాబితా ఏదీ కనుగొనబడలేదు', gu: 'કોઈ લિસ્ટિંગ મળી નથી', pa: 'ਕੋਈ ਲਿਸਟਿੰਗ ਨਹੀਂ ਮਿਲੀ', kn: 'ಯಾವುದೇ ಲಿಸ್ಟಿಂಗ್ ಸಿಕ್ಕಿಲ್ಲ', ml: 'ലിസ്റ്റിംഗ് ഒന്നും കണ്ടെത്തിയില്ല', or: 'କୌଣସି ଲିସ୍ଟିଂ ମିଳିଲା ନାହିଁ', ur: 'کوئی لسٹنگ نہیں ملی', as: 'কোনো লিষ্টিং পোৱা নগল', ks: 'کھۄتہٕ لسٹنگ نہ مِلنہٕ', kok: 'कणय यादी सापडली ना', mai: 'कोनो लिस्टिंग नहि भेटल', sd: 'ڪائي لسٽنگ نه ملي', ne: 'कुनै लिस्टिङ भेटिएन', sa: 'न कोऽपि सूची लभ्यते', sat: 'ᱪᱷᱟᱹᱴᱭᱟᱹᱨ ᱵᱟᱝ ᱧᱟᱢ', brx: 'लिस्टिंग मोनसेबो मोनजा', doi: 'कोई लिस्टिंग नी लब्भी', },
  koi_notification_nahi: { hi: 'Koi notification nahi', en: 'No notifications', mr: 'कोणतेही नोटिफिकेशन नाही', bn: 'কোনো বিজ্ঞপ্তি নেই', ta: 'அறிவிப்புகள் எதுவும் இல்லை', te: 'నోటిఫికేషన్లు లేవు', gu: 'કોઈ સૂચના નથી', pa: 'ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ', kn: 'ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ', ml: 'അറിയിപ്പുകളൊന്നുമില്ല', or: 'କୌଣସି ବିଜ୍ଞପ୍ତି ନାହିଁ', ur: 'کوئی اطلاع نہیں', as: 'কোনো জাননী নাই', ks: 'کھۄتہٕ اطلاع نہیں', kok: 'कणले नोटिफिकेशन ना', mai: 'कोनो सूचना नहि', sd: 'ڪا اطلاع نه آهي', ne: 'कुनै सूचना छैन', sa: 'न कापि सूचना', sat: 'ᱠᱷᱚᱵᱚᱨ ᱵᱟᱱᱩ', brx: 'नोटिफिकेशन मोनसेबो मोनजा', doi: 'कोई सूचना नी', },
  koi_order_nahi: { hi: 'Abhi tak koi order nahi', en: 'No orders yet', mr: 'आत्तापर्यंत कोणताही ऑर्डर नाही', bn: 'এখনো কোনো অর্ডার নেই', ta: 'இதுவரை ஆர்டர்கள் இல்லை', te: 'ఇంకా ఆర్డర్లు లేవు', gu: 'હજી સુધી કોઈ ઓર્ડર નથી', pa: 'ਹਾਲੇ ਤੱਕ ਕੋਈ ਆਰਡਰ ਨਹੀਂ', kn: 'ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ', ml: 'ഇതുവരെ ഓർഡറുകളൊന്നുമില്ല', or: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଅର୍ଡର ନାହିଁ', ur: 'ابھی تک کوئی آرڈر نہیں', as: 'এতিয়ালৈকে কোনো অৰ্ডাৰ নাই', ks: 'أس تامھی کاہُنہٕ آرڈر نہ', kok: 'आयजमेरेन कणय ऑर्डर ना', mai: 'एहि धरि कोनो आर्डर नहि', sd: 'اڃا تائين ڪو آرڊر نه آهي', ne: 'अहिलेसम्म कुनै अर्डर छैन', sa: 'इदानीम् न कोऽपि आदेशः', sat: 'ᱵᱷᱩᱨ ᱪᱷᱟᱹᱴᱭᱟᱹᱨ ᱟᱨᱰᱟᱨ', brx: 'थामायै मोनसेबो आर्डर मोनजा', doi: 'हले तक कोई आर्डर नी', },
  koi_seller_nahi: { hi: 'Koi saved seller nahi', en: 'No saved sellers', mr: 'कोणीही सेव केलेला विक्रेता नाही', bn: 'কোনো সংরক্ষিত বিক্রেতা নেই', ta: 'சேமித்த விற்பனையாளர் இல்லை', te: 'సేవ్ చేసిన విక్రేత ఎవరూ లేరు', gu: 'કોઈ સાચવેલ વિક્રેતા નથી', pa: 'ਕੋਈ ਸੇਵ ਕੀਤਾ ਵਿਕਰੇਤਾ ਨਹੀਂ', kn: 'ಯಾವುದೇ ಉಳಿಸಿದ ಮಾರಾಟಗಾರರಿಲ್ಲ', ml: 'സംരക്ഷിച്ച വിൽപ്പനക്കാരില്ല', or: 'କୌଣସି ସଞ୍ଚୟ ବିକ୍ରେତା ନାହିଁ', ur: 'کوئی محفوظ فروخت کنندہ نہیں', as: 'কোনো সংৰক্ষিত বিক্ৰেতা নাই', ks: 'کھۄتہٕ محفوظ فروخت کنندہ نہ', kok: 'कणय सांबाळून दवरिल्लो विक्रेता ना', mai: 'कोनो सेव कएल विक्रेता नहि', sd: 'ڪو به محفوظ وڪرو ڪندڙ نه آهي', ne: 'कुनै सुरक्षित बिक्रेता छैन', sa: 'न कोऽपि रक्षितविक्रेता', sat: 'ᱨᱟᱠᱷᱟᱢᱟᱱ ᱟ.ᱠᱤᱱ ᱵᱟᱱᱩ', brx: 'राखियाफिनो खातिरदार मोनसेबो मोनजा', doi: 'कोई सेव के वेचण आला नी', },
  kripya_fill: { hi: 'Kripya title, category aur price fill karein', en: 'Please fill title, category and price', mr: 'कृपया शीर्षक, श्रेणी आणि किंमत भरा', bn: 'দয়া করে শিরোনাম, বিভাগ এবং দাম পূরণ করুন', ta: 'தயவுசெய்து தலைப்பு, வகை மற்றும் விலையை நிரப்பவும்', te: 'దయచేసి టైటిల్, వర్గం మరియు ధరను పూరించండి', gu: 'કૃપા કરીને શીર્ષક, શ્રેણી અને કિંમત ભરો', pa: 'ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਲੇਖ, ਸ਼੍ਰੇਣੀ ਅਤੇ ਕੀਮਤ ਭਰੋ', kn: 'ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ, ವರ್ಗ ಮತ್ತು ಬೆಲೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ', ml: 'ദയവായി തലക്കെട്ട്, വിഭാഗം, വില എന്നിവ പൂരിപ്പിക്കുക', or: 'ଦୟାକରି ଟାଇଟଲ, ଶ୍ରେଣୀ ଏବଂ ମୂଲ୍ୟ ପୂରଣ କରନ୍ତୁ', ur: 'برائے مہربانی عنوان، زمرہ اور قیمت بھریں', as: 'দয়া করে শিৰোনাম, শ্ৰেণী আৰু মূল্য পূৰণ কৰক', ks: 'مہربانی کٔرِتھ عنوان، زمرہ تہٕ قیمت پُر کٔرِو', kok: 'कृपया शीर्षक, वर्ग आणि किंमत भरात', mai: 'कृपया शीर्षक, श्रेणी आ पूर्ति भरू', sd: 'مهرباني ڪري عنوان، قسم ۽ قيمت ڀريو', ne: 'कृपया शीर्षक, कोटि र मूल्य भर्नुहोस्', sa: 'कृपया शीर्षकम्, वर्गः मूल्यं च पूर्यताम्', sat: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱧᱩᱛᱩᱢ, ᱛᱷᱳᱠ ᱟᱨ ᱫᱟᱢ ᱯᱩᱨᱟᱹᱣᱢᱮ', brx: 'अनुरोध करियो शीर्षक, श्रेणी आरो मोल खालाम', doi: 'कृपा करी टायटल, श्रेणी ते कीमत भरो', },
  kripya_sab_details: { hi: 'Kripya sab details fill karein', en: 'Please fill all details', mr: 'कृपया सर्व माहिती भरा', bn: 'দয়া করে সব বিবরণ পূরণ করুন', ta: 'அனைத்து விவரங்களையும் நிரப்பவும்', te: 'దయచేసి అన్ని వివరాలను పూరించండి', gu: 'કૃપા કરીને બધી વિગતો ભરો', pa: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਵੇਰਵੇ ਭਰੋ', kn: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ', ml: 'ദയവായി എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക', or: 'ଦୟାକରି ସମସ୍ତ ବିବରଣୀ ପୂରଣ କରନ୍ତୁ', ur: 'برائے مہربانی تمام تفصیلات بھریں', as: 'দয়া করে সকল বিৱৰণ পূৰণ কৰক', ks: 'مہربانی کٔرِتھ تمام تفصیل پُر کٔرِو', kok: 'कृपया सगल्यो माहिती भरात', mai: 'कृपया सब विवरण भरू', sd: 'مهرباني ڪري سڀ تفصيل ڀريو', ne: 'कृपया सबै विवरण भर्नुहोस्', sa: 'कृपया सर्वविवरणानि पूर्यताम्', sat: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱡᱳᱛ ᱵᱟᱵᱚᱛ ᱯᱩᱨᱟᱹᱣᱢᱮ', brx: 'अनुरोध करियो सब फिसाय खालाम', doi: 'कृपा करी सारे गल्ल भरो', },
  kya_kharidte: { hi: 'Kya kya kharidte hain?', en: 'What do you buy?', mr: 'काय काय खरेदी करता?', bn: 'আপনি কী কী কেনেন?', ta: 'நீங்கள் என்ன என்ன வாங்குகிறீர்கள்?', te: 'మీరు ఏమేమి కొంటారు?', gu: 'તમે શું શું ખરીદો છો?', pa: 'ਤੁਸੀਂ ਕੀ ਕੀ ਖਰੀਦਦੇ ਹੋ?', kn: 'ನೀವು ಏನೇನು ಖರೀದಿಸುತ್ತೀರಿ?', ml: 'നിങ്ങൾ എന്തൊക്കെ വാങ്ങുന്നു?', or: 'ଆପଣ କଣ କଣ କିଣନ୍ତି?', ur: 'آپ کیا کیا خریدتے ہیں؟', as: 'আপুনি কি কি কিনে?', ks: 'तुह्य क्या-क्या छान्दिथ?', kok: 'तुमी कितें-कितें विकत घेतात?', mai: 'अहाँ की-की खरीदैत छी?', sd: 'تون ڇا ڇا خريد ڪندا آهيو؟', ne: 'तपाईं के-के किन्नुहुन्छ?', sa: 'भवान् किं-किं क्रीणाति?', sat: 'ᱟᱢ ᱥᱤ-ᱥᱤ ᱠᱤᱱᱢᱮ?', brx: 'नों मा-मा बेरो?', doi: 'तुस की-की खरीददे हो?', },
  lang_select: { hi: 'भाषा चुनें', en: 'Select Language', mr: 'भाषा निवडा', bn: 'ভাষা নির্বাচন করুন', ta: 'மொழியைத் தேர்ந்தெடுக்கவும்', te: 'భాషను ఎంచుకోండి', gu: 'ભાષા પસંદ કરો', pa: 'ਭਾਸ਼ਾ ਚੁਣੋ', kn: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക', or: 'ଭାଷା ବାଛନ୍ତୁ', ur: 'زبان منتخب کریں', as: 'ভাষা বাছক', ks: 'زبان منتخب کٔرِو', kok: 'भास निवडात', mai: 'भाषा चुनू', sd: 'ٻولي چونڊيو', ne: 'भाषा छान्नुहोस्', sa: 'भाषां चिनुत', sat: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ', brx: 'राव जेरनाय', doi: 'बोली चुनो', },
  listing_publish: { hi: 'Listing Publish Karein', en: 'Publish Listing', mr: 'Yadi Prakashit Kara', bn: 'লিস্টিং প্রকাশ করুন', ta: 'பட்டியலை வெளியிடவும்', te: 'లిస్టింగ్ ప్రచురించండి', gu: 'લિસ્ટિંગ પ્રકાશિત કરો', pa: 'ਲਿਸਟਿੰਗ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ', kn: 'ಲಿಸ್ಟಿಂಗ್ ಪ್ರಕಟಿಸಿ', ml: 'ലിസ്റ്റിംഗ് പ്രസിദ്ധീകരിക്കുക', or: 'ଲିସ୍ଟିଂ ପ୍ରକାଶ କରନ୍ତୁ', ur: 'لسٹنگ شائع کریں', as: 'লিষ্টিং প্ৰকাশ কৰক', ks: 'لسٹنگ شایع کٔرِو', kok: 'यादी प्रकाशित करात', mai: 'लिस्टिंग प्रकाशित करू', sd: 'لسٽنگ شايع ڪريو', ne: 'लिस्टिङ प्रकाशित गर्नुहोस्', sa: 'सूची प्रकाश्यताम्', sat: 'ᱞᱤᱥᱴᱤᱝ ᱯᱟᱨᱥᱟᱞ', brx: 'लिस्टिंग फैसालाम', doi: 'लिस्टिंग प्रकाशित करो', },
  listing_taiyaar: { hi: 'Listing taiyaar kar raha hoon...', en: 'Preparing listing...', mr: 'यादी तयार करत आहे...', bn: 'লিস্টিং প্রস্তুত করছি...', ta: 'பட்டியலைத் தயாரிக்கிறேன்...', te: 'లిస్టింగ్ సిద్ధం చేస్తున్నాను...', gu: 'લિસ્ટિંગ તૈયાર કરી રહ્યો છે...', pa: 'ਲਿਸਟਿੰਗ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹਾਂ...', kn: 'ಲಿಸ್ಟಿಂಗ್ ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇನೆ...', ml: 'ലിസ്റ്റിംഗ് തയ്യാറാക്കുന്നു...', or: 'ଲିସ୍ଟିଂ ପ୍ରସ୍ତୁତ କରୁଛି...', ur: 'لسٹنگ تیار کر رہا ہوں...', as: 'লিষ্টিং প্ৰস্তুত কৰি আছো...', ks: 'لسٹنگ تیار چھُس...', kok: 'यादी तयार करता...', mai: 'लिस्टिंग तैयार करि रहल छी...', sd: 'لسٽنگ تيار ڪري رهيو آهيان...', ne: 'लिस्टिङ तयार गर्दै छु...', sa: 'सूची सज्जीकरोमि...', sat: 'ᱞᱤᱥᱴᱤᱝ ᱛᱮᱭᱟᱨ ᱟ.ᱜᱩ...', brx: 'लिस्टिंग रियाद खालामदों...', doi: 'लिस्टिंग तैयार करदा...', },
  listings_header: { hi: 'LISTINGS', en: 'LISTINGS', mr: 'यादी', bn: 'লিস্টিংস', ta: 'பட்டியல்கள்', te: 'జాబితాలు', gu: 'લિસ્ટિંગ્સ', pa: 'ਲਿਸਟਿੰਗਾਂ', kn: 'ಪಟ್ಟಿಗಳು', ml: 'ലിസ്റ്റിംഗുകൾ', or: 'ଲିସ୍ଟିଂ', ur: 'لسٹنگز', as: 'লিষ্টিং', ks: 'لسٹنگز', kok: 'यादी', mai: 'लिस्टिंग', sd: 'لسٽنگون', ne: 'लिस्टिङ', sa: 'सूचयः', sat: 'ᱞᱤᱥᱴᱤᱝᱠᱚ', brx: 'लिस्टिंग', doi: 'लिस्टिंग', },
  listings_stat: { hi: 'Listings', en: 'Listings', mr: 'यादी', bn: 'লিস্টিংস', ta: 'பட்டியல்கள்', te: 'జాబితాలు', gu: 'લિસ્ટિંગ્સ', pa: 'ਲਿਸਟਿੰਗਾਂ', kn: 'ಪಟ್ಟಿಗಳು', ml: 'ലിസ്റ്റിംഗുകൾ', or: 'ଲିସ୍ଟିଂ', ur: 'لسٹنگز', as: 'লিষ্টিং', ks: 'لسٹنگز', kok: 'यादी', mai: 'लिस्टिंग', sd: 'لسٽنگون', ne: 'लिस्टिङ', sa: 'सूचयः', sat: 'ᱞᱤᱥᱴᱤᱝᱠᱚ', brx: 'लिस्टिंग', doi: 'लिस्टिंग', },
  live: { hi: 'LIVE', en: 'LIVE', mr: 'LIVE', bn: 'লাইভ', ta: 'லைவ்', te: 'లైవ్', gu: 'લાઇવ', pa: 'ਲਾਈਵ', kn: 'ಲೈವ್', ml: 'തത്സമയം', or: 'ଲାଇଭ୍', ur: 'لائیو', as: 'লাইভ', ks: 'لایو', kok: 'LIVE', mai: 'LIVE', sd: 'لائيو', ne: 'लाइभ', sa: 'साक्षात्', sat: 'ᱞᱟᱭᱤᱵᱷ', brx: 'LIVE', doi: 'लाइव', },
  location: { hi: 'Location', en: 'Location', mr: 'स्थान', bn: 'অবস্থান', ta: 'இருப்பிடம்', te: 'స్థానం', gu: 'સ્થાન', pa: 'ਸਥਾਨ', kn: 'ಸ್ಥಳ', ml: 'സ്ഥലം', or: 'ସ୍ଥାନ', ur: 'مقام', as: 'অৱস্থান', ks: 'مقام', kok: 'जागा', mai: 'ठाम', sd: 'مقام', ne: 'स्थान', sa: 'स्थानम्', sat: 'ᱴᱷᱟᱶ', brx: 'जायगा', doi: 'जग्घा', },
  location_placeholder: { hi: 'Jaise Lalghati, Bhopal', en: 'e.g. Lalghati, Bhopal', mr: 'उदा. लालघाटी, भोपाळ', bn: 'যেমন লালঘাটি, ভোপাল', ta: 'எ.கா. லால்காட்டி, போபால்', te: 'ఉదా. లాల్ఘాటి, భోపాల్', gu: 'દા.ત. લાલઘાટી, ભોપાલ', pa: 'ਜਿਵੇਂ ਲਾਲਘਾਟੀ, ਭੋਪਾਲ', kn: 'ಉದಾ. ಲಾಲ್ಘಾಟಿ, ಭೋಪಾಲ್', ml: 'ഉദാ. ലാൽഘാട്ടി, ഭോപ്പാൽ', or: 'ଯଥା ଲାଲଘାଟି, ଭୋପାଲ', ur: 'مثلاً لال گھاٹی، بھوپال', as: 'যেনে লালঘাটি, ভূপাল', ks: 'مثال لال گھاٹی، بھوپال', kok: 'उदा. लालघाटी, भोपाळ', mai: 'जैसन लालघाटी, भोपाल', sd: 'مثال طور لال گهاٽي، ڀوپال', ne: 'जस्तै लालघाटी, भोपाल', sa: 'यथा लालघाटी, भोपाल', sat: 'ᱡᱮᱞᱮᱠᱟ ᱞᱟᱞᱜᱷᱟᱴᱤ, ᱵᱷᱳᱯᱟᱞ', brx: 'गोनां लालघाटी, भोपाल', doi: 'जि्ववे लालघाटी, भोपाल', },
  manual: { hi: 'Manual', en: 'Manual', mr: 'Manual', bn: 'ম্যানুয়াল', ta: 'கைமுறை', te: 'మాన్యువల్', gu: 'મેન્યુઅલ', pa: 'ਮੈਨੁਅਲ', kn: 'ಹಸ್ತಚಾಲಿತ', ml: 'മാനുവൽ', or: 'ମାନୁଆଲ', ur: 'دستی', as: 'ম্যানুয়াল', ks: 'دستی', kok: 'मॅन्युअल', mai: 'मैनुअल', sd: 'دستي', ne: 'म्यानुअल', sa: 'हस्तचालितम्', sat: 'ᱛᱤ ᱛᱮ', brx: 'जाथायनो', doi: 'दस्ती', },
  marketplace: { hi: 'Marketplace', en: 'Marketplace', mr: 'Marketplace', bn: 'মার্কেটপ্লেস', ta: 'சந்தை', te: 'మార్కెట్', gu: 'બજાર', pa: 'ਬਾਜ਼ਾਰ', kn: 'ಮಾರುಕಟ್ಟೆ', ml: 'വിപണി', or: 'ବଜାର', ur: 'مارکیٹ', as: 'বজাৰ', ks: 'مارکیٹ', kok: 'बाजार', mai: 'बजार', sd: 'بازار', ne: 'बजार', sa: 'बाजारः', sat: 'ᱵᱟᱡᱟᱨ', brx: 'बाजार', doi: 'बाजार' },
  marketplace_wapas: { hi: 'Marketplace Mein Wapas Jayein', en: 'Back to Marketplace', mr: 'Marketplace मध्ये परत जा', bn: 'মার্কেটপ্লেসে ফিরে যান', ta: 'சந்தைக்குத் திரும்பு', te: 'మార్కెట్‌కు తిరిగి వెళ్ళు', gu: 'બજારમાં પાછા જાઓ', pa: 'ਬਾਜ਼ਾਰ ਵਿੱਚ ਵਾਪਸ ਜਾਓ', kn: 'ಮಾರುಕಟ್ಟೆಗೆ ಹಿಂತಿರುಗಿ', ml: 'വിപണിയിലേക്ക് മടങ്ങുക', or: 'ବଜାରକୁ ଫେରନ୍ତୁ', ur: 'مارکیٹ میں واپس جائیں', as: 'বজাৰলৈ উভতি যাওক', ks: 'مارکیٹَس منٛز واپس گژھیو', kok: 'बाजारांत परत वचात', mai: 'बजार में वापस जाऊ', sd: 'مارڪيٽ ۾ واپس وڃو', ne: 'बजारमा फर्कनुहोस्', sa: 'बाजारं प्रत्यागच्छतु', sat: 'ᱵᱟᱡᱟᱨ ᱛᱮ ᱨᱩᱣᱟᱲ', brx: 'बाजाराव फिन जाय', doi: 'बाजार च वापस जाओ', },
  meri_dukaan: { hi: 'Meri Dukaan', en: 'My Shop', mr: 'Mazi Dukaan', bn: 'আমার দোকান', ta: 'என் கடை', te: 'నా షాప్', gu: 'મારી દુકાન', pa: 'ਮੇਰੀ ਦੁਕਾਨ', kn: 'ನನ್ನ ಅಂಗಡಿ', ml: 'എന്റെ കട', or: 'ମୋ ଦୋକାନ', ur: 'میری دکان', as: 'মোৰ দোকান', ks: 'میہِ دکان', kok: 'ಮ್ಹಜಿ ದುಕಾನ್', mai: 'हमर दुकान', sd: 'مونجي دڪان', ne: 'मेरो पसल', sa: 'मम आपणम्', sat: 'ᱟᱹᱢᱟᱜ ᱫᱳᱠᱟᱱ', brx: 'आंनि दुकान', doi: 'मेरी दुकान' },
  meri_listings: { hi: 'Meri Listings', en: 'My Listings', mr: 'Mazi Yadi', bn: 'আমার লিস্টিং', ta: 'என் பட்டியல்கள்', te: 'నా లిస్టింగ్స్', gu: 'મારી લિસ્ટિંગ્સ', pa: 'ਮੇਰੀ ਲਿਸਟਿੰਗ', kn: 'ನನ್ನ ಲಿಸ್ಟಿಂಗ್ಗಳು', ml: 'എന്റെ ലിസ്റ്റിംഗുകൾ', or: 'ମୋ ଲିସ୍ଟିଂ', ur: 'میری لسٹنگز', as: 'মোৰ লিষ্টিং', ks: 'میٖنِ لسٹنگز', kok: 'म्हज्यो यादी', mai: 'हमर लिस्टिंग', sd: 'منهنجيون لسٽنگون', ne: 'मेरो लिस्टिङ', sa: 'मम सूचयः', sat: 'ᱟᱹᱢᱟᱜ ᱞᱤᱥᱴᱤᱝᱠᱚ', brx: 'आंनि लिस्टिंग', doi: 'मेरी लिस्टिंग', },
  mic_hint: { hi: 'Mic tap karein — Hindi mein bolein', en: 'Tap mic — speak in Hindi', mr: 'Mic दाबा — हिंदीत बोला', bn: 'মাইক ট্যাপ করুন — হিন্দিতে বলুন', ta: 'மைக்ரோஃபோனைத் தட்டவும் — ஹிந்தியில் பேசவும்', te: 'మైక్ నొక్కండి — హిందీలో మాట్లాడండి', gu: 'માઇક ટેપ કરો — હિન્દીમાં બોલો', pa: 'ਮਾਈਕ ਟੈਪ ਕਰੋ — ਹਿੰਦੀ ਵਿੱਚ ਬੋਲੋ', kn: 'ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ — ಹಿಂದಿಯಲ್ಲಿ ಮಾತನಾಡಿ', ml: 'മൈക്കിൽ ടാപ്പ് ചെയ്യുക — ഹിന്ദിയിൽ സംസാരിക്കുക', or: 'ମାଇକ୍ ଟାପ କରନ୍ତୁ — ହିନ୍ଦୀରେ କୁହନ୍ତୁ', ur: 'مائک تھپتھپائیں — ہندی میں بولیں', as: 'মাইক টেপ কৰক — হিন্দীত কওক', ks: 'مائیک ٹیپ کٔرِو — ہندی پؠٹھ تھٲیِو', kok: 'Mic दाबात — हिंदीत उलोवात', mai: 'माइक टैप करू — हिंदी में बोलू', sd: 'مائيڪ ٽيپ ڪريو — هندي ۾ ڳالهايو', ne: 'माइक ट्याप गर्नुहोस् — हिन्दीमा बोल्नुहोस्', sa: 'माइकं नोदयतु — हिन्दीभाषया वदतु', sat: 'ᱢᱟᱭᱠ ᱴᱟᱯᱮ — ᱦᱤᱱᱫᱤ ᱨᱮᱨᱳᱲ', brx: 'Mic खामालाम — हिंदीय राव', doi: 'माइक टैप करो — हिंदी च बोलो', },
  min_pehle: { hi: ' min pehle', en: ' min ago', mr: ' मिनिटापूर्वी', bn: ' মিনিট আগে', ta: ' நிமிடம் முன்பு', te: ' నిమిషం క్రితం', gu: ' મિનિટ પહેલા', pa: ' ਮਿੰਟ ਪਹਿਲਾਂ', kn: ' ನಿಮಿಷದ ಹಿಂದೆ', ml: ' മിനിറ്റ് മുമ്പ്', or: ' ମିନିଟ ପୂର୍ବେ', ur: ' منٹ پہلے', as: ' মিনিট আগত', ks: ' منٹ پہلے', kok: ' मिनिटा आदीं', mai: ' मिनट पहिने', sd: ' منٽ اڳي', ne: ' मिनेट अघि', sa: ' निमेषात् प्राक्', sat: ' ᱴᱟᱲᱟᱝ ᱞᱟᱦᱟ', brx: ' मिनिट सिगां', doi: ' मिंट पैह्ले', },
  mohalla: { hi: 'Mohalla', en: 'Mohalla', mr: 'Mohalla', bn: 'মহল্লা', ta: 'அக்கம்', te: 'పరిసరాలు', gu: 'મોહલ્લો', pa: 'ਮੁਹੱਲਾ', kn: 'ಸಮೀಪ', ml: 'അയൽപക്കം', or: 'ପଡ଼ିଆ', ur: 'محلہ', as: 'মহল্লা', ks: 'محلہ', kok: 'मोहल्लो', mai: 'मोहल्ला', sd: 'محلو', ne: 'टोल', sa: 'समीपम्', sat: 'ᱴᱚᱞᱟ', brx: 'मोहल्ला', doi: 'मुहल्ला' },
  mohalla_market: { hi: 'Mohalla Market', en: 'Neighborhood Market', mr: 'Mahalla Market', bn: 'মহল্লা মার্কেট', ta: 'அக்கம்பக்க சந்தை', te: 'పరిసర మార్కెట్', gu: 'મોહલ્લા માર્કેટ', pa: 'ਮੁਹੱਲਾ ਮਾਰਕੀਟ', kn: 'ಮೊಹಲ್ಲಾ ಮಾರುಕಟ್ಟೆ', ml: 'അയൽപക്ക ചന്ത', or: 'ପଡ଼ିଆ ବଜାର', ur: 'محلہ مارکیٹ', as: 'মহল্লা বজাৰ', ks: 'محلہ مارکیٹ', kok: 'मोहल्लो बाजार', mai: 'मोहल्ला बजार', sd: 'محلي مارڪيٽ', ne: 'टोल बजार', sa: 'समीपबाजारः', sat: 'ᱴᱚᱞᱟ ᱵᱟᱡᱟᱨ', brx: 'मोहल्ला बाजार', doi: 'मुहल्ला बाजार', },
  more_languages: { hi: 'और भाषाएं', en: 'More languages', mr: 'आणखी भाषा', bn: 'আরও ভাষা', ta: 'மேலும் மொழிகள்', te: 'మరిన్ని భాషలు', gu: 'વધુ ભાષાઓ', pa: 'ਹੋਰ ਭਾਸ਼ਾਵਾਂ', kn: 'ಹೆಚ್ಚಿನ ಭಾಷೆಗಳು', ml: 'കൂടുതൽ ഭാഷകൾ', or: 'ଅଧିକ ଭାଷା', ur: 'مزید زبانیں', as: 'অধিক ভাষা', ks: 'مزید زبانیں', kok: 'आनी भासो', mai: 'आरू भाषा', sd: 'وڌيڪ ٻوليون', ne: 'अरू भाषाहरू', sa: 'अधिक भाषाः', sat: 'ᱵᱟᱹᱲᱛᱤ ᱯᱟᱹᱨᱥᱤᱠᱚ', brx: 'गोबां जोंखा', doi: 'होर भाषाएं', },
  more_shops_in_area: { hi: 'Is kshetra mein aur dukanein', en: 'More shops in this area', mr: 'या भागात अधिक दुकाने', bn: 'এই এলাকায় আরও দোকান', ta: 'இந்த பகுதியில் மேலும் கடைகள்', te: 'ఈ ప్రాంతంలో మరిన్ని దుకాణాలు', gu: 'આ વિસ્તારમાં વધુ દુકાનો', pa: 'ਇਸ ਖੇਤਰ ਵਿੱਚ ਹੋਰ ਦੁਕਾਨਾਂ', kn: 'ಈ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಂಗಡಿಗಳು', ml: 'ഈ പ്രദേശത്ത് കൂടുതൽ കടകൾ', or: 'ଏହି କ୍ଷେତ୍ରରେ ଅଧିକ ଦୋକାନ', ur: 'اس علاقے میں مزید دکانیں', as: 'এই অঞ্চলত অধিক দোকান', ks: 'ییٚتِھ علاقس منٛز بییہٕ دکانہٕ', kok: 'ह्या भागांत आनीक दुकानां', mai: 'एहि क्षेत्र में आर दुकान', sd: 'هن علائقي ۾ وڌيڪ دوڪان', ne: 'यस क्षेत्रमा थप पसलहरू', sa: 'अस्मिन् क्षेत्रे अधिकाः आपणाः', sat: 'ᱤᱱ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱟᱹᱲᱛᱤ ᱫᱳᱠᱟᱱ', brx: 'बे जायगा आव मोनसेन दुकान', doi: 'एस क्षेत्र च होर दुकानां', },
  my_orders: { hi: 'My Orders', en: 'My Orders', mr: 'Maze Orders', bn: 'আমার অর্ডার', ta: 'என் ஆர்டர்கள்', te: 'నా ఆర్డర్లు', gu: 'મારા ઓર્ડર', pa: 'ਮੇਰੇ ਆਰਡਰ', kn: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು', ml: 'എന്റെ ഓർഡറുകൾ', or: 'ମୋ ଅର୍ଡର', ur: 'میرے آرڈر', as: 'মোৰ অৰ্ডাৰ', ks: 'میٖنِ آرڈر', kok: 'म्हजे ऑर्डर', mai: 'हमर आर्डर', sd: 'منهنجا آرڊر', ne: 'मेरो अर्डर', sa: 'मम आदेशाः', sat: 'ᱟᱹᱢᱟᱜ ᱟᱨᱰᱟᱨ', brx: 'आंनि आर्डर', doi: 'मेरे आर्डर', },
  namaste: { hi: 'Namaste', en: 'Hello', mr: 'Namaskar', bn: 'নমস্কার', ta: 'வணக்கம்', te: 'నమస్కారం', gu: 'નમસ્તે', pa: 'ਸਤ ਸ਼੍ਰੀ ਅਕਾਲ', kn: 'ನಮಸ್ಕಾರ', ml: 'നമസ്കാരം', or: 'ନମସ୍କାର', ur: 'نمستے', as: 'নমস্কাৰ', ks: 'नमस्कार', kok: 'नमस्कार', mai: 'नमस्कार', sd: 'نمستي', ne: 'नमस्ते', sa: 'नमस्कारः', sat: 'ᱡᱳᱦᱟᱨ', brx: 'नमस्कार', doi: 'नमस्कार', },
  namaste_dukaandar: { hi: 'Namaste, Dukaandaar', en: 'Hello, Shopkeeper', mr: 'Namaskar, Dukaandar', bn: 'নমস্কার, দোকানদার', ta: 'வணக்கம், கடைக்காரர்', te: 'నమస్కారం, దుకాణదారుడు', gu: 'નમસ્તે, દુકાનદાર', pa: 'ਸਤ ਸ਼੍ਰੀ ਅਕਾਲ, ਦੁਕਾਨਦਾਰ', kn: 'ನಮಸ್ಕಾರ, ಅಂಗಡಿಕಾರ', ml: 'നമസ്കാരം, കടക്കാരൻ', or: 'ନମସ୍କାର, ଦୋକାନୀ', ur: 'نمستے، دکاندار', as: 'নমস্কাৰ, দোকানী', ks: 'नमस्कार, दुकानदार', kok: 'नमस्कार, दुकानदार', mai: 'नमस्कार, दुकानदार', sd: 'نمستي، دڪاندار', ne: 'नमस्ते, पसलवाला', sa: 'नमस्कारः, आपणिकः', sat: 'ᱡᱳᱦᱟᱨ, ᱫᱳᱠᱟᱱᱤ', brx: 'नमस्कार, दुकानदार', doi: 'नमस्कार, दुकानदार', },
  name_phone_instruction: { hi: 'We need this to build your trust profile', en: 'We need this to build your trust profile', mr: 'तुमची ट्रस्ट प्रोफाइल तयार करण्यासाठी हे आवश्यक आहे', bn: 'আপনার বিশ্বাস প্রোফাইল তৈরির জন্য এটি প্রয়োজন', ta: 'உங்கள் நம்பிக்கை சுயவிவரத்தை உருவாக்க இது தேவை', te: 'మీ ట్రస్ట్ ప్రొఫైల్ రూపొందించడానికి ఇది అవసరం', gu: 'તમારી ટ્રસ્ટ પ્રોફાઇલ બનાવવા માટે આ જરૂરી છે', pa: 'ਤੁਹਾਡਾ ਟਰੱਸਟ ਪ੍ਰੋਫਾਈਲ ਬਣਾਉਣ ਲਈ ਇਹ ਜ਼ਰੂਰੀ ਹੈ', kn: 'ನಿಮ್ಮ ಟ್ರಸ್ಟ್ ಪ್ರೊಫೈಲ್ ರಚಿಸಲು ಇದು ಅಗತ್ಯವಿದೆ', ml: 'നിങ്ങളുടെ വിശ്വാസ പ്രൊഫൈൽ നിർമ്മിക്കാൻ ഇത് ആവശ്യമാണ്', or: 'ଆପଣଙ୍କ ବିଶ୍ୱାସ ପ୍ରୋଫାଇଲ ତିଆରି ପାଇଁ ଏହା ଆବଶ୍ୟକ', ur: 'آپ کا ٹرسٹ پروفائل بنانے کے لیے یہ ضروری ہے', as: 'আপোনাৰ ট্ৰাষ্ট প্ৰফাইল তৈয়াৰ কৰিবলৈ এইটো প্ৰয়োজনীয়', ks: 'پنٕہِ ٹرسٹ پروفائل بناوٕنۍ خاطرِ یہِ ضٔروٗری چھُ', kok: 'तुमचें ट्रस्ट प्रोफाइल तयार करपा खातीर हें गरजेचें', mai: 'अहाँक विश्वास प्रोफाइल बनबै लेल ई जरूरी अछि', sd: 'توهان جي ٽرسٽ پروفائيل ٺاهڻ لاءِ هي ضروري آهي', ne: 'तपाईंको ट्रस्ट प्रोफाइल बनाउन यो आवश्यक छ', sa: 'भवतः विश्वासप्रोफाइल निर्माणाय इदम् आवश्यकम्', sat: 'ᱟᱢᱟᱜ ᱵᱷᱚᱨᱚᱥᱟ ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱛᱮᱭᱟᱨ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱣᱟ ᱞᱟᱹᱠᱛᱤ', brx: 'आंनि ट्रस्ट प्रोफाइल बानायनो नेफ्राय बे गोजोन', doi: 'तुहाडा ट्रस्ट प्रोफाइल बनान लई एह जरूरी ऐ', },
  name_required: { hi: 'Naam zaroori hai', en: 'Name is required', mr: 'नाव आवश्यक आहे', bn: 'নাম প্রয়োজন', ta: 'பெயர் தேவை', te: 'పేరు అవసరం', gu: 'નામ જરૂરી છે', pa: 'ਨਾਂ ਜ਼ਰੂਰੀ ਹੈ', kn: 'ಹೆಸರು ಅಗತ್ಯವಿದೆ', ml: 'പേര് ആവശ്യമാണ്', or: 'ନାମ ଆବଶ୍ୟକ', ur: 'نام ضروری ہے', as: 'নাম প্ৰয়োজনীয়', ks: 'ناو ضروری چھُ', kok: 'नांव गरजेचें', mai: 'नाम जरूरी अछि', sd: 'نالو گهربل آهي', ne: 'नाम आवश्यक छ', sa: 'नाम आवश्यकम्', sat: 'ᱧᱩᱛᱩᱢ ᱞᱟᱹᱠᱛᱤ', brx: 'मुं जरुरी', doi: 'नां जरूरी है', },
  ne_vouch_kiya: { hi: 'ne vouch kiya', en: 'vouched', mr: 'ने वाउच केले', bn: 'ভাউচ করেছেন', ta: 'வவுச் செய்தார்', te: 'వౌచ్ చేసారు', gu: 'વાઉચ કર્યું', pa: 'ਵਾਊਚ ਕੀਤਾ', kn: 'ವೌಚ್ ಮಾಡಿದ್ದಾರೆ', ml: 'വൗച് ചെയ്തു', or: 'ଭାଉଚ କଲେ', ur: 'واؤچ کیا', as: 'ভাউচ কৰিলে', ks: 'واؤچ کوٗر', kok: 'व्हाउच केलें', mai: 'वाउच केलन्हि', sd: 'وائوچ ڪيو', ne: 'भाउच गरे', sa: 'वाउचितवान्', sat: 'ᱵᱷᱟᱩᱪ ᱠᱮᱫᱟᱭ', brx: 'भाउच खालामबाय', doi: 'वाउच कीता', },
  neighbors: { hi: ' neighbors', en: ' neighbors', mr: ' शेजारी', bn: ' প্রতিবেশী', ta: ' அண்டை', te: ' పొరుగు', gu: ' પડોશીઓ', pa: ' ਗੁਆਂਢੀ', kn: ' ನೆರೆಹೊರೆಯವರು', ml: ' അയൽക്കാർ', or: ' ପଡ଼ିଶା', ur: ' پڑوسی', as: ' চুবুৰীয়া', ks: ' ہمسایہ', kok: ' शेजारी', mai: ' पड़ोसी', sd: ' پاڙيسري', ne: ' छिमेकी', sa: ' प्रतिवेशिनः', sat: ' ᱟ.ᱨᱩᱜᱮᱞ', brx: ' जोबोड़ मानसियै', doi: ' गुवांढी', },
  no_label: { hi: 'Nahi', en: 'No', mr: 'नाही', bn: 'না', ta: 'இல்லை', te: 'కాదు', gu: 'ના', pa: 'ਨਹੀਂ', kn: 'ಇಲ್ಲ', ml: 'ഇല്ല', or: 'ନାଁ', ur: 'نہیں', as: 'নহয়', ks: 'نہ', kok: 'ना', mai: 'नहि', sd: 'نه', ne: 'होइन', sa: 'न', sat: 'ᱵᱟᱝ', brx: 'थाङा', doi: 'ना', },
  not_listed_yet: { hi: 'Abhi listed nahi', en: 'Not listed yet', mr: 'अद्याप सूचीबद्ध नाही', bn: 'এখনো তালিকাভুক্ত নয়', ta: 'இன்னும் பட்டியலிடப்படவில்லை', te: 'ఇంకా జాబితా చేయబడలేదు', gu: 'હજી સૂચિબદ્ધ નથી', pa: 'ਹਾਲੇ ਸੂਚੀਬੱਧ ਨਹੀਂ', kn: 'ಇನ್ನೂ ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ', ml: 'ഇതുവരെ ലിസ്റ്റ് ചെയ്തിട്ടില്ല', or: 'ଏପର୍ଯ୍ୟନ୍ତ ତାଲିକାଭୁକ୍ତ ନୁହେଁ', ur: 'ابھی تک فہرست میں نہیں', as: 'এতিয়ালৈকে তালিকাভুক্ত নহয়', ks: 'أس تامھی لسٹس منٛز نہ', kok: 'आयजमेरेन लिस्ट केल्लें ना', mai: 'एहि धरि सूचीबद्ध नहि', sd: 'اڃا تائين لسٽ ۾ نه آهي', ne: 'अहिलेसम्म सूचीबद्ध छैन', sa: 'इदानीम् सूचीबद्धः न', sat: 'ᱵᱷᱩᱨ ᱞᱤᱥᱴᱤ ᱵᱟᱹᱱᱩᱜ', brx: 'थामायै लिस्ट जायगो', doi: 'हले तक लिस्ट नी', },
  not_registered_tag: { hi: 'Sauda par nahi', en: 'Not on Sauda yet', mr: 'सौदा वर नाही', bn: 'সওদায় নেই', ta: 'சௌதாவில் இல்லை', te: 'సౌదాలో లేదు', gu: 'સૌદા પર નથી', pa: 'ਸੌਦੇ \'ਤੇ ਨਹੀਂ', kn: 'ಸೌದಾದಲ್ಲಿ ಇಲ್ಲ', ml: 'സൗദയിൽ ഇല്ല', or: 'ସୌଦାରେ ନାହିଁ', ur: 'سودا پر نہیں', as: 'সৌদাত নাই', ks: 'سودس پؠٹھ نہ', kok: 'सौदा धर ना', mai: 'सौदा पर नहि', sd: 'سودي تي نه', ne: 'सौदामा छैन', sa: 'सौदे नास्ति', sat: 'ᱥᱟᱣᱫᱟ ᱨᱮ ᱵᱟᱹᱱᱩᱜ', brx: 'सौदा आव नङा', doi: 'सौदे ते नी', },
  notif_group_deal: { hi: 'Group Deal: 3 log milke 20% sasta!', en: 'Group Deal: 3 people get 20% off!', mr: 'Group Deal: 3 log milke 20% sasta!', bn: 'Group Deal: 3 log milke 20% sasta!', ta: 'Group Deal: 3 log milke 20% sasta!', te: 'Group Deal: 3 log milke 20% sasta!', gu: 'Group Deal: 3 log milke 20% sasta!', pa: 'Group Deal: 3 log milke 20% sasta!', kn: 'Group Deal: 3 log milke 20% sasta!', ml: 'Group Deal: 3 log milke 20% sasta!', or: 'Group Deal: 3 log milke 20% sasta!', ur: 'Group Deal: 3 log milke 20% sasta!', as: 'Group Deal: 3 log milke 20% sasta!', ks: 'Group Deal: 3 log milke 20% sasta!', kok: 'Group Deal: 3 log milke 20% sasta!', mai: 'Group Deal: 3 log milke 20% sasta!', sd: 'Group Deal: 3 log milke 20% sasta!', ne: 'Group Deal: 3 log milke 20% sasta!', sa: 'Group Deal: 3 log milke 20% sasta!', sat: 'Group Deal: 3 log milke 20% sasta!', brx: 'Group Deal: 3 log milke 20% sasta!', doi: 'Group Deal: 3 log milke 20% sasta!' },
  notif_new_seller: { hi: 'Naya seller: Rajesh Mobile Corner aaya', en: 'New seller: Rajesh Mobile Corner arrived', mr: 'Naya seller: Rajesh Mobile Corner aaya', bn: 'Naya seller: Rajesh Mobile Corner aaya', ta: 'Naya seller: Rajesh Mobile Corner aaya', te: 'Naya seller: Rajesh Mobile Corner aaya', gu: 'Naya seller: Rajesh Mobile Corner aaya', pa: 'Naya seller: Rajesh Mobile Corner aaya', kn: 'Naya seller: Rajesh Mobile Corner aaya', ml: 'Naya seller: Rajesh Mobile Corner aaya', or: 'Naya seller: Rajesh Mobile Corner aaya', ur: 'Naya seller: Rajesh Mobile Corner aaya', as: 'Naya seller: Rajesh Mobile Corner aaya', ks: 'Naya seller: Rajesh Mobile Corner aaya', kok: 'Naya seller: Rajesh Mobile Corner aaya', mai: 'Naya seller: Rajesh Mobile Corner aaya', sd: 'Naya seller: Rajesh Mobile Corner aaya', ne: 'Naya seller: Rajesh Mobile Corner aaya', sa: 'Naya seller: Rajesh Mobile Corner aaya', sat: 'Naya seller: Rajesh Mobile Corner aaya', brx: 'Naya seller: Rajesh Mobile Corner aaya', doi: 'Naya seller: Rajesh Mobile Corner aaya' },
  notif_order_deal: { hi: 'Priya ne Banarasi Silk Saree ka deal kiya', en: 'Priya made a deal for Banarasi Silk Saree', mr: 'Priya ne Banarasi Silk Saree ka deal kiya', bn: 'Priya ne Banarasi Silk Saree ka deal kiya', ta: 'Priya ne Banarasi Silk Saree ka deal kiya', te: 'Priya ne Banarasi Silk Saree ka deal kiya', gu: 'Priya ne Banarasi Silk Saree ka deal kiya', pa: 'Priya ne Banarasi Silk Saree ka deal kiya', kn: 'Priya ne Banarasi Silk Saree ka deal kiya', ml: 'Priya ne Banarasi Silk Saree ka deal kiya', or: 'Priya ne Banarasi Silk Saree ka deal kiya', ur: 'Priya ne Banarasi Silk Saree ka deal kiya', as: 'Priya ne Banarasi Silk Saree ka deal kiya', ks: 'Priya ne Banarasi Silk Saree ka deal kiya', kok: 'Priya ne Banarasi Silk Saree ka deal kiya', mai: 'Priya ne Banarasi Silk Saree ka deal kiya', sd: 'Priya ne Banarasi Silk Saree ka deal kiya', ne: 'Priya ne Banarasi Silk Saree ka deal kiya', sa: 'Priya ne Banarasi Silk Saree ka deal kiya', sat: 'Priya ne Banarasi Silk Saree ka deal kiya', brx: 'Priya ne Banarasi Silk Saree ka deal kiya', doi: 'Priya ne Banarasi Silk Saree ka deal kiya' },
  notifications: { hi: 'Notifications', en: 'Notifications', mr: 'Notifications', bn: 'বিজ্ঞপ্তি', ta: 'அறிவிப்புகள்', te: 'నోటిఫికేషన్లు', gu: 'સૂચનાઓ', pa: 'ਸੂਚਨਾਵਾਂ', kn: 'ಅಧಿಸೂಚನೆಗಳು', ml: 'അറിയിപ്പുകൾ', or: 'ବିଜ୍ଞପ୍ତି', ur: 'اطلاعات', as: 'জাননী', ks: 'اطلاع', kok: 'नोटिफिकेशन', mai: 'सूचना', sd: 'اطلاع', ne: 'सूचनाहरू', sa: 'सूचनाः', sat: 'ᱠᱷᱚᱵᱚᱨ', brx: 'नोटिफिकेशन', doi: 'सूचना', },
  open_now: { hi: 'Khula hai', en: 'Open now', mr: 'आता खुले आहे', bn: 'এখন খোলা', ta: 'இப்போது திறந்துள்ளது', te: 'ఇప్పుడు తెరిచి ఉంది', gu: 'હવે ખુલ્લું છે', pa: 'ਹੁਣ ਖੁੱਲ੍ਹਾ ਹੈ', kn: 'ಈಗ ತೆರೆದಿದೆ', ml: 'ഇപ്പോൾ തുറന്നിരിക്കുന്നു', or: 'ବର୍ତ୍ତମାନ ଖୋଲା', ur: 'ابھی کھلا ہے', as: 'এতিয়া খোলা আছে', ks: 'أس کھلوتھ چھُ', kok: 'आता उगडलेलें आसा', mai: 'अखनी खुलल अछि', sd: 'هاڻي کليل آهي', ne: 'अहिले खुला छ', sa: 'साम्प्रतम् उद्घाटितम्', sat: 'ᱱᱤᱛ ᱡᱷᱤᱡ ᱜᱮᱭᱟ', brx: 'दान थेव', doi: 'हल्ली खुला है', },
  or_enter: { hi: 'YA PHIR LIKHEIN', en: 'OR ENTER MANUALLY', mr: 'किंवा स्वतः लिहा', bn: 'অথবা নিজে লিখুন', ta: 'அல்லது கைமுறையில் உள்ளிடுக', te: 'లేదా మాన్యువల్గా నమోదు చేయండి', gu: 'અથવા જાતે લખો', pa: 'ਜਾਂ ਆਪੇ ਲਿਖੋ', kn: 'ಅಥವಾ ಸ್ವತಃ ನಮೂದಿಸಿ', ml: 'അല്ലെങ്കിൽ സ്വയം നൽകുക', or: 'କିମ୍ବା ନିଜେ ଲେଖନ୍ତୁ', ur: 'یا خود لکھیں', as: 'বা নিজে লিখক', ks: 'یا پانہٕ لیکھو', kok: 'वा सवें बरयात', mai: 'या अपने आप लिखू', sd: 'يا پاڻ لکو', ne: 'वा आफैं लेख्नुहोस्', sa: 'अथवा स्वयम् लिखतु', sat: 'ᱥᱮ ᱟᱡᱛᱮ ᱚᱞ', brx: 'आरो आपुनआपु लिर', doi: 'या आप ई लिखो', },
  order_sent_success: { hi: 'Aapki request bhej di gayi hai. Trust network ke through deal secure hai.', en: 'Your request has been sent. The deal is secured through the trust network.', mr: 'तुमची विनंती पाठवली गेली आहे. ट्रस्ट नेटवर्कद्वारे डील सुरक्षित आहे.', bn: 'আপনার অনুরোধ পাঠানো হয়েছে। ট্রাস্ট নেটওয়ার্কের মাধ্যমে ডিল সুরক্ষিত।', ta: 'உங்கள் கோரிக்கை அனுப்பப்பட்டது. நம்பிக்கை வலையமைப்பின் மூலம் ஒப்பந்தம் பாதுகாக்கப்பட்டது.', te: 'మీ అభ్యర్థన పంపబడింది. ట్రస్ట్ నెట్‌వర్క్ ద్వారా డీల్ సురక్షితం.', gu: 'તમારી વિનંતી મોકલી દેવામાં આવી છે. ટ્રસ્ટ નેટવર્ક દ્વારા ડીલ સુરક્ષિત છે.', pa: 'ਤੁਹਾਡੀ ਬੇਨਤੀ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ। ਟਰੱਸਟ ਨੈੱਟਵਰਕ ਰਾਹੀਂ ਡੀਲ ਸੁਰੱਖਿਅਤ ਹੈ।', kn: 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ. ಟ್ರಸ್ಟ್ ನೆಟ್‌ವರ್ಕ್ ಮೂಲಕ ಡೀಲ್ ಸುರಕ್ಷಿತವಾಗಿದೆ.', ml: 'നിങ്ങളുടെ അഭ്യർത്ഥന അയച്ചു. ട്രസ്റ്റ് നെറ്റ്‌വർക്ക് വഴി ഡീൽ സുരക്ഷിതമാണ്.', or: 'ଆପଣଙ୍କ ଅନୁରୋଧ ପଠାଯାଇଛି। ଟ୍ରଷ୍ଟ ନେଟୱାର୍କ ମାଧ୍ୟମରେ ଡିଲ୍ ସୁରକ୍ଷିତ।', ur: 'آپ کی درخواست بھیج دی گئی ہے۔ ٹرسٹ نیٹ ورک کے ذریعے ڈیل محفوظ ہے۔', as: 'আপোনাৰ অনুৰোধ প্ৰেৰণ কৰা হৈছে। ট্ৰাষ্ট নেটৱৰ্কৰ জৰিয়তে ডিল সুৰক্ষিত।', ks: 'پنٕہِ درخواست بٲژنہٕ آمژ۔ ٹرسٹ نیٹ ورکٕچ باگت ڈیل محفوظ چھ۔', kok: 'तुमची विनंती धाडली गेल्या. ट्रस्ट नेटवर्का उदेशी डील सुरक्षित.', mai: 'अहाँक अनुरोध भेजि देनए। भरोसा नेटवर्क के माध्यम से डील सुरक्षित।', sd: 'توهان جي درخواست موڪلي وئي آهي. ٽرسٽ نيٽورڪ ذريعي ڊيل محفوظ.', ne: 'तपाईंको अनुरोध पठाइएको छ। ट्रस्ट नेटवर्क मार्फत डिल सुरक्षित छ।', sa: 'भवतः प्रार्थना प्रेषिता। विश्वासजालेन क्रयविक्रयं सुरक्षितम्।', sat: 'ᱟᱢᱟᱜ ᱟᱸᱥ ᱵᱷᱮᱡᱟ ᱮᱱᱟ। ᱡᱩᱨᱤ-ᱯᱮᱨᱮᱡ ᱱᱮᱴᱣᱟᱨᱠ ᱛᱮ ᱰᱤᱞ ᱥᱤᱠᱟᱨ।', brx: 'आंनि प्रार्थनाखौ सोलायबाय। ट्रस्ट नेटवर्क आरजों बेराखौ फैसलाजो जों।', doi: 'तुहाडी बिनती घल्ली गेई। ट्रस्ट नेटवर्क राही डील सुरक्षित।', },
  pehla_sauda: { hi: 'Pehla Sauda karein!', en: 'Make your first order!', mr: 'पहिला सौदा करा!', bn: 'প্রথম সওদা করুন!', ta: 'முதல் ஆர்டர் செய்யுங்கள்!', te: 'మొదటి ఆర్డర్ చేయండి!', gu: 'પહેલો સૌદા કરો!', pa: 'ਪਹਿਲਾ ਸੌਦਾ ਕਰੋ!', kn: 'ಮೊದಲ ಆರ್ಡರ್ ಮಾಡಿ!', ml: 'ആദ്യ ഓർഡർ നടത്തുക!', or: 'ପ୍ରଥମ ସଉଦା କରନ୍ତୁ!', ur: 'پہلا سودا کریں!', as: 'প্ৰথম সওদা কৰক!', ks: 'گۄڈٕنِچ سودا کٔرِو!', kok: 'पयलो सोदो करात!', mai: 'पहिलौ सौदा करू!', sd: 'پهريون سودو ڪريو!', ne: 'पहिलो सौदा गर्नुहोस्!', sa: 'प्रथम वाणिज्यं कुर्यात्!', sat: 'ᱟᱭᱟᱜ ᱯᱩᱭᱞᱩ ᱠᱨᱚᱭ', brx: 'गोदान बेराय!', doi: 'पैह्ला सौदा करो!', },
  phone: { hi: 'Phone', en: 'Phone', mr: 'फोन', bn: 'ফোন', ta: 'தொலைபேசி', te: 'ఫోన్', gu: 'ફોન', pa: 'ਫੋਨ', kn: 'ಫೋನ್', ml: 'ഫോൺ', or: 'ଫୋନ୍', ur: 'فون', as: 'ফোন', ks: 'فون', kok: 'फोन', mai: 'फोन', sd: 'فون', ne: 'फोन', sa: 'दूरभाषः', sat: 'ᱯᱷᱚᱱ', brx: 'फोन', doi: 'फोन', },
  phone_number: { hi: 'PHONE NUMBER', en: 'PHONE NUMBER', mr: 'फोन नंबर', bn: 'ফোন নম্বর', ta: 'தொலைபேசி எண்', te: 'ఫోన్ నంబర్', gu: 'ફોન નંબર', pa: 'ਫ਼ੋਨ ਨੰਬਰ', kn: 'ಫೋನ್ ಸಂಖ್ಯೆ', ml: 'ഫോൺ നമ്പർ', or: 'ଫୋନ୍ ନମ୍ବର', ur: 'فون نمبر', as: 'ফোন নম্বৰ', ks: 'فون نمبر', kok: 'फोन नंबर', mai: 'फोन नंबर', sd: 'فون نمبر', ne: 'फोन नम्बर', sa: 'दूरभाषसंख्या', sat: 'ᱯᱷᱚᱱ ᱮᱞ', brx: 'फोन नंबर', doi: 'फोन नंबर', },
  phone_number_display: { hi: 'Phone number', en: 'Phone number', mr: 'फोन नंबर', bn: 'ফোন নম্বর', ta: 'தொலைபேசி எண்', te: 'ఫోన్ నంబర్', gu: 'ફોન નંબર', pa: 'ਫ਼ੋਨ ਨੰਬਰ', kn: 'ಫೋನ್ ಸಂಖ್ಯೆ', ml: 'ഫോൺ നമ്പർ', or: 'ଫୋନ୍ ନମ୍ବର', ur: 'فون نمبر', as: 'ফোন নম্বৰ', ks: 'فون نمبر', kok: 'फोन नंबर', mai: 'फोन नंबर', sd: 'فون نمبر', ne: 'फोन नम्बर', sa: 'दूरभाषसंख्या', sat: 'ᱯᱷᱚᱱ ᱮᱞ', brx: 'फोन नंबर', doi: 'फोन नंबर', },
  products_count: { hi: ' products', en: ' products', mr: ' उत्पादने', bn: ' টি পণ্য', ta: ' பொருட்கள்', te: ' ఉత్పత్తులు', gu: ' ઉત્પાદનો', pa: ' ਉਤਪਾਦ', kn: ' ಉತ್ಪನ್ನಗಳು', ml: ' ഉൽപ്പന്നങ്ങൾ', or: ' ଟି ପଣ୍ୟ', ur: ' مصنوعات', as: ' টি সামগ্ৰী', ks: ' مصنوعات', kok: ' उत्पादनां', mai: ' उत्पादन', sd: ' شيون', ne: ' उत्पादनहरू', sa: ' उत्पादानि', sat: ' ᱥᱟᱢᱟᱱ', brx: ' उत्पादन', doi: ' उत्पादन', },
  profile: { hi: 'Profile', en: 'Profile', mr: 'Profile', bn: 'প্রোফাইল', ta: 'சுயவிவரம்', te: 'ప్రొఫైల్', gu: 'પ્રોફાઇલ', pa: 'ਪ੍ਰੋਫਾਈਲ', kn: 'ಪ್ರೊಫೈಲ್', ml: 'പ്രൊഫൈൽ', or: 'ପ୍ରୋଫାଇଲ୍', ur: 'پروفائل', as: 'প্ৰফাইল', ks: 'پروفائل', kok: 'प्रोफायल', mai: 'प्रोफाइल', sd: 'پروفائيل', ne: 'प्रोफाइल', sa: 'वृत्तम्', sat: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ', brx: 'प्रोफाइल', doi: 'प्रोफाइल' },
  profile_listings: { hi: 'Listings', en: 'Listings', mr: 'यादी', bn: 'লিস্টিংস', ta: 'பட்டியல்கள்', te: 'జాబితాలు', gu: 'લિસ્ટિંગ્સ', pa: 'ਲਿਸਟਿੰਗਾਂ', kn: 'ಪಟ್ಟಿಗಳು', ml: 'ലിസ്റ്റിംഗുകൾ', or: 'ଲିସ୍ଟିଂ', ur: 'لسٹنگز', as: 'লিষ্টিং', ks: 'لسٹنگز', kok: 'यादी', mai: 'लिस्टिंग', sd: 'لسٽنگون', ne: 'लिस्टिङ', sa: 'सूचयः', sat: 'ᱞᱤᱥᱴᱤᱝ', brx: 'लिस्टिंग', doi: 'लिस्टिंग', },
  profile_orders: { hi: 'Orders', en: 'Orders', mr: 'ऑर्डर', bn: 'অর্ডার', ta: 'ஆர்டர்கள்', te: 'ఆర్డర్లు', gu: 'ઓર્ડર', pa: 'ਆਰਡਰ', kn: 'ಆರ್ಡರ್‌ಗಳು', ml: 'ഓർഡറുകൾ', or: 'ଅର୍ଡର', ur: 'آرڈر', as: 'অৰ্ডাৰ', ks: 'آرڈر', kok: 'ऑर्डर', mai: 'आर्डर', sd: 'آرڊر', ne: 'अर्डर', sa: 'आदेशाः', sat: 'ᱟᱨᱰᱚᱨ', brx: 'आर्डर', doi: 'आर्डर', },
  profile_saved: { hi: 'Saved', en: 'Saved', mr: 'सेव्ह केले', bn: 'সংরক্ষিত', ta: 'சேமிக்கப்பட்டது', te: 'సేవ్ చేయబడింది', gu: 'સાચવ્યું', pa: 'ਸੇਵ', kn: 'ಉಳಿಸಲಾಗಿದೆ', ml: 'സംരക്ഷിച്ചു', or: 'ସଞ୍ଚୟ', ur: 'محفوظ', as: 'সংৰক্ষণ', ks: 'محفوظ', kok: 'सांबाळून दवरलें', mai: 'सेव', sd: 'محفوظ', ne: 'सुरक्षित', sa: 'रक्षितम्', sat: 'ᱨᱟᱠᱷᱟ', brx: 'राखियाबाय', doi: 'सेव', },
  profile_updated: { hi: 'Profile update ho gaya!', en: 'Profile updated!', mr: 'प्रोफाइल अपडेट झाले!', bn: 'প্রোফাইল আপডেট হয়েছে!', ta: 'சுயவிவரம் புதுப்பிக்கப்பட்டது!', te: 'ప్రొఫైల్ నవీకరించబడింది!', gu: 'પ્રોફાઇલ અપડેટ થઈ!', pa: 'ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਹੋਇਆ!', kn: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ!', ml: 'പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്തു!', or: 'ପ୍ରୋଫାଇଲ ଅପଡେଟ ହେଲା!', ur: 'پروفائل اپ ڈیٹ ہو گیا!', as: 'প্ৰফাইল আপডেট হৈ গল!', ks: 'پروفائل اپ ڈیٹ گوٗر!', kok: 'प्रोफायल अपडेट जालें!', mai: 'प्रोफाइल अपडेट भ गेल!', sd: 'پروفائيل اپڊيٽ ٿي ويو!', ne: 'प्रोफाइल अपडेट भयो!', sa: 'वृत्तम् अद्यतनितम्!', sat: 'ᱯᱨᱳᱯᱷᱟᱭᱤᱞ ᱟᱯᱰᱮᱴ', brx: 'प्रोफाइल खालामबाय!', doi: 'प्रोफाइल अपडेट होई गेआ!', },
  profile_vouches: { hi: 'Vouches', en: 'Vouches', mr: 'वाउचेस', bn: 'ভাউচেস', ta: 'வவுச்சுகள்', te: 'వౌచ్లు', gu: 'વાઉચેસ', pa: 'ਵਾਊਚਸ', kn: 'ವೌಚ್ಗಳು', ml: 'വൗചുകൾ', or: 'ଭାଉଚସ୍', ur: 'واؤچز', as: 'ভাউচেস', ks: 'واؤچز', kok: 'व्हाउचेस', mai: 'वाउचेस', sd: 'वाऊचेस', ne: 'भाउचस', sa: 'वाउचसः', sat: 'ᱵᱷᱟᱩᱪ', brx: 'भाउच', doi: 'वाउचेस', },
  publish_hint: { hi: 'Bol ke ya likhakar', en: 'By voice or writing', mr: 'बोलून किंवा लिहून', bn: 'বলে বা লিখে', ta: 'குரலில் அல்லது எழுத்தில்', te: 'గొంతులో లేదా రాసి', gu: 'બોલીને કે લખીને', pa: 'ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ', kn: 'ಧ್ವನಿಯಲ್ಲಿ ಅಥವಾ ಬರೆದು', ml: 'ശബ്ദത്തിലൂടെയോ എഴുതിയോ', or: 'କହି କିମ୍ବା ଲେଖି', ur: 'بول کر یا لکھ کر', as: 'কৈ বা লিখি', ks: 'تھٲوِتھ یا لیکھِتھ', kok: 'उलोवन वा बरोवन', mai: 'बोलि या लिखि', sd: 'ڳالهائي يا لکي', ne: 'बोलेर वा लेखेर', sa: 'वदित्वा लिखित्वा वा', sat: 'ᱨᱳᱲ ᱛᱮ ᱟᱨᱵᱟᱝ ᱚᱞ ᱛᱮ', brx: 'रावनो आरो लिरनो', doi: 'बोल के या लिख के', },
  quantity: { hi: 'Quantity', en: 'Quantity', mr: 'Quantity', bn: 'Quantity', ta: 'Quantity', te: 'Quantity', gu: 'Quantity', pa: 'Quantity', kn: 'Quantity', ml: 'Quantity', or: 'Quantity', ur: 'Quantity', as: 'Quantity', ks: 'Quantity', kok: 'Quantity', mai: 'Quantity', sd: 'Quantity', ne: 'Quantity', sa: 'Quantity', sat: 'Quantity', brx: 'Quantity', doi: 'Quantity' },
  removed_saved_tost: { hi: ' removed from saved', en: ' removed from saved', mr: ' सेव मधून काढले', bn: ' সংরক্ষিত থেকে সরানো হয়েছে', ta: ' சேமிப்பிலிருந்து நீக்கப்பட்டது', te: ' సేవ్ నుండి తీసివేయబడింది', gu: ' સાચવેલમાંથી દૂર કર્યું', pa: ' ਸੇਵ ਤੋਂ ਹਟਾਇਆ', kn: ' ಉಳಿಸಿದವುಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ', ml: ' സംരക്ഷിതത്തിൽ നിന്ന് നീക്കം ചെയ്തു', or: ' ସଞ୍ଚୟରୁ ହଟାଇଦିଆଗଲା', ur: ' محفوظ سے ہٹا دیا گیا', as: ' সংৰক্ষণৰ পৰা আঁতৰোৱা হৈছে', ks: ' محفوظ پؠٹھ ہٹاونہٕ', kok: ' सांबाळून दवरिल्ल्यान काडलें', mai: ' सेव स हटाओल गेल', sd: ' محفوظ تان هٽايو ويو', ne: ' सुरक्षितबाट हटाइयो', sa: ' रक्षितात् निष्कासितम्', sat: ' ᱨᱟᱠᱷᱟ ᱠᱷᱚᱱ ᱚᱪᱚᱜ', brx: ' राखियाफिनि फराया खालामबाय', doi: ' सेव चो हटाई दित्ता', },
  reset_demo: { hi: 'Reset Demo', en: 'Reset Demo', mr: 'डेमो रीसेट करा', bn: 'ডেমো রিসেট করুন', ta: 'டெமோவை மீட்டமைக்கவும்', te: 'డెమోను రీసెట్ చేయండి', gu: 'ડેમો રીસેટ કરો', pa: 'ਡੈਮੋ ਰੀਸੈੱਟ ਕਰੋ', kn: 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ', ml: 'ഡെമോ റീസെറ്റ് ചെയ്യുക', or: 'ଡେମୋ ରିସେଟ୍ କରନ୍ତୁ', ur: 'ڈیمو ری سیٹ کریں', as: 'ডেমো ৰিচেট কৰক', ks: 'ڈیمو ری سیٹ کٔرِو', kok: 'डेमो रिसेट करात', mai: 'डेमो रीसेट करू', sd: 'ڊيمو ري سيٽ ڪريو', ne: 'डेमो रिसेट गर्नुहोस्', sa: 'प्रदर्शनं पुनर्स्थापयतु', sat: 'ᱰᱮᱢᱚ ᱨᱤᱥᱮᱴ', brx: 'डेमो फिसाय', doi: 'डेमो रीसेट करो', },
  reset_demo_desc: { hi: 'Clear all data & restart', en: 'Clear all data & restart', mr: 'सर्व डेटा साफ करा आणि पुनर्सुरू करा', bn: 'সমস্ত ডেটা মুছে পুনরায় শুরু করুন', ta: 'அனைத்து தரவையும் அழித்து மீண்டும் தொடங்கவும்', te: 'మొత్తం డేటాను క్లియర్ చేసి పునఃప్రారంభించండి', gu: 'બધો ડેટા સાફ કરી ફરીથી શરૂ કરો', pa: 'ਸਾਰਾ ਡੇਟਾ ਸਾਫ਼ ਕਰਕੇ ਮੁੜ ਚਾਲੂ ਕਰੋ', kn: 'ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸಿ ಮರುಪ್ರಾರಂಭಿಸಿ', ml: 'എല്ലാ ഡാറ്റയും മായ്ച്ച് വീണ്ടും ആരംഭിക്കുക', or: 'ସମସ୍ତ ଡାଟା ସଫା କରି ପୁନଃ ଆରମ୍ଭ କରନ୍ତୁ', ur: 'تمام ڈیٹا صاف کر کے دوبارہ شروع کریں', as: 'সমস্ত ডেটা পৰিষ্কাৰ কৰি পুনৰ আৰম্ভ কৰক', ks: 'تمام ڈیٹا صٲف کٔرِتھ واپس شروٗع کٔرِو', kok: 'सगळो डेटा साफ करून परत सुरू करात', mai: 'सब डेटा साफ करी फेर सुरू करू', sd: 'سڀ ڊيٽا صاف ڪري وري شروع ڪريو', ne: 'सबै डाटा सफा गरी पुन: सुरु गर्नुहोस्', sa: 'सर्वं विवरणं मार्जयित्वा पुनरारभताम्', sat: 'ᱥᱟᱱᱟᱢ ᱰᱟᱴᱟ ᱥᱟᱯᱷᱟ ᱞᱮᱠᱟᱛᱮ ᱫᱚᱦᱲᱟ ᱞᱤᱠᱷᱟᱹ', brx: 'गासै डेटा साफ खालाम', doi: 'सारा डेटा साफ करी दुबारा शुरू करो', },
  revenue: { hi: 'Revenue', en: 'Revenue', mr: 'Revenue', bn: 'আয়', ta: 'வருவாய்', te: 'రెవెన్యూ', gu: 'આવક', pa: 'ਆਮਦਨ', kn: 'ಆದಾಯ', ml: 'വരുമാനം', or: 'ଆୟ', ur: 'آمدنی', as: 'ৰাজহ', ks: 'آمدنی', kok: 'महसूल', mai: 'राजस्व', sd: 'آمدني', ne: 'आम्दानी', sa: 'आयः', sat: 'ᱟᱨᱡᱟᱣ', brx: 'आं', doi: 'आमदन', },
  role_changed_to: { hi: 'Role badal gaya:', en: 'Role changed to:', mr: 'भूमिका बदलली:', bn: 'ভূমিকা পরিবর্তিত:', ta: 'பங்கு மாற்றப்பட்டது:', te: 'పాత్ర మార్చబడింది:', gu: 'ભૂમિકા બદલાઈ:', pa: 'ਭੂਮਿਕਾ ਬਦਲ ਗਈ:', kn: 'ಪಾತ್ರ ಬದಲಾಯಿಸಲಾಗಿದೆ:', ml: 'റോൾ മാറ്റി:', or: 'ଭୂମିକା ପରିବର୍ତ୍ତିତ:', ur: 'کردار تبدیل:', as: 'ভূমিকা সলনি:', ks: 'کردار بدل گوٗر:', kok: 'भूमिका बदलली:', mai: 'भूमिका बदल गेल:', sd: 'ڪردار تبديل ٿي ويو:', ne: 'भूमिका परिवर्तन:', sa: 'भूमिका परिवर्तिता:', sat: 'ᱨᱳᱞ ᱵᱚᱫᱚᱞ', brx: 'भूमिका सोलायबाय:', doi: 'भूमिका बदल गी:', },
  role_label: { hi: 'Role', en: 'Role', mr: 'भूमिका', bn: 'ভূমিকা', ta: 'பங்கு', te: 'పాత్ర', gu: 'ભૂમિકા', pa: 'ਭੂਮਿਕਾ', kn: 'ಪಾತ್ರ', ml: 'റോൾ', or: 'ଭୂମିକା', ur: 'کردار', as: 'ভূমিকা', ks: 'کردار', kok: 'भूमिका', mai: 'भूमिका', sd: 'ڪردار', ne: 'भूमिका', sa: 'भूमिका', sat: 'ᱨᱳᱞ', brx: 'भूमिका', doi: 'भूमिका', },
  saal: { hi: ' saal', en: ' yrs', mr: ' वर्षे', bn: ' বছর', ta: ' ஆண்டுகள்', te: ' సంవత్సరాలు', gu: ' વર્ષ', pa: ' ਸਾਲ', kn: ' ವರ್ಷ', ml: ' വർഷം', or: ' ବର୍ଷ', ur: ' سال', as: ' বছৰ', ks: ' ورٕہ', kok: ' वर्सां', mai: ' साल', sd: ' سال', ne: ' वर्ष', sa: ' वर्षाणि', sat: ' ᱥᱮᱨᱢᱟ', brx: ' साल', doi: ' साल', },
  sab_kuch: { hi: 'Sab kuch apne mohalle se', en: 'Everything from your neighborhood', mr: 'सगळं काही आपल्या मोहल्ल्यातून', bn: 'আপনার পাড়া থেকে সবকিছু', ta: 'எல்லாம் உங்கள் பகுதியிலிருந்து', te: 'మీ ప్రాంతం నుండి ప్రతిదీ', gu: 'બધું જ તમારા મોહલ્લામાંથી', pa: 'ਸਭ ਕੁਝ ਤੁਹਾਡੇ ਮੁਹੱਲੇ ਤੋਂ', kn: 'ಎಲ್ಲವೂ ನಿಮ್ಮ ಪ್ರದೇಶದಿಂದ', ml: 'എല്ലാം നിങ്ങളുടെ പ്രദേശത്ത് നിന്ന്', or: 'ସବୁ କିଛି ଆପଣଙ୍କ ପଡ଼ିଆରୁ', ur: 'سب کچھ آپ کے محلے سے', as: 'সকলোৱেই আপোনাৰ অঞ্চলৰ পৰা', ks: 'سٲریٖ شیٚز تۄہٕنٛدِس محلہَس پؠٹھ', kok: 'सगळें तुमच्या मोहल्ल्यांतल्यान', mai: 'सब कुछ अपने मोहल्ला स', sd: 'سڀ ڪجهه توهان جي محلي مان', ne: 'सबै कुरा आफ्नो टोलबाट', sa: 'सर्वम् स्वसमीपात्', sat: 'ᱡᱳᱛ ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱠᱷᱚᱱ', brx: 'सब आंनि मोहल्लानि फराय', doi: 'सब कुछ तुहाडे मुहल्ले चल', },
  sabhi: { hi: 'Sabhi', en: 'All', mr: 'Sarva', bn: 'সব', ta: 'அனைத்தும்', te: 'అన్నీ', gu: 'બધા', pa: 'ਸਭ', kn: 'ಎಲ್ಲಾ', ml: 'എല്ലാം', or: 'ସବୁ', ur: 'سب', as: 'সকলো', ks: 'سٲریٖ', kok: 'सगळे', mai: 'सभ', sd: 'سڀ', ne: 'सबै', sa: 'सर्वम्', sat: 'ᱡᱳᱛ', brx: 'सब', doi: 'सब', },
  sabhi_kshetra: { hi: 'Sabhi Kshetra', en: 'All Areas', mr: 'सर्व क्षेत्र', bn: 'সব এলাকা', ta: 'அனைத்து பகுதிகள்', te: 'అన్ని ప్రాంతాలు', gu: 'બધા વિસ્તાર', pa: 'ਸਾਰੇ ਖੇਤਰ', kn: 'ಎಲ್ಲಾ ಪ್ರದೇಶಗಳು', ml: 'എല്ലാ പ്രദേശങ്ങളും', or: 'ସବୁ ଅଞ୍ଚଳ', ur: 'تمام علاقے', as: 'সকলো অঞ্চল', ks: 'سٲریٖ علاقہٕ', kok: 'सगळे क्षेत्र', mai: 'सब क्षेत्र', sd: 'سڀ علائقا', ne: 'सबै क्षेत्र', sa: 'सर्वक्षेत्राणि', sat: 'ᱡᱳᱛ ᱴᱚᱞᱟ', brx: 'सब जेगा', doi: 'सारे इलाके', },
  samajh_raha: { hi: 'Samajh raha hoon...', en: 'Processing...', mr: 'समजत आहे...', bn: 'বুঝছি...', ta: 'புரிந்துகொள்கிறேன்...', te: 'అర్థం చేసుకుంటున్నాను...', gu: 'સમજી રહ્યો છું...', pa: 'ਸਮਝ ਰਿਹਾ ਹਾਂ...', kn: 'ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...', ml: 'മനസ്സിലാക്കുന്നു...', or: 'ବୁଝୁଛି...', ur: 'سمجھ رہا ہوں...', as: 'বুজি আছো...', ks: 'سَمَجھنہٕ چھُس...', kok: 'समजता...', mai: 'समझि रहल छी...', sd: 'سمجهي رهيو آهيان...', ne: 'बुझ्दै छु...', sa: 'अवगच्छामि...', sat: 'ᱞᱮᱠᱷᱟ...', brx: 'बिजिरगिरों...', doi: 'समझदा...', },
  sauda: { hi: 'Sauda', en: 'Sauda', mr: 'Sauda', bn: 'Sauda', ta: 'Sauda', te: 'Sauda', gu: 'Sauda', pa: 'Sauda', kn: 'Sauda', ml: 'Sauda', or: 'Sauda', ur: 'Sauda', as: 'Sauda', ks: 'Sauda', kok: 'Sauda', mai: 'Sauda', sd: 'Sauda', ne: 'Sauda', sa: 'Sauda', sat: 'Sauda', brx: 'Sauda', doi: 'Sauda' },
  sauda_karein: { hi: 'Sauda Karein', en: 'Place Order', mr: 'Sauda Kara', bn: 'সওদা করুন', ta: 'ஆர்டர் செய்யவும்', te: 'ఆర్డర్ చేయండి', gu: 'સૌદા કરો', pa: 'ਸੌਦਾ ਕਰੋ', kn: 'ಆರ್ಡರ್ ಮಾಡಿ', ml: 'ഓർഡർ ചെയ്യുക', or: 'ସଉଦା କରନ୍ତୁ', ur: 'سودا کریں', as: 'সওদা কৰক', ks: 'سودا کٔرِو', kok: 'सोदो करात', mai: 'सौदा करू', sd: 'سودو ڪريو', ne: 'सौदा गर्नुहोस्', sa: 'वाणिज्यं कुर्यात्', sat: 'ᱠᱨᱚᱭ ᱢᱮ', brx: 'बेराय', doi: 'सौदा करो', },
  sauda_pakka: { hi: 'Sauda Pakka!', en: 'Order Confirmed!', mr: 'Sauda Pakka!', bn: 'সওদা পাকা!', ta: 'ஆர்டர் உறுதி!', te: 'ఆర్డర్ కన్ఫర్మ్!', gu: 'સૌદા પાક્કો!', pa: 'ਸੌਦਾ ਪੱਕਾ!', kn: 'ಆರ್ಡರ್ ಖಚಿತ!', ml: 'ഓർഡർ സ്ഥിരീകരിച്ചു!', or: 'ସଉଦା ପକ୍କା!', ur: 'سودا پکا!', as: 'সওদা পক্কা!', ks: 'سودا پکّا!', kok: 'सोदो पक्को!', mai: 'सौदा पक्का!', sd: 'سودو پڪو!', ne: 'सौदा पक्का!', sa: 'वाणिज्यं पक्वम्!', sat: 'ᱠᱨᱚᱭ ᱠᱷᱟᱴᱤᱡ!', brx: 'बेराखौ पक्का!', doi: 'सौदा पक्का!', },
  sauda_version: { hi: 'Sauda v0.2 — Bharose ka Sauda', en: 'Sauda v0.2 — Trust-based Commerce', mr: 'सौदा v0.2 — विश्वासावर आधारित व्यापार', bn: 'সওদা v0.2 — বিশ্বাস ভিত্তিক বাণিজ্য', ta: 'சௌதா v0.2 — நம்பிக்கை அடிப்படையிலான வணிகம்', te: 'సౌదా v0.2 — నమ్మకం ఆధారిత వాణిజ్యం', gu: 'સૌદા v0.2 — વિશ્વાસ આધારિત વ્યાપાર', pa: 'ਸੌਦਾ v0.2 — ਭਰੋਸੇ \'ਤੇ ਆਧਾਰਿਤ ਵਪਾਰ', kn: 'ಸೌದಾ v0.2 — ನಂಬಿಕೆ ಆಧಾರಿತ ವಾಣಿಜ್ಯ', ml: 'സൗദാ v0.2 — വിശ്വാസം അടിസ്ഥാനമാക്കിയുള്ള വാണിജ്യം', or: 'ସୌଦା v0.2 — ବିଶ୍ୱାସ ଆଧାରିତ ବାଣିଜ୍ୟ', ur: 'سودا v0.2 — اعتماد پر مبنی تجارت', as: 'সৌদা v0.2 — বিশ্বাস ভিত্তিক বাণিজ্য', ks: 'سودا v0.2 — اعتمادس پتھ تجارت', kok: 'सौदा v0.2 — विश्वास आदारीत वेपार', mai: 'सौदा v0.2 — भरोसे पर आधारित व्यापार', sd: 'سودا v0.2 — اعتماد تي ٻڌل واپار', ne: 'सौदा v0.2 — विश्वासमा आधारित व्यापार', sa: 'सौदा v0.2 — विश्वासाधारितवाणिज्यम्', sat: 'ᱥᱟᱣᱫᱟ v0.2 — ᱵᱷᱚᱨᱥᱟ ᱟᱫᱷᱟᱨᱤᱛ ᱵᱮᱯᱟᱨ', brx: 'सौदा v0.2 — थाखो मोनोनि बेपार', doi: 'सौदा v0.2 — भरोसा ते आधारित व्यापार', },
  save_changes: { hi: 'Save Changes', en: 'Save Changes', mr: 'बदल जतन करा', bn: 'পরিবর্তন সংরক্ষণ করুন', ta: 'மாற்றங்களைச் சேமிக்கவும்', te: 'మార్పులు సేవ్ చేయండి', gu: 'ફેરફારો સાચવો', pa: 'ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ', kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ', ml: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക', or: 'ପରିବର୍ତ୍ତନ ସଞ୍ଚୟ କରନ୍ତୁ', ur: 'تبدیلیاں محفوظ کریں', as: 'পৰিৱৰ্তন সংৰক্ষণ কৰক', ks: 'تبدیٖلی محفوٗظ کٔرِو', kok: 'बदल जतन करात', mai: 'बदल सेव करू', sd: 'تبديليون محفوظ ڪريو', ne: 'परिवर्तन सुरक्षित गर्नुहोस्', sa: 'परिवर्तनानि रक्षतु', sat: 'ᱵᱚᱫᱚᱞ ᱨᱟᱠᱷᱟ', brx: 'सोलायथि राखि', doi: 'बदलाव राखो', },
  saved_sellers: { hi: 'Saved Sellers', en: 'Saved Sellers', mr: 'Saved Sellers', bn: 'সংরক্ষিত বিক্রেতা', ta: 'சேமித்த விற்பனையாளர்கள்', te: 'సేవ్ చేసిన విక్రేతలు', gu: 'સાચવેલ વિક્રેતાઓ', pa: 'ਸੇਵ ਕੀਤੇ ਵਿਕਰੇਤਾ', kn: 'ಉಳಿಸಿದ ಮಾರಾಟಗಾರರು', ml: 'സംരക്ഷിച്ച വിൽപ്പനക്കാർ', or: 'ସଞ୍ଚୟ କରାଯାଇଥିବା ବିକ୍ରେତା', ur: 'محفوظ کردہ فروخت کنندگان', as: 'সংৰক্ষিত বিক্ৰেতা', ks: 'محفوظ فروخت کنندگان', kok: 'सांबाळून दवरिल्ले विक्रेते', mai: 'सहेजल विक्रेता', sd: 'محفوظ ڪيل وڪرو ڪندڙ', ne: 'सुरक्षित बिक्रेताहरू', sa: 'रक्षितविक्रेतारः', sat: 'ᱨᱟᱠᱷᱟ ᱟ.ᱠᱤᱱ', brx: 'राखियाफिनो खातिरदार', doi: 'सेव के वेचण आले', },
  saved_tost: { hi: ' saved!', en: ' saved!', mr: ' सेव केले!', bn: ' সংরক্ষিত!', ta: ' சேமிக்கப்பட்டது!', te: ' సేవ్ చేయబడింది!', gu: ' સાચવ્યું!', pa: ' ਸੇਵ ਕੀਤਾ!', kn: ' ಉಳಿಸಲಾಗಿದೆ!', ml: ' സംരക്ഷിച്ചു!', or: ' ସଞ୍ଚୟ ହେଲା!', ur: ' محفوظ!', as: ' সংৰক্ষণ!', ks: ' محفوظ!', kok: ' सांबाळून दवरलें!', mai: ' सेव भेल!', sd: ' محفوظ!', ne: ' सुरक्षित!', sa: ' रक्षितम्!', sat: ' ᱨᱟᱠᱷᱟ!', brx: ' राखियाबाय!', doi: ' सेव होइ गेआ!', },
  search_placeholder: { hi: 'Apne mohalle mein dhundho...', en: 'Search in your neighborhood...', mr: 'Tumchya mohallayat shodha...', bn: 'আপনার পাড়ায় খুঁজুন...', ta: 'உங்கள் பகுதியில் தேடுங்கள்...', te: 'మీ పరిసరాల్లో వెతకండి...', gu: 'તમારા મોહલ્લામાં શોધો...', pa: 'ਆਪਣੇ ਮੁਹੱਲੇ ਵਿੱਚ ਲੱਭੋ...', kn: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಹುಡುಕಿ...', ml: 'നിങ്ങളുടെ പ്രദേശത്ത് തിരയുക...', or: 'ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ଖୋଜନ୍ତୁ...', ur: 'اپنے محلے میں تلاش کریں...', as: 'আপোনাৰ অঞ্চলত সন্ধান কৰক...', ks: 'پیٚمِس محلہَس منٛز تلاش کٔرِو...', kok: 'तुमच्या मोहल्ल्यांत सोधात...', mai: 'अपने मोहल्ले में खोजू...', sd: 'پنهنجي محلي ۾ ڳوليو...', ne: 'आफ्नो टोलमा खोज्नुहोस्...', sa: 'स्वसमीपे अन्विष्यताम्...', sat: 'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱨᱮ ᱥᱮᱢ ᱢᱮ...', brx: 'आंनि मोहल्लाव सोदोब...', doi: 'अपने मुहल्ले च खोजो...', },
  search_results: { hi: 'Search Results', en: 'Search Results', mr: 'Search Results', bn: 'Search Results', ta: 'Search Results', te: 'Search Results', gu: 'Search Results', pa: 'Search Results', kn: 'Search Results', ml: 'Search Results', or: 'Search Results', ur: 'Search Results', as: 'Search Results', ks: 'Search Results', kok: 'Search Results', mai: 'Search Results', sd: 'Search Results', ne: 'Search Results', sa: 'Search Results', sat: 'Search Results', brx: 'Search Results', doi: 'Search Results' },
  searching_products: { hi: 'ढूंढ रहा हूँ...', en: 'Searching products...', mr: 'शोधत आहे...', bn: 'খুঁজছি...', ta: 'தேடுகிறது...', te: 'వెతుకుతోంది...', gu: 'શોધી રહ્યા છે...', pa: 'ਖੋਜ ਰਿਹਾ ਹੈ...', kn: 'ಹುಡುಕುತ್ತಿದೆ...', ml: 'തിരയുന്നു...', or: 'ଖୋଜୁଛି...', ur: 'تلاش کر رہا ہے...', as: 'সন্ধান কৰি আছে...', ks: 'ڳولان چھُ...', kok: 'सोदतां...', mai: 'खोजैत छी...', sd: 'ڳولي رهيو آهي...', ne: 'खोज्दै...', sa: 'अन्वेषणं कुर्वन्...', sat: 'ᱥᱮᱸᱫᱽᱨᱟ ᱠᱟᱱᱟ...', brx: 'सोदिनो...', doi: 'लभदा...', },
  select_categories: { hi: 'Select categories', en: 'Select categories', mr: 'श्रेण्या निवडा', bn: 'বিভাগ নির্বাচন করুন', ta: 'வகைகளைத் தேர்ந்தெடுக்கவும்', te: 'వర్గాలను ఎంచుకోండి', gu: 'શ્રેણીઓ પસંદ કરો', pa: 'ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੋ', kn: 'ವರ್ಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'വിഭാഗങ്ങൾ തിരഞ്ഞെടുക്കുക', or: 'ଶ୍ରେଣୀ ଚୟନ କରନ୍ତୁ', ur: 'زمرے منتخب کریں', as: 'শ্ৰেণী নিৰ্বাচন কৰক', ks: 'زمرٕ منتخب کٔرِو', kok: 'वर्ग निवडात', mai: 'श्रेणी चुनू', sd: 'درجا چونڊيو', ne: 'कोटीहरू छान्नुहोस्', sa: 'वर्गान् चिनुत', sat: 'ᱵᱤᱵᱷᱟᱜᱽ ᱵᱟᱪᱷᱟᱣ', brx: 'गोरोब जेरि', doi: 'वर्ग चुनो', },
  select_interests: { hi: 'Select your interests for personalized feed', en: 'Select your interests for personalized feed', mr: 'वैयक्तिक फीडसाठी आपली आवड निवडा', bn: 'ব্যক্তিগতকৃত ফিডের জন্য আপনার আগ্রহ নির্বাচন করুন', ta: 'தனிப்பயனாக்கப்பட்ட ஊட்டத்திற்கு உங்கள் ஆர்வங்களைத் தேர்ந்தெடுக்கவும்', te: 'వ్యక్తిగతీకరించిన ఫీడ్ కోసం మీ ఆసక్తులను ఎంచుకోండి', gu: 'વ્યક્તિગત ફીડ માટે તમારી રુચિઓ પસંદ કરો', pa: 'ਨਿੱਜੀ ਫੀਡ ਲਈ ਆਪਣੀਆਂ ਦਿਲਚਸਪੀਆਂ ਚੁਣੋ', kn: 'ವೈಯಕ್ತಿಕ ಫೀಡ್‌ಗಾಗಿ ನಿಮ್ಮ ಆಸಕ್ತಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ', ml: 'വ്യക്തിഗത ഫീഡിനായി നിങ്ങളുടെ താൽപ്പര്യങ്ങൾ തിരഞ്ഞെടുക്കുക', or: 'ବ୍ୟକ୍ତିଗତ ଫିଡ ପାଇଁ ଆପଣଙ୍କ ଆଗ୍ରହ ଚୟନ କରନ୍ତୁ', ur: 'ذاتی فیڈ کے لیے اپنی دلچسپیاں منتخب کریں', as: 'ব্যক্তিগত ফিডৰ বাবে আপোনাৰ আগ্ৰহ নিৰ্বাচন কৰক', ks: 'ذاتی فیڈس خاطرِ پنٕہِ دلچسپیاں منتخب کٔرِو', kok: 'वैयक्तिक फीड खातीर तुमची आवड निवडात', mai: 'निजी फीड लेल अहाँक रुचि चुनू', sd: 'ذاتي فيڊ لاءِ پنهنجي دلچسپيون چونڊيو', ne: 'व्यक्तिगत फीडको लागि आफ्नो रुचिहरू छान्नुहोस्', sa: 'वैयक्तिकफीडाय स्वाभिरुचीन् चिनुत', sat: 'ᱟᱪᱤᱱ ᱯᱷᱤᱰ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱨᱩᱪᱤ ᱵᱟᱪᱷᱟᱣᱢᱮ', brx: 'आंनि मोनथाइ सोलोनो फीड खालाम', doi: 'निजी फीड लई अपणियां रुचियां चुनो', },
  seller: { hi: 'Seller', en: 'Seller', mr: 'Seller', bn: 'Seller', ta: 'Seller', te: 'Seller', gu: 'Seller', pa: 'Seller', kn: 'Seller', ml: 'Seller', or: 'Seller', ur: 'Seller', as: 'Seller', ks: 'Seller', kok: 'Seller', mai: 'Seller', sd: 'Seller', ne: 'Seller', sa: 'Seller', sat: 'Seller', brx: 'Seller', doi: 'Seller' },
  seller_desc: { hi: 'Apni dukaan online laao', en: 'Bring your shop online', mr: 'तुमची दुकान ऑनलाइन आणा', bn: 'আপনার দোকান অনলাইনে আনুন', ta: 'உங்கள் கடையை ஆன்லைனில் கொண்டு வாருங்கள்', te: 'మీ షాపును ఆన్లైన్లో తీసుకురండి', gu: 'તમારી દુકાન ઓનલાઈન લાવો', pa: 'ਆਪਣੀ ਦੁਕਾਨ ਨੂੰ ਆਨਲਾਈਨ ਲੈ ਆਓ', kn: 'ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಆನ್ಲೈನ್‌ನಲ್ಲಿ ತನ್ನಿ', ml: 'നിങ്ങളുടെ കട ഓൺലൈനിൽ കൊണ്ടുവരിക', or: 'ଆପଣଙ୍କ ଦୋକାନକୁ ଅନଲାଇନରେ ଆଣନ୍ତୁ', ur: 'اپنی دکان آن لائن لائیں', as: 'আপোনাৰ দোকান অনলাইনলৈ আনি দিয়ক', ks: 'پنٕہِ دُکان آن لائن یُس کٔرِو', kok: 'तुमची दुकान ऑनलाइन हाडात', mai: 'अपन दुकान ऑनलाइन लानू', sd: 'پنهنجي دڪان کي آن لائن آڻيو', ne: 'आफ्नो पसललाई अनलाइन ल्याउनुहोस्', sa: 'स्वआपणम् आनलाइनम् आनयत', sat: 'ᱟᱢᱟᱜ ᱫᱳᱠᱟᱱ ᱚᱱᱞᱟᱭᱤᱱ ᱟ.ᱜᱩᱢᱮ', brx: 'आंनि दुकानखौ आनलाइनाव लाबो', doi: 'अपनी दुकान नूं आनलाइन ल्याओ', },
  sellers_count: { hi: ' sellers, ', en: ' sellers, ', mr: ' विक्रेते, ', bn: ' জন বিক্রেতা, ', ta: ' விற்பனையாளர்கள், ', te: ' విక్రేతలు, ', gu: ' વિક્રેતાઓ, ', pa: ' ਵਿਕਰੇਤਾ, ', kn: ' ಮಾರಾಟಗಾರರು, ', ml: ' വിൽപ്പനക്കാർ, ', or: ' ଜଣ ବିକ୍ରେତା, ', ur: ' فروخت کنندگان، ', as: ' গৰাকী বিক্ৰেতা, ', ks: ' فروخت کنندگان، ', kok: ' विक्रेते, ', mai: ' विक्रेता, ', sd: ' وڪرو ڪندڙ، ', ne: ' विक्रेताहरू, ', sa: ' विक्रेतारः, ', sat: ' ᱟ.ᱠᱤᱱ, ', brx: ' खातिरदार, ', doi: ' वेचण आले, ', },
  shop_details: { hi: 'Apni dukaan ki details', en: 'Your shop details', mr: 'तुमच्या दुकानाची माहिती', bn: 'আপনার দোকানের বিবরণ', ta: 'உங்கள் கடை விவரங்கள்', te: 'మీ షాప్ వివరాలు', gu: 'તમારી દુકાનની વિગતો', pa: 'ਤੁਹਾਡੀ ਦੁਕਾਨ ਦੇ ਵੇਰਵੇ', kn: 'ನಿಮ್ಮ ಅಂಗಡಿ ವಿವರಗಳು', ml: 'നിങ്ങളുടെ കട വിവരങ്ങൾ', or: 'ଆପଣଙ୍କ ଦୋକାନ ବିବରଣୀ', ur: 'آپ کی دکان کی تفصیلات', as: 'আপোনাৰ দোকানৰ বিৱৰণ', ks: 'پنٕہِ دکان کِس تفصیل', kok: 'तुमच्या दुकानाची माहिती', mai: 'अहाँक दुकानक विवरण', sd: 'توهان جي دڪان جي تفصيل', ne: 'तपाईंको पसलको विवरण', sa: 'भवतः आपणस्य विवरणम्', sat: 'ᱟᱢᱟᱜ ᱫᱳᱠᱟᱱ ᱵᱟᱵᱚᱛ', brx: 'आंनि दुकाननि फिसाय', doi: 'तुहाडी दुकानदी गल्ल', },
  shop_name_label: { hi: 'DUKAAN KA NAAM', en: 'SHOP NAME', mr: 'दुकानाचे नाव', bn: 'দোকানের নাম', ta: 'கடையின் பெயர்', te: 'షాప్ పేరు', gu: 'દુકાનનું નામ', pa: 'ਦੁਕਾਨ ਦਾ ਨਾਂ', kn: 'ಅಂಗಡಿಯ ಹೆಸರು', ml: 'കടയുടെ പേര്', or: 'ଦୋକାନ ନାମ', ur: 'دکان کا نام', as: 'দোকানৰ নাম', ks: 'دکان ہُند ناو', kok: 'दुकानाचें नांव', mai: 'दुकानक नाम', sd: 'دڪان جو نالو', ne: 'पसलको नाम', sa: 'आपणस्य नाम', sat: 'ᱫᱳᱠᱟᱱ ᱧᱩᱛᱩᱢ', brx: 'दुकाननि मुं', doi: 'दुकान दा नां', },
  shuru_karein: { hi: 'Shuru Karein', en: 'Get Started', mr: 'Suru Karuya', bn: 'শুরু করো', ta: 'தொடங்கு', te: 'ప్రారంభించు', gu: 'શરૂ કરો', pa: 'ਸ਼ੁਰੂ ਕਰੋ', kn: 'ಪ್ರಾರಂಭಿಸಿ', ml: 'ആരംഭിക്കുക', or: 'ଆରମ୍ଭ କର', ur: 'شروع کریں', as: 'আৰম্ভ কৰক', ks: 'شروع کٔرِو', kok: 'सुरु करात', mai: 'शुरू करू', sd: 'شروع ڪريو', ne: 'सुरु गर्नुहोस्', sa: 'आरभ्यताम्', sat: 'ᱮᱩ ᱠᱟᱛᱮ', brx: 'सुरु खालाम', doi: 'शुरू करो' },
  site_title: {
    hi: 'Sauda — Bharose ka Sauda',
    en: 'Sauda — Trusted Marketplace',
    mr: 'Sauda — विश्वासाचं बाजार',
    bn: 'Sauda — বিশ্বাসের বাজার',
    ta: 'Sauda — நம்பிக்கை சந்தை',
    te: 'Sauda — నమ్మకపు మార్కెట్',
    gu: 'Sauda — ભરોસાનું બજાર',
    pa: 'Sauda — ਭਰੋਸੇ ਦਾ ਬਾਜ਼ਾਰ',
    kn: 'Sauda — ನಂಬಿಕೆಯ ಮಾರುಕಟ್ಟೆ',
    ml: 'Sauda — വിശ്വാസ വിപണി',
    or: 'Sauda — ବିଶ୍ୱାସର ବଜାର',
    ur: 'Sauda — بھروسے کا بازار',
    as: 'Sauda — বিশ্বাসৰ বজাৰ',
    ks: 'Sauda — اعتماد کا بازار',
    kok: 'Sauda — भरवशाचें बाजार',
    mai: 'Sauda — भरोसाक बजार',
    sd: 'Sauda — ڀروسو جو بازار',
    ne: 'Sauda — भरोसाको बजार',
    sa: 'Sauda — विश्वासस्य बाजारः',
    sat: 'Sauda — ᱵᱷᱚᱨᱳᱥᱟ ᱵᱟᱡᱟᱨ',
    brx: 'Sauda — भरोसानि बाजार',
    doi: 'Sauda — भरोसे दा बाजार',
  },
  skip: { hi: 'Skip for now', en: 'Skip for now', mr: 'Skip for now', bn: 'Skip for now', ta: 'Skip for now', te: 'Skip for now', gu: 'Skip for now', pa: 'Skip for now', kn: 'Skip for now', ml: 'Skip for now', or: 'Skip for now', ur: 'Skip for now', as: 'Skip for now', ks: 'Skip for now', kok: 'Skip for now', mai: 'Skip for now', sd: 'Skip for now', ne: 'Skip for now', sa: 'Skip for now', sat: 'Skip for now', brx: 'Skip for now', doi: 'Skip for now' },
  sun_raha_hoon: { hi: 'Sun raha hoon...', en: 'Listening...', mr: 'ऐकत आहे...', bn: 'শুনছি...', ta: 'கேட்டுக்கொண்டிருக்கிறேன்...', te: 'వింటున్నాను...', gu: 'સાંભળી રહ્યો છું...', pa: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...', kn: 'ಕೇಳುತ್ತಿದ್ದೇನೆ...', ml: 'കേൾക്കുന്നു...', or: 'ଶୁଣୁଛି...', ur: 'سن رہا ہوں...', as: 'শুনি আছো...', ks: 'बुज़नہٕ چھُس...', kok: 'ऐकतां...', mai: 'सुनि रहल छी...', sd: 'ٻڌي رهيو آهيان...', ne: 'सुन्दै छु...', sa: 'शृणोमि...', sat: 'ᱩᱜᱩᱜᱤ...', brx: 'बुंदों...', doi: 'सुन्ना...', },
  tagline: { hi: 'Apne mohalle ke trusted sellers, apni aawaz se connect karo.', en: 'Connect with trusted local sellers using your voice.', mr: 'तुमच्या मोहल्ल्यातील विश्वासू विक्रेत्यांशी तुमच्या आवाजात कनेक्ट व्हा.', bn: 'আপনার পাড়ার বিশ্বস্ত বিক্রেতাদের সাথে আপনার কণ্ঠে যুক্ত হোন।', ta: 'உங்கள் பகுதியின் நம்பிக்கையான விற்பனையாளர்களை உங்கள் குரலில் இணையுங்கள்.', te: 'మీ ప్రాంతంలోని నమ్మకమైన విక్రేతలతో మీ గొంతుతో కనెక్ట్ అవ్వండి.', gu: 'તમારા મોહલ્લાના વિશ્વાસુ વિક્રેતાઓ સાથે તમારી વાણીમાં જોડાઓ.', pa: 'ਆਪਣੇ ਮੁਹੱਲੇ ਦੇ ਭਰੋਸੇਯੋਗ ਵਿਕਰੇਤਾਵਾਂ ਨਾਲ ਆਪਣੀ ਆਵਾਜ਼ ਵਿੱਚ ਜੁੜੋ।', kn: 'ನಿಮ್ಮ ಮೊಹಲ್ಲಾದ ವಿಶ್ವಾಸಾರ್ಹ ಮಾರಾಟಗಾರರೊಂದಿಗೆ ನಿಮ್ಮ ಧ್ವನಿಯಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ.', ml: 'നിങ്ങളുടെ സമീപത്തെ വിശ്വസ്ത വിൽപ്പനക്കാരുമായി നിങ്ങളുടെ ശബ്ദത്തിൽ ബന്ധപ്പെടുക.', or: 'ଆପଣଙ୍କ ପଡ଼ିଆର ବିଶ୍ୱସ୍ତ ବିକ୍ରେତାଙ୍କ ସହ ନିଜ କଣ୍ଠରେ ଯୋଡ଼ନ୍ତୁ।', ur: 'اپنے محلے کے معتبر فروخت کنندگان سے اپنی آواز میں جڑیں۔', as: 'আপোনাৰ মোহল্লাৰ বিশ্বস্ত বিক্ৰেতাসকলৰ সৈতে আপোনাৰ মাতেৰে সংযোগ কৰক।', ks: 'پییمِ محلہ سٕنٛدِس معتبر فروخت کنن ہُمہٕ آواز سۭتہ جوڑیو۔', kok: 'तुमच्या मोहल्ल्यांतल्या विश्वासू विक्रेत्यां कडेन तुमच्या आवाजान जोडात.', mai: 'अपने मोहल्लाक भरोसेमंद विक्रेतासँ अपनी आवाज में जुडू।', sd: 'پنهنجي محلي جي معتبر وڪرو ڪندڙن سان پنهنجي آواز ۾ ڳنڍيو.', ne: 'आफ्नो टोलका भरपर्दो बिक्रेताहरूसँग आफ्नो आवाजमा जोड्नुहोस्।', sa: 'स्वस्य समीपस्य विश्वसनीयविक्रेतृभिः स्वरवाचा संयोज्यताम्।', sat: 'ᱟᱢᱟᱜ ᱴᱚᱞᱟ ᱨᱤᱱ ᱵᱷᱚᱨᱚᱥᱟ ᱟᱠᱟᱱ ᱟᱠᱤᱱ ᱥᱟᱶ ᱟᱢᱟᱜ ᱨᱟᱦᱟ ᱛᱮ ᱡᱩᱲᱟᱹᱣᱢᱮ।', brx: 'आंनि मोहल्लानि फैसलाजो खातिरदार आरजोंनि आंनि रावनो जोरियो।', doi: 'आपने मुहल्ले दे भरोसेमंद वेचण आलियां नाल आपदी आवाज च जुड़ो।' },
  tap_hint: { hi: 'TAP', en: 'TAP', mr: 'TAP', bn: 'ট্যাপ', ta: 'தட்டவும்', te: 'నొక్కండి', gu: 'ટેપ કરો', pa: 'ਟੈਪ ਕਰੋ', kn: 'ಟ್ಯಾಪ್ ಮಾಡಿ', ml: 'ടാപ്പ് ചെയ്യുക', or: 'ଟାପ କରନ୍ତୁ', ur: 'ٹیپ', as: 'টেপ', ks: 'ٹیپ', kok: 'दाबात', mai: 'दबाउ', sd: 'ٽيپ', ne: 'ट्याप', sa: 'नोदयतु', sat: 'ᱴᱟᱯ', brx: 'खामालाम', doi: 'दबाओ', },
  tap_to_join_deal: { hi: 'Tap to join this deal', en: 'Tap to join this deal', mr: 'हा डील जॉइन करण्यासाठी दाबा', bn: 'এই ডিলে যোগ দিতে ট্যাপ করুন', ta: 'இந்த ஒப்பந்தத்தில் சேர தட்டவும்', te: 'ఈ డీల్‌లో చేరడానికి నొక్కండి', gu: 'આ ડીલમાં જોડાવા ટેપ કરો', pa: 'ਇਸ ਡੀਲ \'ਚ ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਟੈਪ ਕਰੋ', kn: 'ಈ ಡೀಲ್‌ನಲ್ಲಿ ಸೇರಲು ಟ್ಯಾಪ್ ಮಾಡಿ', ml: 'ഈ ഡീലിൽ ചേരാൻ ടാപ്പ് ചെയ്യുക', or: 'ଏହି ଡିଲରେ ଯୋଗଦେବାକୁ ଟାପ କରନ୍ତୁ', ur: 'اس ڈیل میں شامل ہونے کے لیے ٹیپ کریں', as: 'এই ডিলটোত যোগ দিবলৈ টেপ কৰক', ks: 'یِہ ڈیلس شٲمل گژھنہٕ خاطرِ ٹیپ کٔرِو', kok: 'हो डील जॉइन करपा खातीर दाबात', mai: 'ई डील मे शामिल होबा लेल दबाउ', sd: 'هن ڊيل ۾ شامل ٿيڻ لاءِ ٽيپ ڪريو', ne: 'यो डिलमा सामेल हुन ट्याप गर्नुहोस्', sa: 'अस्मिन् क्रयविक्रये संयोजनाय नोदयतु', sat: 'ᱱᱚᱣᱟ ᱰᱤᱞ ᱨᱮ ᱥᱮᱞᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱴᱟᱯ', brx: 'बे डीलाव सोलोनो जायो खामालाम', doi: 'एस डील च शामल होने तैं टैप करो', },
  tap_to_update: { hi: 'Tap to update', en: 'Tap to update', mr: 'अपडेट करण्यासाठी टॅप करा', bn: 'আপডেট করতে ট্যাপ করুন', ta: 'புதுப்பிக்க தட்டவும்', te: 'నవీకరించడానికి నొక్కండి', gu: 'અપડેટ કરવા ટેપ કરો', pa: 'ਅਪਡੇਟ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ', kn: 'ನವೀಕರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ', ml: 'അപ്ഡേറ്റ് ചെയ്യാൻ ടാപ്പുചെയ്യുക', or: 'ଅପଡେଟ କରିବାକୁ ଟାପ୍ କରନ୍ତୁ', ur: 'اپ ڈیٹ کرنے کے لیے تھپتھپائیں', as: 'আপডেট কৰিবলৈ টেপ কৰক', ks: 'اپ ڈیٹ کرنہٕ خاطر تھپ تھپ', kok: 'अपडेट करुंक टॅप करात', mai: 'अपडेट करबाक लेल ट्याप करू', sd: 'اپڊيٽ ڪرڻ لاءِ ٽيپ ڪريو', ne: 'अपडेट गर्न ट्याप गर्नुहोस्', sa: 'नवीकरणाय ताडयतु', sat: 'ᱟᱯᱰᱮᱴ ᱞᱟᱹᱜᱤᱫ ᱴᱮᱞ', brx: 'खालामनो थाप', doi: 'अपडेट करण बाद्दी दबाओ', },
  tell_shop: { hi: 'Tell us about your shop', en: 'Tell us about your shop', mr: 'आपल्या दुकानाबद्दल सांगा', bn: 'আপনার দোকান সম্পর্কে বলুন', ta: 'உங்கள் கடையைப் பற்றி சொல்லுங்கள்', te: 'మీ షాప్ గురించి చెప్పండి', gu: 'તમારી દુકાન વિશે કહો', pa: 'ਆਪਣੀ ਦੁਕਾਨ ਬਾਰੇ ਦੱਸੋ', kn: 'ನಿಮ್ಮ ಅಂಗಡಿಯ ಬಗ್ಗೆ ಹೇಳಿ', ml: 'നിങ്ങളുടെ കടയെക്കുറിച്ച് പറയുക', or: 'ଆପଣଙ୍କ ଦୋକାନ ବିଷୟରେ କୁହନ୍ତୁ', ur: 'اپنی دکان کے بارے میں بتائیں', as: 'আপোনাৰ দোকানৰ বিষয়ে কওক', ks: 'پنٕہِ دکان بارٕ تھٲیِو', kok: 'तुमच्या दुकाना विशीं सांगात', mai: 'अहाँक दुकानक बारे में बताउ', sd: 'پنهنجي دڪان بابت ٻڌايو', ne: 'आफ्नो पसलको बारेमा भन्नुहोस्', sa: 'भवतः आपणम् अधि वदतु', sat: 'ᱟᱢᱟᱜ ᱫᱳᱠᱟᱱ ᱵᱤᱫᱟᱹᱨ ᱢᱮᱢᱮ', brx: 'आंनि दुकाननि सायाव फोन', doi: 'अपनी दुकान बारे दस्सो', },
  three_log_mil_gaye: { hi: '3 log mil gaye — 20% discount laga hai', en: '3 people joined — 20% discount applied', mr: '3 लोक मिळाले — 20% सूट लागली', bn: '3 জন মিলেছে — 20% ডিসকাউন্ট লেগেছে', ta: '3 பேர் சேர்ந்தனர் — 20% தள்ளுபடி', te: '3 మంది కలిశారు — 20% తగ్గింపు', gu: '3 લોકો મળ્યા — 20% ડિસ્કાઉન્ટ', pa: '3 ਲੋਕ ਮਿਲ ਗਏ — 20% ਛੋਟ', kn: '3 ಜನ ಸೇರಿದರು — 20% ರಿಯಾಯಿತಿ', ml: '3 പേർ ഒത്തുചേർന്നു — 20% കിഴിവ്', or: '3 ଲୋକ ମିଳିଗଲେ — 20% ଡିସକାଉଣ୍ଟ', ur: '3 لوگ مل گئے — 20% ڈسکاؤنٹ', as: '3 লোকে লগ পাইছে — 20% ডিস্কাউন্ট', ks: '3 نفر مِلے — 20% رعایت', kok: '3 लोक मेळ्ळे — 20% सूट', mai: '3 लोक मिलि गेल — 20% छूट', sd: '3 ماڻهو گڏ ٿيا — 20% رعايت', ne: '3 जना भेटे — 20% छुट', sa: '3 जनाः मिलिताः — 20% छूटः', sat: '3 ᱦᱚᱲ ᱧᱟᱯᱟᱢ — 20% ᱠᱚᱢ', brx: '3 मानसियै जाबाय — 20% होग्रा', doi: '3 लोक रल गे — 20% छूट', },
  total: { hi: 'Total', en: 'Total', mr: 'Total', bn: 'Total', ta: 'Total', te: 'Total', gu: 'Total', pa: 'Total', kn: 'Total', ml: 'Total', or: 'Total', ur: 'Total', as: 'Total', ks: 'Total', kok: 'Total', mai: 'Total', sd: 'Total', ne: 'Total', sa: 'Total', sat: 'Total', brx: 'Total', doi: 'Total' },
  trust_score: { hi: 'Trust Score', en: 'Trust Score', mr: 'विश्वास स्कोर', bn: 'বিশ্বাস স্কোর', ta: 'நம்பிக்கை மதிப்பெண்', te: 'నమ్మక స్కోరు', gu: 'વિશ્વાસ સ્કોર', pa: 'ਭਰੋਸਾ ਸਕੋਰ', kn: 'ನಂಬಿಕೆ ಸ್ಕೋರ್', ml: 'വിശ്വാസ സ്കോർ', or: 'ବିଶ୍ୱାସ ସ୍କୋର', ur: 'اعتماد سکور', as: 'বিশ্বাস স্কোৰ', ks: 'اعتماد سکور', kok: 'विश्वास स्कोर', mai: 'विश्वास स्कोर', sd: 'اعتماد سکور', ne: 'विश्वास स्कोर', sa: 'विश्वासांकः', sat: 'ᱵᱷᱚᱨᱥᱟ ᱥᱠᱳᱨ', brx: 'फैसला स्कोर', doi: 'भरोसा स्कोर', },
  trust_tagline: { hi: 'Trust is a relationship, not a rating', en: 'Trust is a relationship, not a rating', mr: 'Trust is a relationship, not a rating', bn: 'Trust is a relationship, not a rating', ta: 'Trust is a relationship, not a rating', te: 'Trust is a relationship, not a rating', gu: 'Trust is a relationship, not a rating', pa: 'Trust is a relationship, not a rating', kn: 'Trust is a relationship, not a rating', ml: 'Trust is a relationship, not a rating', or: 'Trust is a relationship, not a rating', ur: 'Trust is a relationship, not a rating', as: 'Trust is a relationship, not a rating', ks: 'Trust is a relationship, not a rating', kok: 'Trust is a relationship, not a rating', mai: 'Trust is a relationship, not a rating', sd: 'Trust is a relationship, not a rating', ne: 'Trust is a relationship, not a rating', sa: 'Trust is a relationship, not a rating', sat: 'Trust is a relationship, not a rating', brx: 'Trust is a relationship, not a rating', doi: 'Trust is a relationship, not a rating' },
  trusted_connections: { hi: 'trusted connections', en: 'trusted connections', mr: 'विश्वासू कनेक्शन्स', bn: 'বিশ্বস্ত সংযোগ', ta: 'நம்பிக்கை இணைப்புகள்', te: 'నమ్మకమైన కనెక్షన్లు', gu: 'વિશ્વાસુ કનેક્શન્સ', pa: 'ਭਰੋਸੇਯੋਗ ਕਨੈਕਸ਼ਨ', kn: 'ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪರ್ಕಗಳು', ml: 'വിശ്വസ്ത കണക്ഷനുകൾ', or: 'ବିଶ୍ୱସ୍ତ ସଂଯୋଗ', ur: 'معتبر کنکشنز', as: 'বিশ্বস্ত সংযোগ', ks: 'معتبر کنکشن', kok: 'विश्वासू जोडण्यो', mai: 'भरोसेमंद संबंध', sd: 'معتبر ڪنيڪشن', ne: 'भरपर्दो जडानहरू', sa: 'विश्वसनीयसम्बन्धाः', sat: 'ᱵᱷᱳᱨᱥᱟ ᱡᱳᱜ', brx: 'फैसलाजो जोरनाय', doi: 'भरोसेमंद जुड़ाव', },
  verified: { hi: 'Verified', en: 'Verified', mr: 'सत्यापित', bn: 'যাচাইকৃত', ta: 'சரிபார்க்கப்பட்டது', te: 'ధృవీకరించబడింది', gu: 'ચકાસાયેલ', pa: 'ਪ੍ਰਮਾਣਿਤ', kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ', ml: 'സ്ഥിരീകരിച്ചു', or: 'ଯାଞ୍ଚ', ur: 'تصدیق شدہ', as: 'যাচাই', ks: 'تصدیق شدٕ', kok: 'पडताळून', mai: 'प्रमाणित', sd: 'تصديق ٿيل', ne: 'प्रमाणित', sa: 'प्रमाणितः', sat: 'ᱵᱷᱟᱹᱨᱛᱤ', brx: 'जायगाबाय', doi: 'तस्दीक', },
  voice: { hi: 'Voice', en: 'Voice', mr: 'Voice', bn: 'ভয়েস', ta: 'குரல்', te: 'వాయిస్', gu: 'વૉઇસ', pa: 'ਆਵਾਜ਼', kn: 'ಧ್ವನಿ', ml: 'ശബ്ദം', or: 'ଭଏସ୍', ur: 'آواز', as: 'কণ্ঠ', ks: 'آواز', kok: 'आवाज', mai: 'आवाज', sd: 'آواز', ne: 'आवाज', sa: 'स्वरः', sat: 'ᱨᱟᱦᱟ', brx: 'राव', doi: 'आवाज', },
  voice_buy_subtitle: { hi: 'जो चाहिए, बोलिए — हम ढूंढ देंगे', en: 'Speak what you need — we will find it', mr: 'जे हवे ते बोला — आम्ही शोधू', bn: 'যা দরকার বলুন — আমরা খুঁজে দেব', ta: 'உங்களுக்குத் தேவையானதைச் சொல்லுங்கள் — நாங்கள் கண்டுபிடிப்போம்', te: 'మీకు కావలసినది చెప్పండి — మేము కనుగొంటాము', gu: 'જે જોઈએ તે બોલો — અમે શોધી આપીશું', pa: 'ਜੋ ਚਾਹੀਦਾ ਹੈ ਬੋਲੋ — ਅਸੀਂ ਲੱਭ ਦੇਵਾਂਗੇ', kn: 'ನಿಮಗೆ ಬೇಕಾದುದನ್ನು ಹೇಳಿ — ನಾವು ಹುಡುಕುತ್ತೇವೆ', ml: 'വേണ്ടത് പറയൂ — ഞങ്ങൾ കണ്ടെത്തും', or: 'ଯାହା ଦରକାର କୁହନ୍ତୁ — ଆମେ ଖୋଜି ଦେବୁ', ur: 'جو چاہیے بولیں — ہم ڈھونڈ دیں گے', as: 'যি লাগে কওক — আমি বিচাৰি দিম', ks: 'یُس چھُہ سٮ۪ٔن — أسہِ ڳولِتھ دِٮ۪ٔو', kok: 'जे जाय तें सांगात — आमी सोदून दितले', mai: 'जे चाही बोलू — हम खोजि देब', sd: 'جِي گهربل آهي ڳالهايو — اسين ڳولي ڏينداسين', ne: 'जे चाहिन्छ बोल्नुहोस् — हमी खोजिदिन्छौं', sa: 'यद् इच्छति वदतु — वयम् अन्विष्यामः', sat: 'ᱡᱟᱦᱟᱸ ᱞᱟᱹᱠᱛᱤ ᱢᱮᱢᱮ — ᱟᱞᱚ ᱧᱟᱢ ᱠᱮᱫᱮᱭᱟ', brx: 'जो गोनाय जायो राव — जों सोदिनो', doi: 'जे चाहिदा बोलो — असां लभदे आं', },
  voice_item_detected: { hi: 'Voice se item detect kiya!', en: 'Item detected by voice!', mr: 'वॉइस वरून आयटम सापडला!', bn: 'ভয়েস দিয়ে আইটেম সনাক্ত!', ta: 'குரலில் பொருள் கண்டறியப்பட்டது!', te: 'వాయిస్ ద్వారా అంశం కనుగొనబడింది!', gu: 'વૉઇસ દ્વારા આઇટમ શોધી!', pa: 'ਆਵਾਜ਼ ਰਾਹੀਂ ਆਈਟਮ ਮਿਲੀ!', kn: 'ಧ್ವನಿಯ ಮೂಲಕ ವಸ್ತು ಪತ್ತೆ!', ml: 'ശബ്ദത്തിലൂടെ ഇനം കണ്ടെത്തി!', or: 'ଭଏସରେ ଆଇଟମ ଚିହ୍ନଟ!', ur: 'آواز سے آئٹم دریافت!', as: 'কণ্ঠৰে আইটেম চিনাক্ত!', ks: 'آواز سۭتہ آئٹم دریافت!', kok: 'आवाजान आयटम सापडलो!', mai: 'आवाज स आइटम भेटल!', sd: 'آواز سان آئٽم معلوم!', ne: 'आवाजले वस्तु पत्ता!', sa: 'स्वरेण वस्तुः आविष्कृता!', sat: 'ᱨᱟᱦᱟᱛᱮ ᱟᱭᱴᱮᱢ ᱧᱟᱢ!', brx: 'रावनो आइटम मोन!', doi: 'आवाज नाल आइटम लब्भा!', },
  vouchchain: { hi: 'VouchChain', en: 'VouchChain', mr: 'VouchChain', bn: 'VouchChain', ta: 'VouchChain', te: 'VouchChain', gu: 'VouchChain', pa: 'VouchChain', kn: 'VouchChain', ml: 'VouchChain', or: 'VouchChain', ur: 'VouchChain', as: 'VouchChain', ks: 'VouchChain', kok: 'VouchChain', mai: 'VouchChain', sd: 'VouchChain', ne: 'VouchChain', sa: 'VouchChain', sat: 'VouchChain', brx: 'VouchChain', doi: 'VouchChain' },
  vouchchain_secured: { hi: 'VOUCHCHAIN SECURED', en: 'VOUCHCHAIN SECURED', mr: 'VOUCHCHAIN SECURED', bn: 'VOUCHCHAIN SECURED', ta: 'VOUCHCHAIN SECURED', te: 'VOUCHCHAIN SECURED', gu: 'VOUCHCHAIN SECURED', pa: 'VOUCHCHAIN SECURED', kn: 'VOUCHCHAIN SECURED', ml: 'VOUCHCHAIN SECURED', or: 'VOUCHCHAIN SECURED', ur: 'VOUCHCHAIN SECURED', as: 'VOUCHCHAIN SECURED', ks: 'VOUCHCHAIN SECURED', kok: 'VOUCHCHAIN SECURED', mai: 'VOUCHCHAIN SECURED', sd: 'VOUCHCHAIN SECURED', ne: 'VOUCHCHAIN SECURED', sa: 'VOUCHCHAIN SECURED', sat: 'VOUCHCHAIN SECURED', brx: 'VOUCHCHAIN SECURED', doi: 'VOUCHCHAIN SECURED' },
  vouchchain_sub: { hi: 'Bharose ka rishta, rating nahi', en: 'Trust is a relationship, not a rating', mr: 'Trust is a relationship, not a rating', bn: 'Trust is a relationship, not a rating', ta: 'Trust is a relationship, not a rating', te: 'Trust is a relationship, not a rating', gu: 'Trust is a relationship, not a rating', pa: 'Trust is a relationship, not a rating', kn: 'Trust is a relationship, not a rating', ml: 'Trust is a relationship, not a rating', or: 'Trust is a relationship, not a rating', ur: 'Trust is a relationship, not a rating', as: 'Trust is a relationship, not a rating', ks: 'Trust is a relationship, not a rating', kok: 'Trust is a relationship, not a rating', mai: 'Trust is a relationship, not a rating', sd: 'Trust is a relationship, not a rating', ne: 'Trust is a relationship, not a rating', sa: 'Trust is a relationship, not a rating', sat: 'Trust is a relationship, not a rating', brx: 'Trust is a relationship, not a rating', doi: 'Trust is a relationship, not a rating' },
  vouchchain_trust_path: { hi: 'VOUCHCHAIN — TRUST PATH', en: 'VOUCHCHAIN — TRUST PATH', mr: 'VOUCHCHAIN — TRUST PATH', bn: 'VOUCHCHAIN — TRUST PATH', ta: 'VOUCHCHAIN — TRUST PATH', te: 'VOUCHCHAIN — TRUST PATH', gu: 'VOUCHCHAIN — TRUST PATH', pa: 'VOUCHCHAIN — TRUST PATH', kn: 'VOUCHCHAIN — TRUST PATH', ml: 'VOUCHCHAIN — TRUST PATH', or: 'VOUCHCHAIN — TRUST PATH', ur: 'VOUCHCHAIN — TRUST PATH', as: 'VOUCHCHAIN — TRUST PATH', ks: 'VOUCHCHAIN — TRUST PATH', kok: 'VOUCHCHAIN — TRUST PATH', mai: 'VOUCHCHAIN — TRUST PATH', sd: 'VOUCHCHAIN — TRUST PATH', ne: 'VOUCHCHAIN — TRUST PATH', sa: 'VOUCHCHAIN — TRUST PATH', sat: 'VOUCHCHAIN — TRUST PATH', brx: 'VOUCHCHAIN — TRUST PATH', doi: 'VOUCHCHAIN — TRUST PATH', },
  vouches_count: { hi: 'Vouches', en: 'Vouches', mr: 'वाउचेस', bn: 'ভাউচেস', ta: 'வவுச்சுகள்', te: 'వౌచ్లు', gu: 'વાઉચેસ', pa: 'ਵਾਊਚਸ', kn: 'ವೌಚ್ಗಳು', ml: 'വൗചുകൾ', or: 'ଭାଉଚସ୍', ur: 'واؤچز', as: 'ভাউচেস', ks: 'واؤچز', kok: 'व्हाउचेस', mai: 'वाउचेस', sd: 'وائوچز', ne: 'भाउचस', sa: 'वाउचसः', sat: 'ᱵᱷᱟᱩᱪ', brx: 'भाउच', doi: 'वाउचेस', },
  yes_label: { hi: 'Haan', en: 'Yes', mr: 'होय', bn: 'হ্যাঁ', ta: 'ஆம்', te: 'అవును', gu: 'હા', pa: 'ਹਾਂ', kn: 'ಹೌದು', ml: 'അതെ', or: 'ହଁ', ur: 'ہاں', as: 'হয়', ks: 'ہاں', kok: 'होय', mai: 'हँ', sd: 'ها', ne: 'हो', sa: 'आम्', sat: 'ᱦᱮᱸ', brx: 'हाबाय', doi: 'हां', },
  you: { hi: 'Aap', en: 'You', mr: 'Tumhi', bn: 'আপনি', ta: 'நீங்கள்', te: 'మీరు', gu: 'તમે', pa: 'ਤੁਸੀਂ', kn: 'ನೀವು', ml: 'നിങ്ങൾ', or: 'ଆପଣ', ur: 'آپ', as: 'আপুনি', ks: 'तुह्य', kok: 'तुमी', mai: 'अहाँ', sd: 'تون', ne: 'तपाईं', sa: 'भवान्', sat: 'ᱟᱢ', brx: 'नों', doi: 'तुस', },
  your_name_placeholder: { hi: 'Aapka naam', en: 'Your name', mr: 'तुमचे नाव', bn: 'আপনার নাম', ta: 'உங்கள் பெயர்', te: 'మీ పేరు', gu: 'તમારું નામ', pa: 'ਤੁਹਾਡਾ ਨਾਂ', kn: 'ನಿಮ್ಮ ಹೆಸರು', ml: 'നിങ്ങളുടെ പേര്', or: 'ଆପଣଙ୍କ ନାମ', ur: 'آپ کا نام', as: 'আপোনাৰ নাম', ks: 'پنٕہِ ناو', kok: 'तुमचें नांव', mai: 'अहाँक नाम', sd: 'توهان جو نالو', ne: 'तपाईंको नाम', sa: 'भवतः नाम', sat: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ', brx: 'आंनि मुं', doi: 'तुहाडा नां', },
};

function getText(key) {
  var lang = state ? (state.userLang || 'hi') : 'hi';
  var t = TRANS[key];
  if (!t) return key;
  return t[lang] || t['hi'] || t['en'] || key;
}

async function getTextAsync(key, toLang) {
  if (!toLang) toLang = state ? (state.userLang || 'hi') : 'hi';
  var fromLang = 'en';
  
  var t = TRANS[key];
  if (t && (t[toLang] || t['hi'] || t['en'])) {
    return t[toLang] || t['hi'] || t['en'];
  }
  
  if (REAL_TIME_TRANSLATION_ENABLED) {
    var sourceText = t ? (t['en'] || t['hi'] || key) : key;
    var translated = await translateText(sourceText, toLang, t ? (t['en'] ? 'en' : 'hi') : 'en');
    return translated;
  }
  
  return key;
}

function __(key) {
  return getText(key);
}

function getFallbackLanguage(code) {
  var fallbackMap = {
    'kok': 'mr',
    'mai': 'hi',
    'brx': 'as',
    'doi': 'hi',
    'sat': 'hi',
    'ks': 'ur',
    'sd': 'hi',
    'sa': 'hi',
    'ne': 'hi',
  };
  return fallbackMap[code] || null;
}

async function applyLanguageRTL() {
  var code = state.userLang || 'hi';
  
  var langBtn = document.getElementById('lang-btn-text');
  if (langBtn) langBtn.textContent = code.toUpperCase();
  
  var elements = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var key = el.getAttribute('data-i18n');
    var originalText = el.getAttribute('data-original-text') || el.textContent;
    
    var t = TRANS[key];
    if (t && t[code]) {
      el.textContent = t[code];
    } else if (REAL_TIME_TRANSLATION_ENABLED) {
      var sourceText = t ? (t['en'] || t['hi'] || key) : originalText;
      var sourceLang = t ? (t['en'] ? 'en' : 'hi') : 'en';
      
      var translated = await translateText(sourceText, code, sourceLang);
      if (translated !== sourceText) {
        el.setAttribute('data-original-text', originalText);
        el.textContent = translated;
      }
    }
  }
  
  var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  for (var j = 0; j < placeholders.length; j++) {
    var elPh = placeholders[j];
    var keyPh = elPh.getAttribute('data-i18n-placeholder');
    var originalPh = elPh.getAttribute('data-original-placeholder') || elPh.placeholder;
    
    var tPh = TRANS[keyPh];
    if (tPh && tPh[code]) {
      elPh.placeholder = tPh[code];
    } else if (REAL_TIME_TRANSLATION_ENABLED) {
      var sourcePh = tPh ? (tPh['en'] || tPh['hi'] || keyPh) : originalPh;
      var sourceLangPh = tPh ? (tPh['en'] ? 'en' : 'hi') : 'en';
      
      var translatedPh = await translateText(sourcePh, code, sourceLangPh);
      if (translatedPh !== sourcePh) {
        elPh.setAttribute('data-original-placeholder', originalPh);
        elPh.placeholder = translatedPh;
      }
    }
  }
  
  var title = TRANS['site_title'];
  if (title && title[code]) {
    document.title = title[code];
  }
  
  var rtlLangs = ['ur', 'ks', 'sd'];
  if (rtlLangs.indexOf(code) !== -1) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}

function getCategoryName(cat) {
  if (!cat) return '';
  var lang = state.userLang || 'hi';
  var map = {
    hi: cat.name, en: cat.nameEn, mr: cat.nameMr,
    bn: cat.nameBn, ta: cat.nameTa, te: cat.nameTe,
    gu: cat.nameGu, pa: cat.namePa, kn: cat.nameKn,
    ml: cat.nameMl, or: cat.nameOr, ur: cat.nameUr,
    as: cat.nameAs, ks: cat.nameKs, kok: cat.nameKok,
    mai: cat.nameMai, sd: cat.nameSd, ne: cat.nameNe,
    sa: cat.nameSa, sat: cat.nameSat, brx: cat.nameBrx,
    doi: cat.nameDoi,
  };
  return map[lang] || cat.name || cat.nameEn;
}

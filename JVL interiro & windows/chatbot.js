// ============================================================
// WebsiteChatBot — Smart Website Assistant (no API key needed)
// Automatically analyzes the website and answers questions
// ============================================================
class WebsiteChatBot {
  constructor(config = {}) {
    this.config = {
      botName: config.botName || "JVL Assistant",
      primaryColor: config.primaryColor || "#C9A84C",
      position: config.position || "bottom-right",
      welcomeMessage: config.welcomeMessage || "Hi! 👋 I'm your JVL Interiors assistant. Ask me anything about our services, pricing, or book a free visit!",
      ...config
    };
    this.websiteData = {};
    this.conversationHistory = [];
    this.isOpen = false;
    this.init();
  }

  // ═══════════════════════════════════════════════════════════════
  // WEBSITE ANALYSIS ENGINE
  // ═══════════════════════════════════════════════════════════════

  init() {
    this.analyzeWebsite();
    this.createChatUI();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  analyzeWebsite() {
    this.websiteData = {
      title: document.title,
      metaDescription: this.getMetaContent('description'),
      metaKeywords: this.getMetaContent('keywords'),
      headings: this.extractHeadings(),
      paragraphs: this.extractParagraphs(),
      links: this.extractLinks(),
      navigation: this.extractNavigation(),
      sections: this.extractSections(),
      contactInfo: this.extractContactInfo(),
      services: this.extractServices(),
      faqs: this.extractFAQs(),
      socialLinks: this.extractSocialLinks(),
      pricing: this.extractPricing(),
      testimonials: this.extractTestimonials(),
      fullText: document.body.innerText
    };
  }

  getMetaContent(name) {
    var meta = document.querySelector('meta[name="' + name + '"]') || document.querySelector('meta[property="og:' + name + '"]');
    return meta ? meta.getAttribute('content') : '';
  }

  extractHeadings() {
    var headings = {};
    for (var i = 1; i <= 6; i++) {
      var elements = document.querySelectorAll('h' + i);
      headings['h' + i] = Array.from(elements).map(function (el) {
        return { text: el.innerText.trim(), id: el.id, section: (el.closest('section') || {}).id || '' };
      });
    }
    return headings;
  }

  extractParagraphs() {
    return Array.from(document.querySelectorAll('p')).map(function (p) {
      return { text: p.innerText.trim(), section: (p.closest('section') || {}).id || '' };
    }).filter(function (p) { return p.text.length > 10; });
  }

  extractLinks() {
    return Array.from(document.querySelectorAll('a')).map(function (a) {
      return { text: a.innerText.trim(), href: a.href };
    }).filter(function (l) { return l.text.length > 0; });
  }

  extractNavigation() {
    var nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(function (a) {
      return { text: a.innerText.trim(), href: a.href };
    });
  }

  extractSections() {
    return Array.from(document.querySelectorAll('section, [data-section], .section')).map(function (section) {
      return {
        id: section.id,
        heading: (section.querySelector('h1, h2, h3') || {}).innerText || '',
        content: section.innerText.substring(0, 500),
        element: section
      };
    });
  }

  extractContactInfo() {
    var text = document.body.innerText;
    var contact = {};
    var emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
    if (emailMatch) contact.emails = [...new Set(emailMatch)];
    var phoneMatch = text.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.\/0-9]{7,}/g);
    if (phoneMatch) contact.phones = [...new Set(phoneMatch)];
    var addressEl = document.querySelector('[itemtype*="PostalAddress"], .address, [class*="address"]');
    if (addressEl) contact.address = addressEl.innerText.trim();
    return contact;
  }

  extractServices() {
    var serviceSection = document.querySelector('#services, .services, [data-section="services"]');
    if (!serviceSection) return [];
    return Array.from(serviceSection.querySelectorAll('.service, .card, [class*="service"], li')).map(function (el) {
      return {
        title: (el.querySelector('h2, h3, h4, .title') || {}).innerText || '',
        description: (el.querySelector('p, .description') || {}).innerText || el.innerText.substring(0, 200)
      };
    }).filter(function (s) { return s.title || s.description; });
  }

  extractFAQs() {
    var faqSection = document.querySelector('#faq, .faq, [data-section="faq"], #faqs');
    if (!faqSection) return [];
    var faqs = [];
    var questions = faqSection.querySelectorAll('dt, .question, [class*="question"], h3, h4');
    questions.forEach(function (q) {
      var answer = q.nextElementSibling;
      if (answer) faqs.push({ question: q.innerText.trim(), answer: answer.innerText.trim() });
    });
    return faqs;
  }

  extractSocialLinks() {
    var socialPatterns = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'];
    return Array.from(document.querySelectorAll('a')).filter(function (a) {
      return socialPatterns.some(function (p) { return a.href.toLowerCase().includes(p); });
    }).map(function (a) {
      return { platform: socialPatterns.find(function (p) { return a.href.toLowerCase().includes(p); }), url: a.href };
    });
  }

  extractPricing() {
    var pricingSection = document.querySelector('#pricing, .pricing, [data-section="pricing"]');
    if (!pricingSection) return [];
    return Array.from(pricingSection.querySelectorAll('.plan, .card, [class*="price"], [class*="plan"]')).map(function (el) {
      return {
        name: (el.querySelector('h2, h3, h4, .title') || {}).innerText || '',
        price: (el.querySelector('.price, [class*="price"], .amount') || {}).innerText || '',
        features: Array.from(el.querySelectorAll('li, .feature')).map(function (f) { return f.innerText.trim(); })
      };
    });
  }

  extractTestimonials() {
    var section = document.querySelector('#testimonials, .testimonials, [data-section="testimonials"], .reviews');
    if (!section) return [];
    return Array.from(section.querySelectorAll('.testimonial, .review, .card, blockquote')).map(function (el) {
      return {
        text: (el.querySelector('p, .text, .quote') || {}).innerText || el.innerText,
        author: (el.querySelector('.author, .name, cite') || {}).innerText || ''
      };
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // INTELLIGENT RESPONSE ENGINE
  // ═══════════════════════════════════════════════════════════════

  generateResponse(userMessage) {
    if (!userMessage) return { text: "Sorry, I can only answer questions related to JVL Interiors & Windows." };
    var message = userMessage.toLowerCase().trim();
    var clean = message.replace(/[^a-z0-9\s₹]/gi, ' ').replace(/\s+/g, ' ').trim();
    var words = clean.split(' ');

    function hasAny(arr) {
      for (var i = 0; i < arr.length; i++) {
        var term = arr[i];
        if (term.indexOf(' ') !== -1) {
          if (clean.indexOf(term) !== -1) return true;
        } else {
          if (words.indexOf(term) !== -1 || clean.indexOf(term) !== -1) return true;
        }
      }
      return false;
    }

    // 0. Prompt injection defense
    if (clean.indexOf('ignore') !== -1 && (clean.indexOf('instruction') !== -1 || clean.indexOf('previous') !== -1 || clean.indexOf('prompt') !== -1 || clean.indexOf('rule') !== -1)) {
      return { text: "I am JVL Chats, the official assistant for JVL Interiors & Windows. I cannot override my instructions, but I'm happy to help you with our services, pricing, or bookings!" };
    }

    // 1. Navigation / Scroll actions (only explicit requests)
    var navKeywords = ['go to section', 'take me to section', 'scroll to'];
    for (var i = 0; i < navKeywords.length; i++) {
      if (clean.indexOf(navKeywords[i]) !== -1) {
        return this.handleScrollAction(clean.replace(navKeywords[i], '').trim());
      }
    }

    // 2. Greetings
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|vanakkam|greetings|howdy)\b/i.test(clean) || (clean.length <= 15 && hasAny(['hi', 'hello', 'hey', 'namaste', 'vanakkam']))) {
      return this.handleGreeting();
    }

    // 3. Gratitude / Polite Exit
    if (hasAny(['thank you', 'thanks', 'thank', 'thx', 'appreciate it', 'okay thanks', 'ok thanks', 'great thanks', 'perfect thanks', 'bye', 'goodbye'])) {
      return { text: "You’re welcome! 😊 If you need anything else, feel free to ask. You can also reach us anytime at +91 81898 93526. Have a wonderful day!" };
    }

    // 4. Booking / Consultation
    if (hasAny(['book', 'booking', 'appointment', 'schedule', 'consult', 'consultation', 'visit', 'free visit', 'home visit', 'inspection', 'site visit', 'come home', 'measurement', 'measure', 'free home visit'])) {
      return { text: "I'd love to help you book a free home visit or consultation! 📝 Please call or WhatsApp us directly at **+91 81898 93526**, or use the 'Get Your Proposal' consultation section on our website." };
    }

    // 5. Business Hours & Timings & Sundays
    var hoursIndicators = ['hour', 'hours', 'timing', 'timings', 'time', 'open', 'opening', 'close', 'closing', 'closed', 'shut', 'sunday', 'monday', 'saturday', 'weekend', 'weekdays', 'working days', 'working time', 'business hours'];
    if (hasAny(['when are you open', 'when do you open', 'when do you close', 'what time', 'is it open', 'are you open', 'are you open now', 'shop timing', 'office timing', 'store timing']) ||
        (hasAny(hoursIndicators) && (hasAny(['shop', 'office', 'store', 'showroom', 'studio', 'work', 'working', 'business', 'today', 'tomorrow', 'sunday', 'weekend', 'now']) || clean.indexOf('time') !== -1 || clean.indexOf('hour') !== -1 || clean.indexOf('open') !== -1 || clean.indexOf('close') !== -1))) {
      return this.handleHours();
    }

    // 6. Location / Address / Showroom / Directions
    var locIndicators = ['where', 'location', 'located', 'locate', 'address', 'situated', 'place', 'direction', 'directions', 'map', 'maps', 'google maps', 'find you', 'find your', 'reach you', 'reach your', 'how do i find', 'how to reach', 'where are you', 'where is', 'route', 'landmark', 'based'];
    var locContext = ['shop', 'store', 'showroom', 'studio', 'office', 'dindigul', 'kullanampatti', 'natham', 'branch', 'firm', 'business', 'place', 'jvl', 'based', 'located', 'situated'];
    if (hasAny(['where are you based', 'where are you guys based', 'where is the shop', 'where is your shop', 'where is your office', 'where are you located', 'where is jvl', 'how to find you', 'how do i find you', 'what is your address', 'what\'s your address', 'whats your address', 'location please', 'give me your location', 'share location']) ||
        (clean.indexOf('where') !== -1 && hasAny(['based', 'located', 'situated', 'shop', 'office', 'store', 'showroom', 'studio', 'address'])) ||
        (hasAny(locIndicators) && (hasAny(locContext) || words.length <= 4))) {
      return this.handleContact();
    }

    // 7. Pricing Objection ("prices are too high")
    if (hasAny(['too high', 'too expensive', 'prices are high', 'price is high', 'costly', 'very high', 'very expensive', 'prices are too high'])) {
      return { text: "Totally understand budget matters — our estimation tool lets you adjust finishes and add-ons to fit different budgets. Want to try it, or would you rather chat with our team directly?" };
    }

    // 8. Unlisted Services Check (marble flooring, civil work, etc.)
    if (hasAny(['marble', 'granite flooring', 'marble flooring', 'vitrified', 'solar', 'plumbing only', 'civil work only', 'roofing shed', 'painting only'])) {
      return { text: "That's not something I have specifics on — but our team can definitely help clarify. Want me to share our WhatsApp number so you can ask directly?" };
    }

    // 9. Pricing & Rates
    var priceWords = ['price', 'pricing', 'cost', 'costing', 'rate', 'rates', 'how much', 'charge', 'charges', 'fee', 'fees', 'budget', 'quote', 'quotation', 'estimate', 'sqft', 'sq ft', 'square feet', 'approx', 'amount', 'tariff', 'bhk', '1bhk', '2bhk', '3bhk', '4bhk'];
    var isPriceQuery = hasAny(priceWords);

    var isInterior = hasAny(['interior', 'interiors', 'home interior', 'house interior', 'full home', 'renovation', 'flat', 'apartment', 'living room', 'bedroom', 'hall', 'woodwork', 'wood work', 'decor', '2bhk', '1bhk', '3bhk', 'bhk']);
    var isKitchen = hasAny(['kitchen', 'modular kitchen', 'countertop', 'cabinets', 'l shape', 'u shape', 'parallel kitchen', 'crockery']);
    var isSystemWindow = hasAny(['system window', 'system windows', 'architectural window', 'acoustic window', 'soundproof window']);
    var isUpvc = hasAny(['upvc', 'upvc window', 'upvc windows', 'sliding window', 'sliding windows', 'casement window', 'casement windows']);
    var isMosquito = hasAny(['mosquito', 'mesh', 'net', 'mosquito net', 'insect screen', 'mosquito window']);
    var isDoor = hasAny(['pvc door', 'pvc doors', 'bathroom door', 'toilet door', 'waterproof door', 'door', 'doors']);
    var isPartition = hasAny(['partition', 'partitions', 'glass partition', 'aluminium partition', 'office partition', 'cubicle', 'divider']);
    var isCupboard = hasAny(['cupboard', 'cupboards', 'wardrobe', 'wardrobes', 'closet', 'storage', 'loft']);
    var isCeiling = hasAny(['ceiling', 'false ceiling', 'pop', 'gypsum', 'cove lighting', 'led ceiling', 'fall ceiling', 'fallceiling']);

    if (isPriceQuery) {
      if (isInterior) return { text: "Interior work starts at ₹450/sq.ft, but the exact cost depends on your space and finish choices. Try our 'Get Your Estimation' tool for an instant price range — takes about a minute!" };
      if (isSystemWindow) return { text: "System Windows start at ₹1,200/sq.ft with premium slim profiles, acoustic insulation, and expert installation. Final pricing is confirmed after a free site inspection!" };
      if (isUpvc) return { text: "uPVC Windows start at ₹300/sq.ft onwards with sliding and casement options. Final pricing is confirmed after a free site inspection!" };
      if (isMosquito) return { text: "Mosquito Windows start at ₹160/sq.ft onwards using durable mesh and aluminium frames. Final pricing is confirmed after a free site inspection!" };
      if (isKitchen) return { text: "Modular Kitchen packages start at ₹450/sq.ft onwards for custom layouts (L-shape, U-shape, straight, parallel). Final pricing is confirmed after a free site inspection!" };
      if (isDoor || isPartition) return { text: "Partition Work (Doors & Partitions) starts at ₹350/sq.ft, and PVC doors from ₹2,400/piece. Final pricing is confirmed after a free site inspection!" };
      if (isCupboard) return { text: "Cupboard & wardrobe works start at ₹350/sq.ft onwards tailored to your space. Final pricing is confirmed after a free site inspection!" };
      if (isCeiling) return { text: "False Ceiling & Lighting starts at ₹75/sq.ft with Gypsum, POP, and concealed LED cove designs. Final pricing is confirmed after a free site inspection!" };

      return this.handlePricing();
    }

    // 10. Specific service overviews
    if (isSystemWindow || isUpvc || (hasAny(['window', 'windows', 'glass window']) && !isInterior && !isKitchen)) {
      return { text: "We offer premium window systems: System Windows (from ₹1,200/sq.ft) and uPVC Windows (from ₹300/sq.ft) with sliding and casement options. Final pricing is confirmed after a free site inspection!" };
    }
    if (isInterior) {
      return { text: "Our interior work starts at ₹450/sq.ft with custom designs tailored to your space and budget. You get a single point of contact from design to handover. Try our 'Get Your Estimation' tool or book a free site visit!" };
    }
    if (isKitchen) {
      return { text: "Our modular kitchens start at ₹450/sq.ft with custom layouts and durable marine ply. Final pricing is confirmed after a free site inspection. Want to try our estimation tool?" };
    }
    if (isCeiling) {
      return { text: "We install false ceilings in Gypsum, POP, and LED lighting solutions starting at ₹75/sq.ft. Final pricing is confirmed after a free site inspection!" };
    }
    if (isPartition || isDoor) {
      return { text: "Our partition works (doors & partitions) start at ₹350/sq.ft for glass and aluminium options, and PVC doors from ₹2,400/piece. Final pricing is confirmed after a free site inspection!" };
    }

    // 11. Services Overview
    if (hasAny(['service', 'services', 'offer', 'what do you do', 'what can you do', 'solutions', 'work', 'catalog', 'catalogue', 'what kind of', 'types of work'])) {
      return this.handleServices();
    }

    // 12. Contact / Call / WhatsApp
    if (hasAny(['contact', 'phone', 'call', 'reach', 'whatsapp', 'number', 'mobile', 'talk', 'speak', 'telephone', 'chat with us'])) {
      return this.handleContact();
    }

    // 13. About / Owner
    if (hasAny(['who', 'owner', 'founder', 'proprietor', 'about', 'ajith', 'ajith kumar', 'experience', 'company', 'stats', 'story', 'history', 'background', 'reputation'])) {
      return this.handleAbout();
    }

    // 14. Why choose us
    if (hasAny(['why', 'why choose', 'special', 'different', 'best', 'guarantee', 'quality', 'warranty', 'advantage', 'trust', 'benefits'])) {
      return this.handleWhyUs();
    }

    // 15. How to get pricing / Estimation / Quotation
    if (hasAny(['how to get pricing', 'quotation', 'quote', 'estimation', 'estimate', 'calculator'])) {
      return { text: "You can get pricing in two ways: 'Get Your Free Quotation' (quick form, reply within 2 hours, 100% free) or 'Get Your Estimation' (instant 5-step calculator with downloadable PDF/Excel estimate)!" };
    }

    // 16. Fallback response (exact match to production prompt)
    return { text: "I'm best at helping with JVL's services, pricing, and bookings — for anything else, feel free to reach out to our team directly at +91 81898 93526 or on WhatsApp." };
  }

  handleHours() {
    return { text: "We're open Monday–Saturday, 9 AM to 6 PM. Closed on Sundays. Need our number to call ahead?" };
  }

  handleGreeting() {
    return { text: 'Hello! 👋 Welcome to JVL Interiors & Windows. We offer premium interior design and window solutions in Dindigul. How can I help you today?' };
  }

  handleTechStack() {
    return { text: '🛠️ **Website Architecture & Technology Stack**:\n\nThe JVL Interiors & Windows website is built with HTML5, Vanilla JavaScript (ES6+), and CSS3 with Google Fonts (Inter, Outfit, Cormorant Garamond, Calibri).\n\nKey Technologies:\n• **PDF Engine**: Client-side generation using `html2pdf.js`\n• **Excel Export**: Spreadsheet generation via `SheetJS` (`xlsx.full.min.js`)\n• **Typography**: Custom `Calibri` font for Estimated Cost Ranges\n• **Transient Storage**: Web Storage API (`sessionStorage` payloads)\n• **Layout**: Flexbox, CSS Grid & Glassmorphic cards' };
  }

  handleEstimationTax() {
    return { text: '📊 **Estimation & Tax Engine**:\n\nOur cost estimation wizard calculates step-by-step:\n1. **Subtotal (Excl. Tax)**: Actual price derived from area sqft, material premiums (Laminate baseline, Acrylic/Teak premium), and add-ons.\n2. **18% GST Tax**: Calculated as `Subtotal × 18%`.\n3. **Total Amount (Incl. 18% Tax)**: `Subtotal + 18% GST`.\n4. **Indicative Budget Range**: Formatted in Calibri font (Total Amount to +15%).' };
  }

  handleInvoices() {
    return { text: '📄 **Document & Invoice Micro-Pages**:\n\nWe provide 2 standalone performa invoice pages:\n• **Quotation Invoice (`invoice.html`)**: Formal quotation generator (`JVL-YEAR-XXXX`) with PDF download & WhatsApp appointment booking.\n• **Estimation Invoice (`estimation-invoice.html`)**: Estimation report (`JVL-EST-YEAR-XXXX`) with PDF download & Excel export.\n\n📱 **Mobile View**: Total amounts are displayed in a clean horizontal totals box directly below the items table on mobile screens!' };
  }

  handlePages() {
    return { text: '🗺️ **Website Pages & Blueprint**:\n\n1. **Main Web Application (`index.html`)**: Hero slider, Founder Profile, 6 Core Services, Process, Portfolio, Cost Estimator, Quotation Modal, Chatbot.\n2. **Quotation Performa Invoice (`invoice.html`)**: Standalone quotation document.\n3. **Estimation Report & Invoice (`estimation-invoice.html`)**: Standalone estimation invoice.' };
  }

  handleContact() {
    return { text: "📞 **Contact & Location**:\n\n📍 Address: 3/8, Lakshmi Devi complex, Kullanampatti, Natham main road, Near SKB petrol bunk, Dindigul.\n📍 Studio: Natham Rd, near indian oil bunk, Kaveri Nagar, Dindigul, TN 624003.\n📱 Phone / WhatsApp: +91 81898 93526 | Alt: 88387 13630\n🕐 Hours: Mon–Sat: 9:00 AM – 6:00 PM (Sunday Closed)\n🗺️ Google Maps: https://maps.app.goo.gl/pZhzmquLpWoRmkpv5?g_st=aw" };
  }

  handleServices() {
    return { text: "🛠️ **Services & Starting Rates**:\n\n1. **Interior Work** — ₹450 / sq.ft onwards\n2. **uPVC Windows** — ₹300 / sq.ft onwards\n3. **Mosquito Windows** — ₹160 / sq.ft onwards\n4. **System Windows** — ₹1,200 / sq.ft onwards\n5. **PVC Doors** — ₹2,400 / piece onwards\n6. **Partition Works** — ₹350 / sq.ft onwards\n7. **Modular Kitchen** — ₹450 / sq.ft onwards\n8. **Cupboard Works** — ₹350 / sq.ft onwards\n9. **False Ceiling** — ₹75 / sq.ft onwards\n\n*All prices are starting rates. Final quote confirmed after a free home visit! 18% GST extra." };
  }

  handlePricing() {
    return { text: "💰 **Starting Rates Matrix**:\n\n• **Interior Work**: ₹450 / sq.ft onwards\n• **uPVC Windows**: ₹300 / sq.ft onwards\n• **Mosquito Windows**: ₹160 / sq.ft onwards\n• **System Windows**: ₹1,200 / sq.ft onwards\n• **PVC Doors**: ₹2,400 / piece onwards\n• **Partition Works**: ₹350 / sq.ft onwards\n• **Modular Kitchen**: ₹450 / sq.ft onwards\n• **Cupboard Works**: ₹350 / sq.ft onwards\n• **False Ceiling**: ₹75 / sq.ft onwards\n\nExact quotes provided after a free home inspection. 18% GST extra." };
  }

  handleAbout() {
    return { text: "ℹ️ **About JVL Interiors & Windows**:\n\nFounded by **Mr. Ajith Kumar G** (Founder & Proprietor) with over a decade of expertise, JVL brings metropolis-grade interior design and window fabrication to Dindigul.\n\n🏆 **Company Stats**:\n• 30+ Projects Completed\n• 5+ Years Experience\n• 30+ Happy Families\n• 100% On-Time Delivery" };
  }

  handleTerms() {
    return { text: "📋 **Quotation Terms & Conditions**:\n\n• 75% advance along with order and 25% on delivery of material at site before installation.\n• Quote validity: 30 days.\n• Project execution: Completed within 14 days of advance payment received.\n• Tax: 18% GST extra." };
  }

  handleWhyUs() {
    return { text: "⭐ **Why Choose JVL?**\n\n✓ Custom Designs for your space & budget\n✓ Expert Installation by trained craftsmen\n✓ On-Time Delivery always guaranteed\n✓ Transparent Pricing with no hidden charges\n✓ Quality Guarantee with post-installation support\n✓ Single Point of Contact from concept to handover!" };
  }

  handleSocial() {
    return { text: "🌐 **Connect with Us**:\n\n📱 WhatsApp: +91 81898 93526\n📍 Location: Dindigul, Tamil Nadu\n🌐 Website: https://jvl-interiors-and-windows.netlify.app/" };
  }

  handleTestimonials() {
    return { text: "⭐ **Client Reviews**:\n\n\"Every space has a story. We help you tell it beautifully.\" — Mr. Ajith Kumar G, Founder\n\nWith over 500+ projects and 200+ happy families served in Dindigul, we maintain a 100% on-time delivery track record!" };
  }

  handleScrollAction(target) {
    var section = this.findSection(target);
    if (section && section.element) {
      section.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return { text: '📍 Scrolled to the "' + (section.heading || target) + '" section!' };
    }
    return { text: "I couldn't find a section called '" + target + "'." };
  }

  handleSearch(message) {
    var result = this.searchContent(message);
    if (result) return { text: result };
    return { text: "Sorry, I can only answer questions related to JVL Interiors & Windows." };
  }

  handleGeneral(message) {
    return { text: "Sorry, I can only answer questions related to JVL Interiors & Windows." };
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════

  findSection(keyword) {
    var kw = keyword.toLowerCase();
    for (var i = 0; i < this.websiteData.sections.length; i++) {
      var s = this.websiteData.sections[i];
      if ((s.id || '').toLowerCase().includes(kw) || (s.heading || '').toLowerCase().includes(kw)) {
        return s;
      }
    }
    return null;
  }

  searchContent(query) {
    var words = query.toLowerCase().split(' ').filter(function (w) { return w.length > 3; });
    if (words.length === 0) return null;
    for (var i = 0; i < this.websiteData.paragraphs.length; i++) {
      var para = this.websiteData.paragraphs[i];
      var paraLower = para.text.toLowerCase();
      var matchCount = 0;
      for (var j = 0; j < words.length; j++) {
        if (paraLower.includes(words[j])) matchCount++;
      }
      if (matchCount >= Math.ceil(words.length * 0.5) && matchCount > 0) {
        return 'Based on our website content:\n\n"' + para.text.substring(0, 300) + '"';
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // UI CREATION
  // ═══════════════════════════════════════════════════════════════

  createChatUI() {
    var primaryColor = this.config.primaryColor;
    var botName = this.config.botName;

    var chatHTML = '\
      <div id="chatbot-toggle" style="position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:50%;background:' + primaryColor + ';color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.2);border:none;font-size:26px;transition:transform 0.2s;">🤖</div>\
      <div id="chatbot-window" class="hidden" style="position:fixed;bottom:90px;right:20px;width:360px;height:520px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.25);z-index:9999;display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">\
        <div style="background:' + primaryColor + ';color:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">\
          <div style="display:flex;align-items:center;gap:10px;">\
            <span style="font-size:22px;">🤖</span>\
            <div><div style="font-weight:600;font-size:14px;">' + botName + '</div><div style="font-size:11px;opacity:0.85;">Online</div></div>\
          </div>\
          <button id="chatbot-close" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:0 4px;">&times;</button>\
        </div>\
        <div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;background:#fafafa;"></div>\
        <div style="padding:8px 16px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid #eee;">\
          <button class="suggestion-btn" data-query="What services do you offer?" style="padding:6px 12px;background:#f0f2f5;border:1px solid #ddd;border-radius:16px;font-size:12px;cursor:pointer;">Services</button>\
          <button class="suggestion-btn" data-query="Contact information" style="padding:6px 12px;background:#f0f2f5;border:1px solid #ddd;border-radius:16px;font-size:12px;cursor:pointer;">Contact</button>\
          <button class="suggestion-btn" data-query="What are your prices?" style="padding:6px 12px;background:#f0f2f5;border:1px solid #ddd;border-radius:16px;font-size:12px;cursor:pointer;">Pricing</button>\
          <button class="suggestion-btn" data-query="About the company" style="padding:6px 12px;background:#f0f2f5;border:1px solid #ddd;border-radius:16px;font-size:12px;cursor:pointer;">About</button>\
        </div>\
        <div style="padding:12px 16px;border-top:1px solid #eee;display:flex;gap:8px;">\
          <input id="chatbot-input" placeholder="Type your question..." style="flex:1;padding:10px 16px;border:1px solid #ddd;border-radius:24px;outline:none;font-size:14px;" />\
          <button id="chatbot-send" style="width:40px;height:40px;border-radius:50%;background:' + primaryColor + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;">&#10148;</button>\
        </div>\
      </div>';
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    this.injectStyles();
  }

  injectStyles() {
    var styles = '.hidden{display:none!important}.chat-message{max-width:80%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.4;animation:fadeIn 0.3s}.chat-message.bot{background:#f0f2f5;color:#333;align-self:flex-start;border-bottom-left-radius:4px}.chat-message.user{background:' + this.config.primaryColor + ';color:white;align-self:flex-end;border-bottom-right-radius:4px}.chat-action-btn{display:inline-block;margin-top:8px;padding:6px 12px;background:' + this.config.primaryColor + ';color:white;border:none;border-radius:20px;font-size:12px;cursor:pointer}.chat-action-btn:hover{opacity:0.8}.suggestion-btn:hover{background:' + this.config.primaryColor + ';color:white;border-color:' + this.config.primaryColor + '}.typing-indicator{display:flex;gap:4px;padding:10px 14px;background:#f0f2f5;border-radius:16px;align-self:flex-start;border-bottom-left-radius:4px}.typing-dot{width:8px;height:8px;background:#999;border-radius:50%;animation:typing 1.4s infinite}.typing-dot:nth-child(2){animation-delay:0.2s}.typing-dot:nth-child(3){animation-delay:0.4s}@keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(max-width:480px){#chatbot-window{width:calc(100vw - 40px);height:calc(100vh - 120px);bottom:70px;right:20px}}';
    var styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  bindEvents() {
    var self = this;
    document.getElementById('chatbot-toggle').addEventListener('click', function () { self.toggleChat(); });
    document.getElementById('chatbot-close').addEventListener('click', function () { self.toggleChat(); });
    document.getElementById('chatbot-send').addEventListener('click', function () { self.sendMessage(); });
    document.getElementById('chatbot-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') self.sendMessage();
    });
    var suggestions = document.querySelectorAll('.suggestion-btn');
    suggestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('chatbot-input').value = btn.dataset.query;
        self.sendMessage();
      });
    });

    // Close when clicking anywhere on website outside the chatbot window and toggle
    document.addEventListener('click', function (e) {
      var windowEl = document.getElementById('chatbot-window');
      var toggle = document.getElementById('chatbot-toggle');
      if (!self.isOpen || !windowEl) return;
      if (!windowEl.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
        self.toggleChat();
      }
    });
  }

  toggleChat() {
    var windowEl = document.getElementById('chatbot-window');
    var toggle = document.getElementById('chatbot-toggle');
    this.isOpen = !this.isOpen;
    windowEl.classList.toggle('hidden');
    toggle.style.display = this.isOpen ? 'none' : 'flex';
    if (this.isOpen) {
      document.getElementById('chatbot-input').focus();
    }
  }

  sendMessage() {
    var input = document.getElementById('chatbot-input');
    var message = input.value.trim();
    if (!message) return;
    this.addMessage(message, 'user');
    input.value = '';
    this.showTyping();
    var self = this;
    setTimeout(function () {
      self.hideTyping();
      var response = self.generateResponse(message);
      self.addMessage(response.text, 'bot', response.action, response.actionLabel);
    }, 500 + Math.random() * 1000);
  }

  addMessage(text, sender, action, actionLabel) {
    var messages = document.getElementById('chatbot-messages');
    var messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + sender;
    var formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedText;
    if (action && actionLabel) {
      var btn = document.createElement('button');
      btn.className = 'chat-action-btn';
      btn.textContent = actionLabel;
      btn.addEventListener('click', action);
      messageDiv.appendChild(btn);
    }
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
    this.conversationHistory.push({ sender: sender, text: text });
  }

  addWelcomeMessage() {
    var self = this;
    setTimeout(function () {
      self.addMessage(self.config.welcomeMessage, 'bot');
    }, 500);
  }

  showTyping() {
    var messages = document.getElementById('chatbot-messages');
    var typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  hideTyping() {
    var typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
}

// Auto-initialize
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebsiteChatBot;
} else {
  window.WebsiteChatBot = WebsiteChatBot;
}

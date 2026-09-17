# JVL Interiors & Windows — Chatbot Knowledge Base & Website Blueprint

> This file is the single source of truth for the **JVL Chats** chatbot and developer agents. All chatbot answers are derived from the information below. When new information or features are added to the website, they must also be documented here.

---

## Business Identity

- **Business Name:** JVL Interiors & Windows
- **Tagline:** Your Perfect Choice of Interiors
- **Proprietor:** Mr. Ajith Kumar G (Founder & Proprietor)
- **Phone:** +91 81898 93526
- **WhatsApp:** +91 81898 93526
- **Alternate Phone:** 88387 13630
- **Address:** 3/8, Lakshmi Devi complex, Kullanampatti, Natham main road, Near SKB petrol bunk, Dindigul.
- **Additional Location:** Natham Rd, near indian oil bunk, Kaveri Nagar, Dindigul, Tamil Nadu 624003
- **Location:** Dindigul, Tamil Nadu, India
- **Google Maps:** https://maps.app.goo.gl/pZhzmquLpWoRmkpv5?g_st=aw
- **Website:** https://jvl-interiors-and-windows.netlify.app/
- **Working Hours:** Monday – Saturday: 9:00 AM – 6:00 PM
- **Sunday:** Closed

---

## Website Blueprint & Technology Stack

- **Architecture:** Lightweight Client-Side Single Page Application (SPA) with dedicated Performa Invoice micro-pages.
- **Core Stack:** HTML5, Vanilla JavaScript (ES6+), CSS3 (Flexbox, CSS Grid, Glassmorphism, CSS Variables).
- **Typography:** Google Fonts (`Inter`, `Outfit`, `Cormorant Garamond`, `Calibri`).
- **Document Engines:**
  - `html2pdf.js` for client-side PDF document generation.
  - `SheetJS` (`xlsx.full.min.js`) for Excel spreadsheet export.
- **Transient State Layer:** Web Storage API (`sessionStorage.jvl_quotation_data` and `sessionStorage.jvl_estimation_data`).
- **Pages Map:**
  - `index.html`: Main website, hero slider, services, process, portfolio, estimation wizard, quotation modal, chatbot.
  - `invoice.html`: Standalone performa quotation invoice generator (`JVL-YEAR-XXXX`).
  - `estimation-invoice.html`: Standalone estimation report & invoice generator (`JVL-EST-YEAR-XXXX`).

---

## Services & Pricing Matrix

| Service | Starting Price | Description |
|---------|---------------|-------------|
| Interior Work | ₹450/sq.ft onwards* | End-to-end interior design & custom execution. |
| uPVC Windows | ₹300/sq.ft onwards* | Premium uPVC sliding & casement windows. |
| Mosquito Windows | ₹160/sq.ft onwards* | Durable mosquito mesh window systems. |
| System Windows | ₹1,200/sq.ft onwards* | High-performance architectural system windows. |
| PVC Doors | ₹2,400/piece onwards* | Heavy-duty, waterproof PVC doors. |
| Partition Works | ₹350/sq.ft onwards* | Modern glass & aluminium office/home partitions. |
| Modular Kitchen | ₹450/sq.ft onwards* | Custom-designed modular kitchens & finishes. |
| Cupboard Works | ₹350/sq.ft onwards* | Custom wardrobes, cabinets & storage solutions. |
| False Ceiling | ₹75/sq.ft onwards* | Gypsum, POP & LED false ceiling works. |

> *Prices are indicative and vary based on scope and materials. Final pricing is confirmed after a free home visit. No hidden charges.

---

## Tax & Amount Breakdown Specifications

- **Subtotal (Actual Price Excl. Tax):** Sum of Base Cost + Material Premiums + Add-on services.
- **GST Tax Amount (18%):** Calculated as `Math.round(Subtotal * 0.18)`.
- **Total Amount (Incl. 18% Tax):** Calculated as `Subtotal + GST Tax Amount`.
- **Indicative Budget Range:** Minimum = Total Amount | Maximum = `Math.round(Total Amount * 1.15)`. Displayed in `Calibri` font.
- **Dual Amount Display:** Invoices explicitly list both the price before tax (Subtotal) and total price including 18% GST tax.
- **Mobile Responsiveness:** On mobile view (`max-width: 600px`), cramped table footer rows are hidden and replaced with a horizontal totals card (`.q-mobile-totals-box` / `.est-mobile-totals-box`) displaying Subtotal, 18% Tax, and Total Amount side-by-side with vertical dividers.

---

## Why Choose JVL

| Reason | Details |
|--------|---------|
| Custom Designs | Every project designed for your specific space, style and budget. |
| Expert Installation | Trained craftsmen. Flawless, precise on-site execution. |
| On-Time Delivery | We commit to deadlines and we honor them. Always. |
| Transparent Pricing | No hidden charges. Clear written quotes before work starts. |
| Quality Guarantee | Premium materials with post-installation support included. |
| Dedicated Support | Single point of contact from design to final handover. |

---

## About Us

With over a decade of hands-on expertise in interior design and premium window fabrication, Mr. Ajith Kumar G founded JVL Interiors & Windows with a single goal — to bring big-city quality to every home and business in Dindigul and beyond. From compact apartments to spacious residences, JVL delivers precision craftsmanship and elegant results that exceed expectations every time.

> "Every space has a story. We help you tell it beautifully." — Mr. Ajith Kumar G, Founder

---

## Company Stats

- **30+** Projects Completed
- **5+** Years Experience
- **30+** Happy Families
- **100%** On-Time Delivery

---

## FAQ — Chatbot Responses

### Greetings
**Triggers:** hi, hello, hey, good morning, good afternoon, good evening, namaste
**Response:** Hello! 👋 Welcome to JVL Interiors & Windows. We offer premium interior design and window solutions in Dindigul. How can I help you today?

### Services Overview
**Triggers:** service, offer, what do you do, what can you do
**Response:** We offer 5 main services: Interior Work (from ₹1.5L), System Windows (from ₹450/sqft), Partition Works (from ₹600/sqft), Modular Kitchen (from ₹85,000), and False Ceiling & Lighting (from ₹55/sqft). All prices are indicative — we provide exact quotes after a free home visit!

### Technical Stack & Website Architecture
**Triggers:** technology, tech stack, code, built with, framework, architecture, library, pdf, excel, website blueprint, website code
**Response:** The JVL Interiors website is built with lightweight HTML5, Vanilla JavaScript (ES6+), and CSS3 with Google Fonts (Inter, Outfit, Cormorant Garamond, Calibri). It uses html2pdf.js for PDF downloads, SheetJS for Excel exports, and Web Storage for transient invoice payloads!

### Calculation & Tax Engine
**Triggers:** tax, gst, 18%, subtotal, range, calibri, calculation, budget range, how does estimation work
**Response:** Our calculation engine computes the Subtotal (Actual Price before tax), adds 18% GST tax, and displays the Total Amount (including tax). It also generates an Indicative Budget Range styled in Calibri font!

### Invoices & Downloads
**Triggers:** invoice, pdf, excel, performa, download, mobile view, horizontal
**Response:** You can generate formal performa invoices (Quotation: `JVL-YEAR-XXXX`, Estimation: `JVL-EST-YEAR-XXXX`) with instant PDF download and Excel export. On mobile devices, total amounts are neatly displayed in a horizontal totals box below the table!

### Windows
**Triggers:** window, upvc, sliding, casement, system window
**Response:** We specialize in premium system windows including sliding, casement, and UPVC options. Starting at just ₹450/sqft with expert installation. For an exact quote, we offer a free home visit — call or WhatsApp +91 81898 93526!

### Interior Work
**Triggers:** interior, home interior, full home, house, interior work
**Response:** Our interior work packages start at ₹1.5 lakhs and include custom designs tailored to your space, style, and budget. From concept to handover, you get a single point of contact. Book a free home visit for an exact quote!

### Modular Kitchen
**Triggers:** kitchen, cabinet, modular kitchen, modular
**Response:** Our modular kitchen packages start at ₹85,000. Every kitchen is custom-designed to fit your space perfectly. Call +91 81898 93526 or book a free visit for a detailed quote!

### False Ceiling & Lighting
**Triggers:** ceiling, false ceiling, lighting, led, gypsum, pop
**Response:** We install false ceilings in gypsum, POP, and LED lighting solutions starting at just ₹55/sqft. Transform your space with modern ceiling designs! Contact us at +91 81898 93526 for a free consultation.

### Partition Works
**Triggers:** door, partition, glass door, glass partition, partition works
**Response:** Our partition works come in glass and aluminium options, starting at ₹600/sqft. Perfect for modern offices and homes. Book a free visit for an exact quote — call +91 81898 93526!

### Pricing
**Triggers:** price, cost, rate, how much, charge, fee, budget, estimate
**Response:** Here are our starting prices: Interior Work from ₹1.5L | Windows from ₹450/sqft | Partition Works from ₹600/sqft | Modular Kitchen from ₹85K | Ceilings from ₹55/sqft. Final pricing is confirmed after a free home visit. No hidden charges, ever!

### Working Hours
**Triggers:** hour, timing, open, close, when, time, working
**Response:** We're open Monday to Saturday, 9:00 AM to 6:00 PM. We're closed on Sundays. Feel free to call or WhatsApp us at +91 81898 93526 during business hours!

### Location
**Triggers:** where, location, address, map, direction, find you, situated
**Response:** We're located in Dindigul, Tamil Nadu, India. Our studio is at Natham Rd, near indian oil bunk, Kaveri Nagar, Dindigul, Tamil Nadu 624003. You can find us on Google Maps: https://maps.app.goo.gl/pZhzmquLpWoRmkpv5?g_st=aw — or call +91 81898 93526 for directions!

### Contact
**Triggers:** call, phone, contact, whatsapp, reach, talk, speak, number
**Response:** You can reach us at +91 81898 93526 via phone or WhatsApp. Our team is available Monday–Saturday, 9 AM–6 PM and typically responds within 2 hours!

### About / Owner
**Triggers:** who, owner, founder, proprietor, about, ajith
**Response:** JVL Interiors & Windows was founded by Mr. Ajith Kumar G. We're a premium interior design and window fabrication business based in Dindigul, Tamil Nadu, known for custom designs, expert craftsmanship, and transparent pricing.

### Why Choose Us
**Triggers:** why, choose, special, different, best, guarantee, quality
**Response:** Why choose JVL? Custom designs for every budget, expert installation by trained craftsmen, on-time delivery always, transparent pricing with no hidden charges, quality guarantee with post-installation support, and a single point of contact from design to handover!

### Booking / Appointment
**Triggers:** book, appointment, visit, schedule, consult, meeting, quote, free visit
**Response:** *(Triggers booking flow)* — I'd love to help you book a free consultation! Let me start the booking process for you.

### Thank You
**Triggers:** thank, thanks, thank you, okay, ok, great, nice, good
**Response:** You're welcome! 😊 If you need anything else, feel free to ask. You can also reach us anytime at +91 81898 93526. Have a wonderful day!

---

## Booking & Quotation Flow

### Booking Flow (via chatbot)
1. Collect **Name**
2. Collect **Email**
3. Collect **Phone**
4. Collect **City/Area**
5. Collect **Service type**
6. Generate confirmation + auto-forward to WhatsApp (+91 81898 93526)

### Quotation Flow (via chatbot)
1. Collect **Name**
2. Collect **Phone**
3. Collect **Email**
4. Collect **Service type**
5. Collect **City/Area**
6. Generate quotation reference (JVL-YEAR-XXXX) + PDF download option

### Quotation Terms & Conditions
- 75% advance along with order and 25% on delivery of material at site before installation.
- Validation of quote 30 days only.
- Total execution of project should be completed within 14 days of advance payment received.
- Tax extra (18%).

---

## Chatbot Rules

1. The chatbot can **ONLY** answer questions related to JVL Interiors & Windows and its website.
2. For unrelated questions (e.g. general trivia, unrelated products, coding help outside JVL site), respond: *"Sorry, I can only answer questions related to JVL Interiors & Windows."*
3. Keep replies short (2–4 sentences), warm, and professional.
4. Never invent information not listed in this document.
5. Never quote an exact final price — only starting prices.
6. For booking requests, trigger the booking flow instead of collecting details manually.

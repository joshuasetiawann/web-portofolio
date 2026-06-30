# Target Audience

> Purpose: define the 9 audiences this portfolio serves — for each, what they care about, the information they need, their likely objections, the pages that matter most, and their likely conversion action.

This document operationalizes [product-strategy](./product-strategy.md) for real people. Use it when deciding what a page must contain and where to route a given visitor. Journey detail is in [user-flows](./ux-flow.md); page specs in [page-specifications](./page-specifications.md).

---

## 1. Audience overview

| # | Audience | Intent | Primary conversion action |
|---|---|---|---|
| 1 | Recruiters / Talent partners | Screen fit fast | Résumé download + contact |
| 2 | Engineering managers / Tech leads | Assess depth & fit | Read case studies → contact |
| 3 | Founders | Find a builder-partner | Direct contact / meeting |
| 4 | Potential clients | Hire for a project | Contact with brief |
| 5 | Open-source collaborators | Evaluate as a maintainer/contributor | GitHub / repo follow + contact |
| 6 | Technical peers | Learn, validate, share | Read blog/research → follow / RSS |
| 7 | Conference / event organizers | Vet a speaker | Contact / speaker materials |
| 8 | Startup teams | Add a versatile hybrid | Contact / share internally |
| 9 | Product teams | Find product-minded eng | Contact + project review |

The four highest-value, highest-intent audiences (1–4) drive the **primary conversion goal**; the rest compound credibility, reach, and brand (secondary goals). See the [goals-to-pages map](./product-strategy.md#8-goals-to-pages-mapping).

---

## 2. Consolidated audience matrix

| Audience | What they care about | Info they need | Likely objections | Pages that matter most | Likely conversion |
|---|---|---|---|---|---|
| **1. Recruiters** | Fast role fit; seniority signal; availability; legitimacy | Title, stack, years, location/remote, availability, résumé, contact | "Too design-y to be a real engineer"; "Is this current?"; "Can I get the CV in 10 seconds?" | About, Experience, Projects, Certificates, Contact | Download CV + send a message |
| **2. Engineering managers** | Engineering depth; decision quality; collaboration; can they own ambiguity | Architecture, trade-offs, metrics, code, how-they-work | "Portfolio polish ≠ production rigor"; "Where's the substance?" | Project detail, Philosophy, GitHub, Open Source, Experience | Read 1–2 case studies → contact |
| **3. Founders** | Range, speed, ownership, taste, can-build-the-whole-thing | Breadth of work, shipped products, live links, creative + eng proof | "Generalist = shallow?"; "Available and serious?" | Landing, Projects, Open Source, About, Contact | Direct message / book a call |
| **4. Potential clients** | Outcomes, reliability, process, scope fit | Case studies with results, services implied, testimonials, how to start | "Can they deliver on time/budget?"; "Do they get business goals?" | Projects + detail, About, Contact, Gallery | Contact with a brief |
| **5. OSS collaborators** | Activity, code quality, responsiveness, values | Repos, contribution cadence, languages, maintainer style | "Is this maintained / responsive?"; "Will a PR be reviewed?" | Open Source, GitHub, Blog, Philosophy | Follow on GitHub / open issue → contact |
| **6. Technical peers** | Useful ideas, honest depth, shareable craft | Articles, research, technical breakdowns, the build itself | "Is this fluff or rigor?"; "Anything new to me?" | Blog + detail, Research, Philosophy, GitHub | Subscribe (RSS) / follow / share |
| **7. Conference organizers** | Speaking credibility, topics, professionalism | Talks/achievements, expertise areas, bio, headshot, contact | "Has this person spoken before?"; "On-brand for our event?" | Achievements, Timeline, About, Research, Contact | Contact for a speaking slot |
| **8. Startup teams** | Versatility, autonomy, culture fit, momentum | What they ship end-to-end, values, recent activity | "Hybrid = jack of all trades?"; "Pace match?" | Projects, Experience, Philosophy, GitHub, Landing | Contact / forward to founder |
| **9. Product teams** | Product sense + execution; user-centered eng | Outcome-driven case studies, metrics, design fluency | "Engineer who ignores UX?"; "Ships features, not products?" | Project detail, Gallery, Philosophy, About | Contact + share case study |

---

## 3. Per-audience detail

Each block names the **dominant objection** and the **single most important page** to neutralize it — the design priority for that audience.

### 1. Recruiters / Talent partners
- **Care about:** quick screen — role, seniority, stack, location/remote, availability, and a downloadable CV.
- **Need:** scannable facts above the fold of About/Experience; an obvious, fast résumé download; current dates.
- **Objection (dominant):** *"This looks like a designer, not a production engineer."* Neutralize on **Experience** (concrete roles, stack, impact) reinforced by **Certificates**.
- **Key pages:** About · Experience · Projects · Certificates · Contact.
- **Conversion:** résumé download → contact form. Make CV one click from any of those pages.

### 2. Engineering managers / Tech leads
- **Care about:** depth, judgment, trade-off reasoning, collaboration, ownership of ambiguity.
- **Need:** case studies that show problem → approach → trade-offs → outcome with metrics; real code; "how I work".
- **Objection (dominant):** *"Polished portfolio, but is the engineering rigorous?"* Neutralize on **Project detail** (architecture + metrics) backed by **GitHub** and **Philosophy**.
- **Key pages:** Project detail · Philosophy · GitHub · Open Source · Experience.
- **Conversion:** deep-read 1–2 case studies, then contact.

### 3. Founders
- **Care about:** range, speed, taste, end-to-end ownership — someone who can both design and ship.
- **Need:** breadth of shipped work, live links, and clear evidence of the creative+engineering hybrid.
- **Objection (dominant):** *"Generalist might mean shallow."* Neutralize on **Projects** (depth behind breadth) + **Open Source** (sustained craft).
- **Key pages:** Landing · Projects · Open Source · About · Contact.
- **Conversion:** direct message or book a call.

### 4. Potential clients
- **Care about:** outcomes, reliability, process, and whether scope fits.
- **Need:** results-led case studies, an implied services/working model, and a frictionless way to start a conversation with a brief.
- **Objection (dominant):** *"Can they deliver on time and to business goals?"* Neutralize on **Project detail** (outcomes/metrics) + testimonials where available.
- **Key pages:** Projects + detail · About · Contact · Gallery.
- **Conversion:** contact form with a project brief (project-type / budget / timeline fields).

### 5. Open-source collaborators
- **Care about:** activity, code quality, responsiveness, and shared values.
- **Need:** live repo data, contribution cadence, language breakdown, and maintainer disposition.
- **Objection (dominant):** *"Is this actually maintained and will I get a response?"* Neutralize on the **GitHub dashboard** (live cadence) + **Open Source** (curated, active highlights).
- **Key pages:** Open Source · GitHub · Blog · Philosophy.
- **Conversion:** follow on GitHub / open an issue, then contact.

### 6. Technical peers
- **Care about:** genuinely useful ideas and honest technical depth they can learn from and share.
- **Need:** substantive writing and research, technical breakdowns, and the implicit proof of the site's own engineering.
- **Objection (dominant):** *"Is this fluff or real rigor?"* Neutralize on **Blog detail** / **Research** (substance) — the site's own CWV/a11y scores corroborate.
- **Key pages:** Blog + detail · Research · Philosophy · GitHub.
- **Conversion:** subscribe via RSS, follow, and share — feeding reach (S7).

### 7. Conference / event organizers
- **Care about:** speaking credibility, topic expertise, and professionalism.
- **Need:** evidence of prior talks/recognition, clear expertise areas, a usable bio + headshot, and contact.
- **Objection (dominant):** *"Has this person spoken credibly before, and do they fit our event?"* Neutralize on **Achievements** + **Timeline** (talks/awards) with **About** for bio/headshot.
- **Key pages:** Achievements · Timeline · About · Research · Contact.
- **Conversion:** contact for a speaking opportunity.

### 8. Startup teams
- **Care about:** versatility, autonomy, culture fit, and momentum.
- **Need:** evidence of end-to-end shipping, stated values, and recent activity proving pace.
- **Objection (dominant):** *"Hybrid could mean unfocused."* Neutralize on **Projects** + **Experience** (owned, shipped outcomes) + **Philosophy** (focus/values).
- **Key pages:** Projects · Experience · Philosophy · GitHub · Landing.
- **Conversion:** contact or forward the link internally to a founder/lead.

### 9. Product teams
- **Care about:** product sense fused with execution — user-centered engineering.
- **Need:** outcome-driven case studies with metrics and visible design fluency.
- **Objection (dominant):** *"An engineer who ignores UX / ships features not products."* Neutralize on **Project detail** (outcomes + UX reasoning) + **Gallery** (craft).
- **Key pages:** Project detail · Gallery · Philosophy · About.
- **Conversion:** contact and share the case study with their team.

---

## 4. Audience-to-page priority (design implication)

When a page must serve several audiences, resolve conflicts by the priority below (highest-intent first). This tells each [page spec](./page-specifications.md) whose needs win above the fold.

| Page | Lead audience(s) | Above-the-fold priority |
|---|---|---|
| Landing `/` | 3 Founders, 8 Startups | Positioning + signature craft, one clear path to Projects/Contact |
| About `/about` | 1 Recruiters, 7 Organizers | Who/what/where + CV + headshot, then story |
| Philosophy `/philosophy` | 2 EMs, 9 Product | Principles that read as judgment, not slogans |
| Projects `/projects` | 2 EMs, 3 Founders, 4 Clients | Curated, filterable proof; clear path to detail |
| Project detail `/projects/[slug]` | 2 EMs, 4 Clients, 9 Product | Problem → approach → trade-offs → outcome + metrics |
| Research `/research` | 6 Peers, 7 Organizers | Abstract + credibility (venue/status) |
| Open Source `/open-source` | 5 Collaborators, 2 EMs | Active, curated repos + live cadence |
| Blog `/blog` (+ detail) | 6 Peers | Substance, scannability, RSS |
| Experience `/experience` | 1 Recruiters, 2 EMs | Roles, stack, impact — scannable |
| Timeline `/timeline` | 7 Organizers, 1 Recruiters | Narrative arc of roles/launches/awards/talks |
| Gallery `/gallery` | 9 Product, 4 Clients | Creative range, fast-loading |
| Certificates `/certificates` | 1 Recruiters | Verifiable credentials |
| Achievements `/achievements` | 7 Organizers, 1 Recruiters | Awards/recognition with proof links |
| GitHub Dashboard `/github` | 5 Collaborators, 2 EMs | Live, current, credible activity |
| Contact `/contact` | 1–4 (all macro) | Low-friction form + CV + alternatives |

**Cross-references:** strategy and metrics in [product-strategy](./product-strategy.md); navigation paths these audiences take in [navigation-model](./navigation-structure.md) and [user-flows](./ux-flow.md); voice that addresses each objection in [editorial-voice-tone](./brand-identity.md).

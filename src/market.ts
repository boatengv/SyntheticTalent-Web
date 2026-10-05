import { FAQS, SEED_LISTINGS, type Listing } from './market-data';

/* Brand Market: a client-side demo. Listings, saves and deals persist in
   localStorage; no payments or transfers take place. */

interface Deal {
  id: string;
  listingId: string;
  name: string;
  price: number;
  kind: 'buy' | 'offer';
  /* 0 offer sent, 1 in escrow, 2 delivered, 3 released */
  stage: number;
  disputed: boolean;
  createdAt: number;
}

const KEY = { listings: 'mk.listings', saved: 'mk.saved', deals: 'mk.deals' };
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'X'];
const STAGES = ['Offer sent', 'In escrow', 'Assets delivered', 'Released'];

const app = document.getElementById('app') as HTMLElement;
const toastEl = document.getElementById('toast') as HTMLElement;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the session still works */
  }
}

let mine: Listing[] = load<Listing[]>(KEY.listings, []);
let saved: string[] = load<string[]>(KEY.saved, []);
let deals: Deal[] = load<Deal[]>(KEY.deals, []);

const all = (): Listing[] => [...mine, ...SEED_LISTINGS];
const find = (id: string): Listing | undefined => all().find((l) => l.id === id);

/* Formatting */

function esc(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string;
  });
}

const usd = (n: number): string =>
  '$' + Math.round(n).toLocaleString('en-US');

function compact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function age(months: number): string {
  if (months < 12) return months + ' mo';
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y}y ${m}m` : `${y}y`;
}

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w.match(/[a-z0-9]/i)![0].toUpperCase())
    .join('');

const cover = (hue: number): string =>
  `background:linear-gradient(135deg,hsl(${hue} 70% 42%),hsl(${(hue + 40) % 360} 75% 28%))`;

const multiple = (l: Listing): string =>
  l.revenue > 0 ? (l.price / (l.revenue * 12)).toFixed(1) + 'x yearly revenue' : 'No revenue yet';

let toastTimer = 0;
function toast(message: string): void {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* Shared markup */

function cardHtml(l: Listing): string {
  const on = saved.includes(l.id);
  return `
    <article class="mk-card">
      <a class="mk-cover" href="#/listing/${esc(l.id)}" style="${cover(l.hue)}" aria-label="${esc(l.name)}">
        <span class="mk-mono" aria-hidden="true">${esc(initials(l.name))}</span>
        <span class="mk-tag">${esc(l.platform)} · ${esc(l.niche)}</span>
      </a>
      <div class="mk-body">
        <div class="mk-title">
          <a href="#/listing/${esc(l.id)}" style="color:inherit;text-decoration:none">${esc(l.name)}</a>
          ${l.verified ? '<span class="mk-badge">Verified</span>' : '<span class="mk-badge off">Unverified</span>'}
        </div>
        <div class="mk-handle">${esc(l.handle)}</div>
        <p class="mk-pitch">${esc(l.pitch)}</p>
        <dl class="mk-metrics">
          <div><dt>Audience</dt><dd>${compact(l.followers)}</dd></div>
          <div><dt>Engage</dt><dd>${l.engagement}%</dd></div>
          <div><dt>Revenue</dt><dd>${usd(l.revenue)}/mo</dd></div>
        </dl>
        <div class="mk-foot">
          <span class="mk-price">${usd(l.price)}</span>
          <button class="mk-save" type="button" data-save="${esc(l.id)}" aria-pressed="${on}" aria-label="${on ? 'Remove from saved' : 'Save listing'}">${on ? '★' : '☆'}</button>
        </div>
      </div>
    </article>`;
}

function hero(kicker: string, title: string, lede: string, extra = ''): string {
  return `
    <section class="page-hero mk-hero dark" aria-labelledby="mk-title">
      <div class="wrap">
        <p class="kicker">${esc(kicker)}</p>
        <h1 id="mk-title" class="headline">${esc(title)}</h1>
        <p class="lede">${esc(lede)}</p>
        ${extra}
      </div>
    </section>`;
}

/* Views */

function homeView(): string {
  const featured = all().filter((l) => l.featured).slice(0, 6);
  const total = all().reduce((sum, l) => sum + l.followers, 0);
  return `
    ${hero(
      'Brand Market',
      'Buy the brand behind the page.',
      'A marketplace for social media brands: the identity, content library, audience plan, email list and domain, protected by escrow. No account logins change hands.',
      `<div class="mk-hero-actions">
         <a class="mk-btn green" href="#/browse">Browse brands</a>
         <a class="mk-btn ghost" href="#/sell">Sell your brand</a>
       </div>
       <ul class="mk-stats">
         <li><b>${all().length}</b><span>Brands listed</span></li>
         <li><b>${compact(total)}</b><span>Combined audience</span></li>
         <li><b>4</b><span>Platforms covered</span></li>
         <li><b>0%</b><span>Buyer fees</span></li>
       </ul>`,
    )}
    <section class="mk-section">
      <div class="wrap">
        <div class="mk-head">
          <div><h2>Featured brands</h2><p>Verified listings with documented revenue and a handover plan.</p></div>
          <a class="mk-link" href="#/browse">View all brands &rarr;</a>
        </div>
        <div class="mk-grid">${featured.map(cardHtml).join('')}</div>
      </div>
    </section>
    <section class="mk-section tight">
      <div class="wrap">
        <div class="mk-head"><div><h2>How a deal works</h2></div></div>
        ${stepsHtml()}
      </div>
    </section>`;
}

function stepsHtml(): string {
  return `
    <ol class="mk-steps">
      <li><h3>Find a brand</h3><p>Filter by platform, niche, audience and price. Every listing shows what is included.</p></li>
      <li><h3>Pay into escrow</h3><p>Your payment is held by us, not sent to the seller, until you have the assets.</p></li>
      <li><h3>Receive the assets</h3><p>The seller delivers files, domain, email list and contacts, then supports the audience handover.</p></li>
      <li><h3>Confirm and release</h3><p>Inspect within the window. Confirm to release funds, or dispute to freeze them.</p></li>
    </ol>`;
}

const FILTER_DEFAULT = { q: '', platform: '', niche: '', price: '', sort: 'featured' };
let filters = { ...FILTER_DEFAULT };

function browseView(): string {
  const niches = [...new Set(all().map((l) => l.niche))].sort();
  const opt = (v: string, label: string, cur: string): string =>
    `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(label)}</option>`;
  return `
    <section class="mk-section">
      <div class="wrap">
        <div class="mk-head"><div><p class="kicker" style="color:var(--accent-ink)">Marketplace</p><h2>Browse brands</h2></div>
        <a class="mk-btn ghost" href="#/sell">List yours</a></div>
        <div class="mk-filters">
          <div class="mk-field"><label for="f-q">Search</label>
            <input class="mk-input" id="f-q" type="search" placeholder="Name, handle or niche" value="${esc(filters.q)}" /></div>
          <div class="mk-field"><label for="f-platform">Platform</label>
            <select class="mk-select" id="f-platform">${opt('', 'All platforms', filters.platform)}${PLATFORMS.map((p) => opt(p, p, filters.platform)).join('')}</select></div>
          <div class="mk-field"><label for="f-niche">Niche</label>
            <select class="mk-select" id="f-niche">${opt('', 'All niches', filters.niche)}${niches.map((n) => opt(n, n, filters.niche)).join('')}</select></div>
          <div class="mk-field"><label for="f-price">Price</label>
            <select class="mk-select" id="f-price">
              ${opt('', 'Any price', filters.price)}${opt('0-15000', 'Under $15K', filters.price)}${opt('15000-50000', '$15K – $50K', filters.price)}${opt('50000-', '$50K+', filters.price)}
            </select></div>
          <div class="mk-field"><label for="f-sort">Sort</label>
            <select class="mk-select" id="f-sort">
              ${opt('featured', 'Featured', filters.sort)}${opt('price-asc', 'Price: low to high', filters.sort)}${opt('price-desc', 'Price: high to low', filters.sort)}${opt('followers', 'Largest audience', filters.sort)}${opt('revenue', 'Highest revenue', filters.sort)}
            </select></div>
        </div>
        <div class="mk-result-bar"><span id="resultCount"></span><button class="mk-link" type="button" id="resetFilters" style="background:none;border:0;cursor:pointer">Reset filters</button></div>
        <div class="mk-grid" id="browseGrid"></div>
      </div>
    </section>`;
}

function applyFilters(): void {
  const grid = document.getElementById('browseGrid');
  const count = document.getElementById('resultCount');
  if (!grid || !count) return;
  const q = filters.q.trim().toLowerCase();
  const [min, max] = filters.price ? filters.price.split('-') : ['', ''];
  let rows = all().filter((l) => {
    if (q && !`${l.name} ${l.handle} ${l.niche} ${l.platform}`.toLowerCase().includes(q)) return false;
    if (filters.platform && l.platform !== filters.platform) return false;
    if (filters.niche && l.niche !== filters.niche) return false;
    if (min && l.price < Number(min)) return false;
    if (max && l.price >= Number(max)) return false;
    return true;
  });
  const sorts: Record<string, (a: Listing, b: Listing) => number> = {
    featured: (a, b) => Number(b.featured) - Number(a.featured),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    followers: (a, b) => b.followers - a.followers,
    revenue: (a, b) => b.revenue - a.revenue,
  };
  rows = rows.sort(sorts[filters.sort] ?? sorts.featured!);
  count.textContent = `${rows.length} brand${rows.length === 1 ? '' : 's'}`;
  grid.innerHTML = rows.length
    ? rows.map(cardHtml).join('')
    : '<div class="mk-empty" style="grid-column:1/-1">No brands match those filters. Try widening them.</div>';
}

function listingView(id: string): string {
  const l = find(id);
  if (!l) {
    return `<section class="mk-section"><div class="wrap"><div class="mk-empty">That listing could not be found. <a class="mk-link" href="#/browse">Back to browse</a></div></div></section>`;
  }
  const on = saved.includes(l.id);
  return `
    <div class="wrap">
      <div class="mk-crumb"><a class="mk-link" href="#/browse">&larr; All brands</a></div>
      <div class="mk-detail">
        <div>
          <div class="mk-cover mk-detail-cover" style="${cover(l.hue)}">
            <span class="mk-mono" aria-hidden="true">${esc(initials(l.name))}</span>
            <span class="mk-tag">${esc(l.platform)} · ${esc(l.niche)}</span>
          </div>
          <h1>${esc(l.name)}</h1>
          <div class="mk-chips">
            <span class="mk-chip">${esc(l.handle)}</span>
            ${l.verified ? '<span class="mk-badge">Verified listing</span>' : '<span class="mk-badge off">Unverified: check claims carefully</span>'}
            ${l.mine ? '<span class="mk-badge off">Your listing</span>' : ''}
          </div>
          <dl class="mk-bigstats">
            <div><dt>Audience</dt><dd>${compact(l.followers)}</dd></div>
            <div><dt>Engagement</dt><dd>${l.engagement}%</dd></div>
            <div><dt>Revenue</dt><dd>${usd(l.revenue)}/mo</dd></div>
            <div><dt>Brand age</dt><dd>${esc(age(l.ageMonths))}</dd></div>
          </dl>
          <h3>About this brand</h3>
          <p style="color:var(--muted);margin:0">${esc(l.description)}</p>
          <h3>What's included</h3>
          <ul class="mk-list">${l.includes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <h3>Audience</h3>
          <div class="mk-aud">
            <div><b>Gender</b>${esc(l.audience.gender)}</div>
            <div><b>Top countries</b>${esc(l.audience.top)}</div>
            <div><b>Main age group</b>${esc(l.audience.age)}</div>
          </div>
          <h3>Revenue sources</h3>
          <div class="mk-chips">${l.revenueSources.map((r) => `<span class="mk-chip">${esc(r)}</span>`).join('')}</div>
          <h3>Handover</h3>
          <p style="color:var(--muted);margin:0">The brand is transferred as assets and a documented migration plan. Account logins are not sold or transferred. Where the platform allows it, admin access moves through the platform's own tools; otherwise the audience is migrated to the buyer's new page.</p>
        </div>
        <aside class="mk-buy" aria-label="Purchase">
          <div class="mk-price">${usd(l.price)}</div>
          <small>${esc(multiple(l))}</small>
          <div class="mk-buy-actions">
            <button class="mk-btn green block" type="button" data-buy="${esc(l.id)}">Buy with escrow</button>
            <button class="mk-btn block" type="button" data-offer="${esc(l.id)}">Make an offer</button>
            <button class="mk-btn ghost block" type="button" data-save="${esc(l.id)}" aria-pressed="${on}">${on ? '★ Saved' : '☆ Save for later'}</button>
          </div>
          <ul class="mk-assure">
            <li>Funds held in escrow until you confirm</li>
            <li>No buyer fees</li>
            <li>Dispute window after delivery</li>
          </ul>
        </aside>
      </div>
    </div>`;
}

function sellView(): string {
  return `
    ${hero('Sell a brand', 'List the brand you built.', 'Free to list. We only charge when you sell: 8% of the price, 6% above $50,000, taken from escrow.')}
    <section class="mk-section">
      <div class="wrap">
        <form class="mk-form" id="sellForm" novalidate>
          <div class="mk-field"><label for="s-name">Brand name</label><input class="mk-input" id="s-name" required maxlength="60" /><span class="mk-error" data-err="name"></span></div>
          <div class="mk-field"><label for="s-handle">Handle</label><input class="mk-input" id="s-handle" placeholder="@yourbrand" required maxlength="40" /><span class="mk-error" data-err="handle"></span></div>
          <div class="mk-field"><label for="s-platform">Main platform</label><select class="mk-select" id="s-platform">${PLATFORMS.map((p) => `<option>${p}</option>`).join('')}</select></div>
          <div class="mk-field"><label for="s-niche">Niche</label><input class="mk-input" id="s-niche" placeholder="Fitness, Finance, Travel…" required maxlength="30" /><span class="mk-error" data-err="niche"></span></div>
          <div class="mk-field"><label for="s-followers">Audience size</label><input class="mk-input" id="s-followers" type="number" min="0" required /><span class="mk-error" data-err="followers"></span></div>
          <div class="mk-field"><label for="s-engagement">Engagement rate (%)</label><input class="mk-input" id="s-engagement" type="number" min="0" max="100" step="0.1" required /><span class="mk-error" data-err="engagement"></span></div>
          <div class="mk-field"><label for="s-revenue">Monthly revenue (USD)</label><input class="mk-input" id="s-revenue" type="number" min="0" required /><span class="mk-error" data-err="revenue"></span></div>
          <div class="mk-field"><label for="s-age">Brand age (months)</label><input class="mk-input" id="s-age" type="number" min="0" required /><span class="mk-error" data-err="age"></span></div>
          <div class="mk-field"><label for="s-price">Asking price (USD)</label><input class="mk-input" id="s-price" type="number" min="1" required /><span class="mk-error" data-err="price"></span></div>
          <div class="mk-field"><label for="s-pitch">One-line pitch</label><input class="mk-input" id="s-pitch" required maxlength="140" /><span class="mk-error" data-err="pitch"></span></div>
          <div class="mk-field full"><label for="s-desc">Description</label><textarea class="mk-textarea" id="s-desc" required maxlength="900"></textarea><span class="mk-error" data-err="desc"></span></div>
          <div class="mk-field full"><label for="s-includes">What's included (one item per line)</label><textarea class="mk-textarea" id="s-includes" placeholder="Brand name and logo&#10;600 videos (raw files)&#10;Email list: 4,000"></textarea></div>
          <label class="mk-check full"><input type="checkbox" id="s-confirm" /> <span>I own this brand and its content, the audience numbers are real and not bought, and I will not transfer account logins.</span></label>
          <span class="mk-error full" data-err="confirm"></span>
          <div class="full"><button class="mk-btn green" type="submit">Publish listing</button></div>
        </form>
      </div>
    </section>`;
}

function howView(): string {
  return `
    ${hero('How it works', 'Four steps, one safe handover.', 'Every deal runs through escrow so neither side has to trust the other first.')}
    <section class="mk-section"><div class="wrap">${stepsHtml()}</div></section>
    <section class="mk-section tight"><div class="wrap"><div class="mk-two">
      <div class="mk-panel"><h3>For buyers</h3><p>Browse and compare brands, ask for proof of revenue and analytics, then buy through escrow or make an offer.</p><p>You pay nothing extra. If delivery does not match the listing, dispute it and your funds stay frozen.</p><a class="mk-btn" href="#/browse">Browse brands</a></div>
      <div class="mk-panel"><h3>For sellers</h3><p>List for free, get verified to build trust, and deliver the assets listed. Support the audience handover for the period you promised.</p><p>We take 8% of the sale (6% above $50,000) once the buyer confirms.</p><a class="mk-btn" href="#/sell">Sell a brand</a></div>
    </div></div></section>`;
}

function trustView(): string {
  return `
    ${hero('Trust & safety', 'Built to keep both sides protected.', 'What we verify, what we block, and why we sell brands instead of accounts.')}
    <section class="mk-section"><div class="wrap"><div class="mk-two">
      <div class="mk-panel"><h3>Why brands, not accounts</h3><p>Selling an account login breaks the terms of Instagram, TikTok, YouTube and X, and the account can be disabled after the sale. A brand sale moves the things that hold the value: identity, content, audience plan, email list, domain and relationships.</p></div>
      <div class="mk-panel"><h3>Escrow</h3><p>The buyer's payment is held until the assets are delivered and confirmed. Sellers are paid on release, so they know the money is real.</p></div>
      <div class="mk-panel"><h3>Verification</h3><p>Verified listings have proof of control, analytics that match the claimed numbers, payout statements for revenue, and original content.</p></div>
      <div class="mk-panel dark dark"><h3>Not allowed</h3><p>Hacked or stolen pages, impersonation, trademark infringement, bought followers or engagement presented as real, and unlawful transfer of personal data. Listings that break these rules are removed and the seller is banned.</p></div>
    </div></div></section>`;
}

function faqView(): string {
  return `
    ${hero('FAQ', 'Questions, answered.', 'The short version of how buying and selling works here.')}
    <section class="mk-section"><div class="wrap mk-faq">
      ${FAQS.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
    </div></section>`;
}

function dealsView(): string {
  const savedRows = all().filter((l) => saved.includes(l.id));
  const dealRows = [...deals].sort((a, b) => b.createdAt - a.createdAt);
  const dealHtml = dealRows
    .map((d) => {
      const track = STAGES.map(
        (s, i) => `<li class="${i <= d.stage ? 'done' : ''}">${esc(s)}</li>`,
      ).join('');
      let action = '';
      if (d.disputed) action = '<span class="mk-badge off">Disputed: funds frozen</span>';
      else if (d.stage === 0) action = `<button class="mk-btn ghost" data-advance="${esc(d.id)}">Demo: seller accepts</button>`;
      else if (d.stage === 1) action = `<button class="mk-btn ghost" data-advance="${esc(d.id)}">Demo: seller delivers</button><button class="mk-btn ghost" data-dispute="${esc(d.id)}">Open dispute</button>`;
      else if (d.stage === 2) action = `<button class="mk-btn green" data-advance="${esc(d.id)}">Confirm &amp; release funds</button><button class="mk-btn ghost" data-dispute="${esc(d.id)}">Open dispute</button>`;
      else action = '<span class="mk-badge">Complete</span>';
      return `
        <div class="mk-deal">
          <div>
            <h3><a href="#/listing/${esc(d.listingId)}" style="color:inherit;text-decoration:none">${esc(d.name)}</a></h3>
            <p>${d.kind === 'offer' ? 'Offer' : 'Purchase'} · ${usd(d.price)} · ${new Date(d.createdAt).toLocaleDateString()}</p>
            <ol class="mk-track">${track}</ol>
          </div>
          <div class="mk-deal-actions">${action}</div>
        </div>`;
    })
    .join('');
  const mineRows = mine.map(cardHtml).join('');
  return `
    <section class="mk-section">
      <div class="wrap">
        <div class="mk-head"><div><p class="kicker" style="color:var(--accent-ink)">Dashboard</p><h2>My deals</h2><p>Deals, saved brands and your listings. Stored in this browser only.</p></div>
        <button class="mk-btn ghost" type="button" id="resetDemo">Reset demo data</button></div>
        ${dealHtml || '<div class="mk-empty">No deals yet. <a class="mk-link" href="#/browse">Browse brands</a> to start one.</div>'}
        <div class="mk-head" style="margin-top:56px"><div><h2>Saved</h2></div></div>
        ${savedRows.length ? `<div class="mk-grid">${savedRows.map(cardHtml).join('')}</div>` : '<div class="mk-empty">Nothing saved yet. Tap the star on any brand.</div>'}
        <div class="mk-head" style="margin-top:56px"><div><h2>Your listings</h2></div><a class="mk-btn ghost" href="#/sell">New listing</a></div>
        ${mineRows ? `<div class="mk-grid">${mineRows}</div>` : '<div class="mk-empty">You have not listed a brand yet.</div>'}
      </div>
    </section>`;
}

/* Modal */

function openModal(html: string, onMount: (root: HTMLElement) => void): void {
  closeModal();
  const m = document.createElement('div');
  m.className = 'mk-modal';
  m.id = 'modal';
  m.innerHTML = `<div class="mk-dialog" role="dialog" aria-modal="true">${html}</div>`;
  m.addEventListener('click', (e) => {
    if (e.target === m) closeModal();
  });
  document.body.appendChild(m);
  onMount(m);
  (m.querySelector('input,button') as HTMLElement | null)?.focus();
}

function closeModal(): void {
  document.getElementById('modal')?.remove();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function addDeal(l: Listing, price: number, kind: Deal['kind']): void {
  deals.push({
    id: 'd' + Date.now().toString(36),
    listingId: l.id,
    name: l.name,
    price,
    kind,
    stage: kind === 'buy' ? 1 : 0,
    disputed: false,
    createdAt: Date.now(),
  });
  save(KEY.deals, deals);
  updateDealCount();
}

function buyModal(l: Listing): void {
  const fee = 0;
  openModal(
    `<h3>Buy ${esc(l.name)}</h3>
     <p>Your payment is held in escrow and only released to the seller after you confirm delivery.</p>
     <div class="mk-summary">
       <div><span>Brand</span><span>${usd(l.price)}</span></div>
       <div><span>Buyer fee</span><span>${usd(fee)}</span></div>
       <div class="total"><span>Total into escrow</span><span>${usd(l.price + fee)}</span></div>
     </div>
     <p>Demo build: no real payment is taken.</p>
     <div class="mk-dialog-actions">
       <button class="mk-btn ghost" type="button" data-close>Cancel</button>
       <button class="mk-btn green" type="button" id="confirmBuy">Pay into escrow</button>
     </div>`,
    (root) => {
      root.querySelector('[data-close]')?.addEventListener('click', closeModal);
      root.querySelector('#confirmBuy')?.addEventListener('click', () => {
        addDeal(l, l.price, 'buy');
        closeModal();
        toast('Payment held in escrow');
        location.hash = '#/deals';
      });
    },
  );
}

function offerModal(l: Listing): void {
  openModal(
    `<h3>Make an offer</h3>
     <p>Asking price ${usd(l.price)}. The seller can accept, counter or decline.</p>
     <div class="mk-field"><label for="offerAmt">Your offer (USD)</label>
       <input class="mk-input" id="offerAmt" type="number" min="1" value="${Math.round(l.price * 0.9)}" /></div>
     <span class="mk-error" id="offerErr"></span>
     <div class="mk-dialog-actions">
       <button class="mk-btn ghost" type="button" data-close>Cancel</button>
       <button class="mk-btn" type="button" id="sendOffer">Send offer</button>
     </div>`,
    (root) => {
      root.querySelector('[data-close]')?.addEventListener('click', closeModal);
      root.querySelector('#sendOffer')?.addEventListener('click', () => {
        const amt = Number((root.querySelector('#offerAmt') as HTMLInputElement).value);
        const err = root.querySelector('#offerErr') as HTMLElement;
        if (!amt || amt < 1) {
          err.textContent = 'Enter an amount.';
          return;
        }
        if (amt > l.price) {
          err.textContent = 'An offer above the asking price is just a purchase. Use Buy with escrow.';
          return;
        }
        addDeal(l, amt, 'offer');
        closeModal();
        toast('Offer sent to the seller');
        location.hash = '#/deals';
      });
    },
  );
}

/* Sell form */

function submitSell(form: HTMLFormElement): void {
  const v = (id: string): string => (form.querySelector('#' + id) as HTMLInputElement).value.trim();
  const errors: Record<string, string> = {};
  const name = v('s-name');
  const handle = v('s-handle');
  const niche = v('s-niche');
  const pitch = v('s-pitch');
  const desc = v('s-desc');
  const followers = Number(v('s-followers'));
  const engagement = Number(v('s-engagement'));
  const revenue = Number(v('s-revenue'));
  const ageMonths = Number(v('s-age'));
  const price = Number(v('s-price'));
  if (!name) errors.name = 'Required.';
  if (!handle) errors.handle = 'Required.';
  if (!niche) errors.niche = 'Required.';
  if (!pitch) errors.pitch = 'Required.';
  if (desc.length < 20) errors.desc = 'Tell buyers a little more (20+ characters).';
  if (!(followers >= 0) || v('s-followers') === '') errors.followers = 'Enter a number.';
  if (v('s-engagement') === '' || engagement < 0 || engagement > 100) errors.engagement = 'Enter 0 to 100.';
  if (v('s-revenue') === '' || revenue < 0) errors.revenue = 'Enter a number.';
  if (v('s-age') === '' || ageMonths < 0) errors.age = 'Enter a number.';
  if (!(price > 0)) errors.price = 'Enter a price.';
  if (!(form.querySelector('#s-confirm') as HTMLInputElement).checked) errors.confirm = 'Please confirm to continue.';

  form.querySelectorAll<HTMLElement>('[data-err]').forEach((el) => {
    el.textContent = errors[el.dataset.err!] ?? '';
  });
  if (Object.keys(errors).length) {
    form.querySelector<HTMLElement>('[data-err]:not(:empty)')?.scrollIntoView({ block: 'center' });
    return;
  }

  const includes = v('s-includes')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const listing: Listing = {
    id: 'u' + Date.now().toString(36),
    name,
    handle: handle.startsWith('@') ? handle : '@' + handle,
    platform: v('s-platform'),
    niche,
    followers,
    engagement,
    revenue,
    ageMonths,
    price,
    hue: Math.floor(Math.random() * 360),
    pitch,
    description: desc,
    includes: includes.length ? includes : ['Brand name and identity', 'Content library'],
    audience: { gender: 'Not provided', top: 'Not provided', age: 'Not provided' },
    revenueSources: revenue > 0 ? ['Self-reported'] : ['None yet'],
    verified: false,
    featured: false,
    views: 0,
    mine: true,
  };
  mine.unshift(listing);
  save(KEY.listings, mine);
  toast('Listing published');
  location.hash = '#/listing/' + listing.id;
}

/* Actions */

function toggleSave(id: string): void {
  saved = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  save(KEY.saved, saved);
  render(true);
}

function updateDealCount(): void {
  const el = document.getElementById('dealCount');
  if (!el) return;
  el.textContent = String(deals.length);
  el.hidden = deals.length === 0;
}

/* Router */

function render(keepScroll = false): void {
  const hash = location.hash.replace(/^#\/?/, '');
  const [route = '', param = ''] = hash.split('/');
  const y = window.scrollY;
  const views: Record<string, () => string> = {
    '': homeView,
    browse: browseView,
    listing: () => listingView(param),
    sell: sellView,
    how: howView,
    trust: trustView,
    faq: faqView,
    deals: dealsView,
  };
  app.innerHTML = (views[route] ?? homeView)();
  document.title =
    (route === 'listing' ? find(param)?.name + ' · ' : '') + 'Brand Market · Synthetic Talent';
  document.querySelectorAll<HTMLAnchorElement>('#mkNav a[data-route]').forEach((a) => {
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (route === 'browse') applyFilters();
  if (keepScroll) window.scrollTo(0, y);
  else window.scrollTo(0, 0);
}

app.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const btn = t.closest<HTMLElement>('[data-save],[data-buy],[data-offer],[data-advance],[data-dispute],#resetFilters,#resetDemo');
  if (!btn) return;
  if (btn.dataset.save) {
    e.preventDefault();
    toggleSave(btn.dataset.save);
  } else if (btn.dataset.buy) {
    const l = find(btn.dataset.buy);
    if (l) buyModal(l);
  } else if (btn.dataset.offer) {
    const l = find(btn.dataset.offer);
    if (l) offerModal(l);
  } else if (btn.dataset.advance) {
    const d = deals.find((x) => x.id === btn.dataset.advance);
    if (d && d.stage < 3) {
      d.stage += 1;
      save(KEY.deals, deals);
      toast(d.stage === 3 ? 'Funds released to the seller' : STAGES[d.stage]!);
      render(true);
    }
  } else if (btn.dataset.dispute) {
    const d = deals.find((x) => x.id === btn.dataset.dispute);
    if (d) {
      d.disputed = true;
      save(KEY.deals, deals);
      toast('Dispute opened: funds frozen');
      render(true);
    }
  } else if (btn.id === 'resetFilters') {
    filters = { ...FILTER_DEFAULT };
    render(true);
  } else if (btn.id === 'resetDemo') {
    mine = [];
    saved = [];
    deals = [];
    [KEY.listings, KEY.saved, KEY.deals].forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
    updateDealCount();
    toast('Demo data cleared');
    render(true);
  }
});

app.addEventListener('input', (e) => {
  const t = e.target as HTMLInputElement;
  const map: Record<string, keyof typeof filters> = {
    'f-q': 'q',
    'f-platform': 'platform',
    'f-niche': 'niche',
    'f-price': 'price',
    'f-sort': 'sort',
  };
  const key = map[t.id];
  if (!key) return;
  filters[key] = t.value;
  applyFilters();
});

app.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;
  if (form.id === 'sellForm') {
    e.preventDefault();
    submitSell(form);
  }
});

window.addEventListener('hashchange', () => render());
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
updateDealCount();
render();

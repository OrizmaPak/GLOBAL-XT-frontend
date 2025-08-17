// js/product.js
// Product page renderer for: globalxt/product.html?itemid=XXXX
// - Uses baseurl from js/index.js
// - Fetches one product by itemid
// - Renders gallery with magnifier button -> full-screen modal carousel (+ zoom)
// - Sidebar: title + rating + meta + 600-char truncated overview
// - Tabbed section: Description, Product Description, Trade Process (full content)
// - Similar items by department
// - Safe: will create #gxt-product-container if missing

(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    if (typeof baseurl === 'undefined') {
      console.error('baseurl is not defined. Ensure js/index.js loads before js/product.js');
    }
  
    // ---------------- URL param ----------------
    const params = new URLSearchParams(window.location.search);
    const itemid = params.get('itemid');
  
    // ---------------- Mount ----------------
    let mount = $('#gxt-product-container');
    if (!mount) {
      mount = document.createElement('section');
      mount.id = 'gxt-product-container';
      const main = document.querySelector('main, .site-main, .content-area') || document.body;
      main.insertBefore(mount, main.firstChild);
    }
  
    // ---------------- Styles (scoped) ----------------
    function injectStyles() {
      if ($('#gxt-product-css')) return;
      const style = document.createElement('style');
      style.id = 'gxt-product-css';
      style.textContent = `
        #gxt-product-container { max-width:1140px; margin:28px auto; padding:0 16px; }
  
        /* Skeleton */
        @keyframes gxt-shimmer {0%{background-position:-200% 0;}100%{background-position:200% 0;}}
        #gxt-product-container .gxt-skel { background:linear-gradient(90deg,#eee,#f7f7f7,#eee); background-size:200% 100%; animation:gxt-shimmer 1.2s infinite; }
        #gxt-product-container .gxt-skel-img { width:100%; aspect-ratio:1/1; border-radius:10px; }
        #gxt-product-container .gxt-skel-line { height:16px; border-radius:6px; margin:10px 0; }
        #gxt-product-container .gxt-skel-line.short{width:60%} .gxt-skel-line.med{width:80%} .gxt-skel-line.full{width:100%}
  
        /* Layout */
        #gxt-product { display:grid; grid-template-columns:1.1fr .9fr; gap:28px; }
        @media (max-width: 980px){ #gxt-product { grid-template-columns:1fr; } }
  
        /* Gallery */
        #gxt-product .gxt-gallery { position:relative; display:flex; flex-direction:column; gap:12px; }
        #gxt-product .gxt-main-img { position:relative; width:100%; aspect-ratio:1/1; border-radius:12px; overflow:hidden; background:#f3f4f6; }
        #gxt-product .gxt-main-img img { width:100%; height:100%; object-fit:cover; display:block; }
        #gxt-product .gxt-zoom-btn {
          position:absolute; top:10px; right:10px; width:42px; height:42px; border-radius:9999px; border:1px solid #e5e7eb;
          background:#fff; display:grid; place-items:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.08);
        }
        #gxt-product .gxt-zoom-btn svg { width:20px; height:20px; }
        #gxt-product .gxt-thumbs { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
        #gxt-product .gxt-thumbs button { border:1px solid #e5e7eb; border-radius:10px; background:#fff; padding:0; overflow:hidden; cursor:pointer; }
        #gxt-product .gxt-thumbs img { width:100%; height:100%; aspect-ratio:1/1; object-fit:cover; display:block; }
  
        /* Details */
        #gxt-product .gxt-title { margin:0 0 6px; font-size:clamp(22px,2.6vw,32px); line-height:1.2; }
        #gxt-product .gxt-rating { display:flex; align-items:center; gap:6px; margin:6px 0 12px; }
        #gxt-product .gxt-rating .stars { display:inline-flex; gap:2px; }
        #gxt-product .gxt-rating svg { width:16px; height:16px; }
        #gxt-product .gxt-meta { color:#6b7280; font-size:14px; margin: 2px 0 14px; }
        #gxt-product .gxt-badges { display:flex; gap:8px; flex-wrap:wrap; margin: 8px 0 16px; }
        #gxt-product .gxt-badge { display:inline-flex; align-items:center; gap:6px; border:1px solid #e5e7eb; border-radius:9999px; padding:6px 12px; font-size:13px; background:#fff; }
        #gxt-product .gxt-overview { color:#374151; line-height:1.65; }
        #gxt-product .gxt-readmore { color:#1f2937; font-weight:600; text-decoration:underline; cursor:pointer; margin-left:6px; }
  
        /* Tabs */
        #gxt-tabs { margin-top:24px; }
        #gxt-tabs .tab-head { display:flex; gap:8px; flex-wrap:wrap; border-bottom:1px solid #e5e7eb; }
        #gxt-tabs .tab-btn { padding:10px 14px; border:none; background:#fff; cursor:pointer; font-weight:600; border-radius:8px 8px 0 0; }
        #gxt-tabs .tab-btn.active { color:#111827; background:#f9fafb; border:1px solid #e5e7eb; border-bottom-color:#f9fafb; }
        #gxt-tabs .tab-panels { border:1px solid #e5e7eb; border-top:none; padding:16px; border-radius:0 8px 8px 8px; background:#fff; }
        #gxt-tabs .tab-panel { display:none; color:#374151; line-height:1.7; }
        #gxt-tabs .tab-panel.active { display:block; }
        #gxt-tabs .note { color:#6b7280; font-size:13px; }
  
        /* Similar items */
        #gxt-product-container .gxt-similar { margin-top: 36px; }
        #gxt-product-container .gxt-similar h3 { font-size:20px; margin:0 0 12px; }
        #gxt-product-container .gxt-similar-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        @media (max-width:980px){ #gxt-product-container .gxt-similar-grid { grid-template-columns:repeat(2,1fr); } }
  
        /* Card hover (match shop.js) */
        #gxt-product-container .thumb.image-swap{ position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:#f3f4f6; }
        #gxt-product-container .thumb.image-swap a{ position:absolute; inset:0; display:block; }
        #gxt-product-container .thumb.image-swap img{ width:100%; height:100%; object-fit:cover; display:block; transition:opacity .25s ease; }
        #gxt-product-container .thumb.image-swap a + a img{ opacity:0; }
        #gxt-product-container .tm-woo-product-item:hover .thumb.image-swap a + a img{ opacity:1; }
        #gxt-product-container .tm-woo-product-item:hover .thumb.image-swap a:first-child img{ opacity:0; }
  
        /* Modal Gallery */
        #gxt-modal { position:fixed; inset:0; display:none; z-index:9999; background:rgba(0,0,0,.86); }
        #gxt-modal.open { display:block; }
        #gxt-modal .inner { position:absolute; inset:0; display:flex; flex-direction:column; }
        #gxt-modal .topbar { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; color:#fff; }
        #gxt-modal .actions { display:flex; gap:8px; }
        #gxt-modal .icon-btn { width:40px; height:40px; display:grid; place-items:center; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18); color:#fff; border-radius:9999px; cursor:pointer; }
        #gxt-modal .stage { flex:1; display:flex; align-items:center; justify-content:center; padding:10px; }
        #gxt-modal .imgwrap { max-width:92vw; max-height:80vh; overflow:hidden; }
        #gxt-modal img { width:100%; height:100%; object-fit:contain; transition:transform .2s ease; cursor:zoom-in; }
        #gxt-modal img.zoomed { transform:scale(1.8); cursor:zoom-out; }
        #gxt-modal .nav-left, #gxt-modal .nav-right {
          position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px;
          display:grid; place-items:center; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.18);
          border-radius:9999px; color:#fff; cursor:pointer;
        }
        #gxt-modal .nav-left { left:14px; }  #gxt-modal .nav-right { right:14px; }
  
        /* Alerts */
        #gxt-product-container .gxt-alert {
          max-width:680px; margin:32px auto; padding:16px; border:1px solid #fee2e2; background:#fef2f2; border-radius:8px; color:#991b1b;
        }
      `;
      document.head.appendChild(style);
    }
  
    // ---------------- Utils ----------------
    const PLACEHOLDER = 'https://dummyimage.com/900x900/e5e7eb/111827.jpg&text=Global+XT';
  
    function escapeText(s) {
      return String(s ?? '').replace(/[&<>"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
    }
  
    function sanitizeHtml(html) {
      const tpl = document.createElement('template');
      tpl.innerHTML = html || '';
      const disallowed = ['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','LINK','META','NOSCRIPT'];
      tpl.content.querySelectorAll(disallowed.join(',')).forEach(n => n.remove());
      tpl.content.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(a => {
          if (/^on/i.test(a.name) || a.name === 'srcdoc') el.removeAttribute(a.name);
        });
      });
      return tpl.innerHTML;
    }
  
    function htmlToText(html) {
      const div = document.createElement('div');
      div.innerHTML = html || '';
      return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
    }
  
    function getImages(row) {
      const order = ['imageone','imagetwo','imagethree','imagefour','imagefive','imagesix','imageseven','imageeight','imagenine','imageten'];
      const imgs = order.map(k => row?.[k]).filter(Boolean);
      return imgs.length ? imgs : [PLACEHOLDER];
    }
  
    async function fetchJSON(url) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }
  
    // ---------------- Skeleton ----------------
    function renderSkeleton() {
      mount.innerHTML = `
        <div id="gxt-product">
          <div class="gxt-gallery">
            <div class="gxt-main-img">
              <div class="gxt-skel gxt-skel-img"></div>
            </div>
            <div class="gxt-thumbs">
              ${Array.from({length:5}).map(()=>`<div class="gxt-skel gxt-skel-img"></div>`).join('')}
            </div>
          </div>
          <div>
            <div class="gxt-skel gxt-skel-line full"></div>
            <div class="gxt-skel gxt-skel-line med"></div>
            <div class="gxt-skel gxt-skel-line short"></div>
            <div class="gxt-skel gxt-skel-line full"></div>
            <div class="gxt-skel gxt-skel-line full"></div>
            <div class="gxt-skel gxt-skel-line full"></div>
          </div>
        </div>
  
        <div id="gxt-tabs" style="margin-top:24px;">
          <div class="gxt-skel gxt-skel-line med"></div>
          <div class="gxt-skel gxt-skel-line full"></div>
          <div class="gxt-skel gxt-skel-line full"></div>
        </div>
  
        <div class="gxt-similar">
          <div class="gxt-skel gxt-skel-line med"></div>
          <div class="gxt-similar-grid">
            ${Array.from({length:4}).map(()=>`
              <div class="tm-woo-product-item shop-catalog-layout-default product type-product">
                <div class="tm-woo-product-item-inner">
                  <div class="product-header-wrapper">
                    <div class="thumb image-swap">
                      <div class="gxt-skel gxt-skel-img"></div>
                    </div>
                  </div>
                  <div class="product-details" style="padding:10px 12px;">
                    <div class="gxt-skel gxt-skel-line full"></div>
                    <div class="gxt-skel gxt-skel-line short"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  
    // ---------------- Modal Gallery ----------------
    let modalState = { open:false, images:[], index:0 };
  
    function openModal(images, startIndex = 0) {
      modalState = { open:true, images, index:startIndex };
      let modal = $('#gxt-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'gxt-modal';
        modal.innerHTML = `
          <div class="inner">
            <div class="topbar">
              <div class="info" id="gxt-modal-info"></div>
              <div class="actions">
                <button class="icon-btn" id="gxt-zoom-toggle" title="Zoom in/out" aria-label="Zoom"><svg viewBox="0 0 24 24" fill="none"><path d="M10 2v6M7 5h6M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2"/></svg></button>
                <button class="icon-btn" id="gxt-modal-close" title="Close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
              </div>
            </div>
            <div class="stage">
              <div class="imgwrap"><img id="gxt-modal-img" alt="Preview"></div>
            </div>
            <button class="nav-left" id="gxt-modal-prev" title="Previous" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button class="nav-right" id="gxt-modal-next" title="Next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        `;
        document.body.appendChild(modal);
  
        // Events
        $('#gxt-modal-close').addEventListener('click', closeModal);
        $('#gxt-modal-prev').addEventListener('click', () => modalNav(-1));
        $('#gxt-modal-next').addEventListener('click', () => modalNav(1));
        $('#gxt-zoom-toggle').addEventListener('click', toggleZoom);
        modal.addEventListener('click', (e)=>{ if (e.target.id === 'gxt-modal') closeModal(); });
        document.addEventListener('keydown', modalKeyHandler);
        $('#gxt-modal-img').addEventListener('click', toggleZoom);
      }
      modal.classList.add('open');
      updateModal();
    }
  
    function updateModal() {
      const img = $('#gxt-modal-img');
      const info = $('#gxt-modal-info');
      const src = modalState.images[modalState.index];
      img.classList.remove('zoomed');
      img.src = src;
      info.textContent = `${modalState.index + 1} / ${modalState.images.length}`;
    }
  
    function modalNav(dir) {
      if (!modalState.open) return;
      modalState.index = (modalState.index + dir + modalState.images.length) % modalState.images.length;
      updateModal();
    }
  
    function toggleZoom() {
      const img = $('#gxt-modal-img');
      img.classList.toggle('zoomed');
    }
  
    function closeModal() {
      modalState.open = false;
      const modal = $('#gxt-modal');
      if (modal) modal.classList.remove('open');
    }
  
    function modalKeyHandler(e) {
      if (!modalState.open) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') modalNav(1);
      if (e.key === 'ArrowLeft') modalNav(-1);
    }
  
    // ---------------- Renderers ----------------
    function starsSVG(count = 5) {
      // simple filled stars UI (decorative)
      const star = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.178L12 18.896l-7.34 3.283 1.403-8.178L.125 9.211l8.207-1.193L12 .587z"/></svg>`;
      return Array.from({length:count}).map(()=>star).join('');
    }
  
    function renderProduct(row) {
      const images = getImages(row);
      const title = row.itemname || 'Product';
      const sku = row.itemid ?? row.id ?? '';
      const deptId = row.department ?? '';
      const deptName = row.departmentname || String(deptId || '');
      const branch = row.branchname || '';
  
      const descRaw  = row.description || '';               // HTML (full)
      const pdescRaw = row.productdescription || '';        // HTML (full)
      const tprocRaw = row.tradeprocess || '';              // HTML (full)
  
      const overviewText = htmlToText(descRaw || pdescRaw || tprocRaw || '');
      const truncated = overviewText.length > 600 ? overviewText.slice(0, 600).trim() + '…' : overviewText;

      document.querySelectorAll('[name="productnameitme"]').forEach(titleElement => {
        titleElement.textContent = title;
      });
  
      // Main layout
      mount.innerHTML = `
        <div id="gxt-product">
          <!-- Gallery -->
          <div class="gxt-gallery">
            <div class="gxt-main-img">
              <img alt="${escapeText(title)}" src="${images[0]}">
              <button class="gxt-zoom-btn" type="button" title="Open gallery" aria-label="Open gallery">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <div class="gxt-thumbs">
              ${images.slice(0,10).map((src,i)=>`
                <button type="button" data-index="${i}">
                  <img alt="${escapeText(title)} - ${i+1}" src="${src}">
                </button>
              `).join('')}
            </div>
          </div>
  
          <!-- Details -->
          <div class="gxt-details">
            <h1 class="gxt-title">${escapeText(title)}</h1>
  
            <div class="gxt-rating" aria-label="Rating">
              <div class="stars" aria-hidden="true">${starsSVG(5)}</div>
              <span style="font-size:13px;color:#6b7280;">5.0</span>
            </div>
  
            <div class="gxt-meta">
              <span>SKU: ${escapeText(String(sku))}</span>
              ${deptName ? ` &middot; <span>Category: ${escapeText(deptName)}</span>` : ''}
              ${branch ? ` &middot; <span>Branch: ${escapeText(branch)}</span>` : ''}
            </div>
  
            <div class="gxt-badges">
              ${row.status ? `<span class="gxt-badge">Status: ${escapeText(row.status)}</span>` : ''}
              ${row.units ? `<span class="gxt-badge">Units: ${escapeText(row.units)}</span>` : ''}
              ${row.qty != null ? `<span class="gxt-badge d-none">Qty: ${escapeText(String(row.qty))}</span>` : ''}
              ${row.reorderlevel ? `<span class="gxt-badge d-none">Reorder: ${escapeText(String(row.reorderlevel))}</span>` : ''}
            </div>
  
            <div class="gxt-overview">
            <div style="height: 540px; overflow: hidden; ">
              ${sanitizeHtml(descRaw || pdescRaw || tprocRaw || '') || '<p class="note">No description provided.</p>'}
            </div>
              ${overviewText.length > 60 ? `<a class="gxt-readmore" id="gxt-readmore" href="#gxt-tabs">Read full details</a>` : ''}
            </div>
  
            ${row.transactiondesc ? `<p style="margin-top:10px;color:#6b7280;font-size:13px;">Last update: ${escapeText(row.transactiondesc)}</p>` : ''}
          </div>
        </div>
  
        <!-- Tabs -->
        <section id="gxt-tabs">
          <div class="tab-head">
            <button class="tab-btn active" data-tab="desc">Description</button>
            <button class="tab-btn" data-tab="pdesc">Product Description</button>
            <button class="tab-btn" data-tab="tproc">Trade Process</button>
          </div>
          <div class="tab-panels">
            <div class="tab-panel active" id="tab-desc">${sanitizeHtml(descRaw) || '<p class="note">No description provided.</p>'}</div>
            <div class="tab-panel" id="tab-pdesc">${sanitizeHtml(pdescRaw) || '<p class="note">No product description provided.</p>'}</div>
            <div class="tab-panel" id="tab-tproc">${sanitizeHtml(tprocRaw) || '<p class="note">No trade process provided.</p>'}</div>
          </div>
        </section>
  
        <!-- Similar -->
        <div class="gxt-similar">
          <h3>Similar items in this category</h3>
          <div class="gxt-similar-grid" id="gxt-similar-grid"></div>
        </div>
      `;
  
      // Gallery interactions
      const mainImg = $('#gxt-product .gxt-main-img img', mount);
      $$('#gxt-product .gxt-thumbs button', mount).forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.getAttribute('data-index') || '0', 10);
          mainImg.src = images[i] || images[0];
        });
      });
  
      // Magnifier -> open modal carousel
      $('.gxt-zoom-btn', mount).addEventListener('click', () => openModal(images, 0));
  
      // Tabs
      $$('#gxt-tabs .tab-btn', mount).forEach(btn => {
        btn.addEventListener('click', () => {
          $$('#gxt-tabs .tab-btn', mount).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const target = btn.getAttribute('data-tab');
          $$('#gxt-tabs .tab-panel', mount).forEach(p => p.classList.remove('active'));
          $('#tab-' + target, mount)?.classList.add('active');
        });
      });
  
      // Read more link selects "Description" tab
      const rm = $('#gxt-readmore', mount);
      if (rm) {
        rm.addEventListener('click', (e) => {
          // ensure Description tab is active after jump
          setTimeout(() => {
            const firstBtn = $('#gxt-tabs .tab-btn[data-tab="desc"]', mount);
            if (firstBtn) firstBtn.click();
          }, 0);
        });
      }
  
      // Load similar
      if (deptId !== '' && deptId !== null && deptId !== undefined) {
        loadSimilar(String(deptId), String(row.itemid));
      } else {
        const grid = $('#gxt-similar-grid', mount);
        if (grid) grid.innerHTML = `<div style="color:#6b7280;font-size:13px;">No category on this item.</div>`;
      }
    }
  
    function buildSimilarCard(item) {
      const main  = item.imageone || item.imagetwo || item.imagethree || PLACEHOLDER;
      const hover = item.imagetwo || item.imagethree || item.imageone || PLACEHOLDER;
      const name = item.itemname || 'Item';
      const deptName = item.departmentname || String(item.department || '');
  
      const wrap = document.createElement('div');
      wrap.className = 'tm-woo-product-item shop-catalog-layout-default product type-product';
      wrap.innerHTML = `
        <div class="tm-woo-product-item-inner">
          <div class="product-header-wrapper">
            <div class="thumb image-swap">
              <a href="product.html?itemid=${encodeURIComponent(item.itemid)}">
                <img alt="${escapeText(name)}" src="${main}" />
              </a>
              <a href="product.html?itemid=${encodeURIComponent(item.itemid)}">
                <img class="product-hover-image" alt="${escapeText(name)}" src="${hover}" />
              </a>
            </div>
          </div>
          <div class="product-details" style="padding:10px 12px;">
            <span class="product-categories">
              <a href="javascript:void(0)" rel="tag">${escapeText(deptName)}</a>
            </span>
            <h5 class="woocommerce-loop-product__title product-title" style="margin:6px 0 0;">
              <a href="product.html?itemid=${encodeURIComponent(item.itemid)}">${escapeText(name)}</a>
            </h5>
          </div>
        </div>
      `;
      return wrap;
    }
  
    async function loadSimilar(deptId, currentItemId) {
      try {
        const url = `${baseurl}/api/front/inventory/getinventory?department=${encodeURIComponent(deptId)}&limit=20`;
        const json = await fetchJSON(url);
        const rows = Array.isArray(json?.data) ? json.data : [];
        const grid = $('#gxt-similar-grid', mount);
        if (!grid) return;
  
        const filtered = rows.filter(r => String(r.itemid) !== String(currentItemId));
        if (filtered.length === 0) {
          grid.innerHTML = `<div style="color:#6b7280;font-size:13px;">No similar items found.</div>`;
          return;
        }
  
        const frag = document.createDocumentFragment();
        filtered.slice(0, 8).forEach(r => frag.appendChild(buildSimilarCard(r)));
        grid.innerHTML = '';
        grid.appendChild(frag);
      } catch (err) {
        console.error('Similar items failed:', err);
        const grid = $('#gxt-similar-grid', mount);
        if (grid) grid.innerHTML = `<div style="color:#991b1b;font-size:13px;">Could not load similar items.</div>`;
      }
    }
  
    // ---------------- Boot ----------------
    async function boot() {
      injectStyles();
      if (!itemid) {
        mount.innerHTML = `<div class="gxt-alert"><strong>Missing itemid</strong> · The product URL must include ?itemid=XXXX</div>`;
        return;
      }
      renderSkeleton();
      try {
        const url = `${baseurl}/api/front/inventory/getinventory?itemid=${encodeURIComponent(itemid)}`;
        const json = await fetchJSON(url);
        const row = Array.isArray(json?.data) ? json.data[0] : null;
        if (!row) throw new Error('Product not found');
        renderProduct(row);
      } catch (err) {
        console.error('Product load failed:', err);
        mount.innerHTML = `<div class="gxt-alert"><strong>Could not load product.</strong><div style="margin-top:6px;">${escapeText(err.message || 'Unknown error')}</div></div>`;
      }
    }
  
    document.addEventListener('DOMContentLoaded', boot);
  })();
  
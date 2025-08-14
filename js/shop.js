// js/shop.js
// Populate Woo-style grid with consistent square images + loading skeleton.
// Department = Category. Ignore price & cart.

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  if (typeof baseurl === 'undefined') {
    console.error('baseurl is not defined. Ensure js/index.js loads before js/shop.js');
  }

  const params = new URLSearchParams(location.search);
  const urlDeptName = (params.get('department') || '').trim();

  const PLACEHOLDER_MAIN  = 'https://dummyimage.com/600x600/e5e7eb/111827.jpg&text=Global+XT';
  const PLACEHOLDER_HOVER = 'https://dummyimage.com/600x600/d1d5db/111827.jpg&text=Global+XT';

  const container = $('#gxt-shop-container');
  if (!container) return console.warn('#gxt-shop-container not found');
  const grid = $('.isotope-layout-inner', container);
  const resultCountEl = $('.woocommerce-result-count', container);
  const beforeLoopBar = $('.tm-wc-archive-before-loop', container);
  const orderingForm = $('.woocommerce-ordering', container);

  // ---------------- Styles (enforce square images + skeleton) ----------------
  function injectStyles() {
    if ($('#gxt-shop-css')) return;
    const style = document.createElement('style');
    style.id = 'gxt-shop-css';
    style.textContent = `
      /* Keep everything scoped to this page block */
      #gxt-shop-container .thumb.image-swap{
        position:relative;
        width:100%;
        aspect-ratio:1/1;
        overflow:hidden;
        background:#f3f4f6;
      }
      #gxt-shop-container .thumb.image-swap a{
        position:absolute;
        inset:0;
        display:block;
      }
      #gxt-shop-container .thumb.image-swap img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
        transition:opacity .25s ease;
      }
      /* Hover swap (second image fades in) */
      #gxt-shop-container .thumb.image-swap a + a img{ opacity:0; }
      #gxt-shop-container .tm-woo-product-item:hover .thumb.image-swap a + a img{ opacity:1; }
      #gxt-shop-container .tm-woo-product-item:hover .thumb.image-swap a:first-child img{ opacity:0; }

      /* Skeletons */
      @keyframes gxt-shimmer {
        0% { background-position:-200% 0; }
        100% { background-position:200% 0; }
      }
      #gxt-shop-container .gxt-skel {
        background: linear-gradient(90deg, #eee, #f7f7f7, #eee);
        background-size:200% 100%;
        animation:gxt-shimmer 1.2s infinite;
      }
      #gxt-shop-container .gxt-skel-img{
        width:100%;
        aspect-ratio:1/1;
        border-radius:4px;
      }
      #gxt-shop-container .gxt-skel-badge{
        display:inline-block;
        width:110px;
        height:18px;
        border-radius:999px;
        margin:.65rem 0 .35rem;
      }
      #gxt-shop-container .gxt-skel-line{
        height:14px;
        border-radius:6px;
        margin:.35rem 0;
        width:90%;
      }
      #gxt-shop-container .gxt-skel-line.short{ width:60%; }
    `;
    document.head.appendChild(style);
  }

  // ---------------- Helpers ----------------
  function htmlToText(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  }
  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function normalizeItem(raw) {
    const main  = raw.imageone || raw.imagetwo || raw.imagethree || PLACEHOLDER_MAIN;
    const hover = raw.imagetwo || raw.imagethree || raw.imageone || PLACEHOLDER_HOVER;
    return {
      id: raw.itemid,
      name: raw.itemname || 'Item',
      departmentId: String(raw.department || '').trim(),
      departmentName: raw.departmentname || String(raw.department || ''),
      imageMain: main,
      imageHover: hover,
      desc: htmlToText(raw.description || ''),
      raw
    };
  }
  function clearGridPreserveSizer() {
    if (!grid) return;
    const sizer = $('.isotope-item-sizer', grid);
    grid.innerHTML = '';
    if (sizer) grid.appendChild(sizer);
  }

  // ---------------- Skeletons ----------------
  function buildSkeletonCard() {
    const wrap = document.createElement('div');
    wrap.className = 'isotope-item';
    wrap.innerHTML = `
      <div class="tm-woo-product-item shop-catalog-layout-default product type-product">
        <div class="tm-woo-product-item-inner">
          <div class="product-header-wrapper">
            <div class="thumb image-swap">
              <div class="gxt-skel gxt-skel-img"></div>
            </div>
          </div>
          <div class="product-details">
            <span class="gxt-skel gxt-skel-badge"></span>
            <div class="gxt-skel gxt-skel-line"></div>
            <div class="gxt-skel gxt-skel-line short"></div>
          </div>
        </div>
      </div>
    `;
    return wrap;
  }
  function showSkeleton(count = 8) {
    clearGridPreserveSizer();
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) frag.appendChild(buildSkeletonCard());
    grid.appendChild(frag);
    if (resultCountEl) resultCountEl.textContent = 'Loading products…';
  }
  function hideSkeleton() {
    clearGridPreserveSizer();
  }

  // ---------------- Filter + Render ----------------
  const state = { all: [], visible: [], departments: [], selectedDept: '' };

  function computeDepartments(items) {
    const set = new Set();
    items.forEach(i => { const n = (i.departmentName || '').trim(); if (n) set.add(n); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function buildCard(item) {
    const wrap = document.createElement('div');
    wrap.className = 'isotope-item';
    wrap.innerHTML = `
      <div class="tm-woo-product-item shop-catalog-layout-default product type-product">
        <div class="tm-woo-product-item-inner">
          <div class="product-header-wrapper">
            <div class="thumb image-swap">
              <a href="product.html?itemid=${encodeURIComponent(item.id)}">
                <img alt="${escapeHtml(item.name)}" src="${escapeHtml(item.imageMain)}" />
              </a>
              <a href="product.html?itemid=${encodeURIComponent(item.id)}">
                <img class="product-hover-image" alt="${escapeHtml(item.name)}" src="${escapeHtml(item.imageHover)}" />
              </a>
            </div>
            <div class="product-button-holder">
              <button class="material-symbols-outlined circle-button" type="button" aria-label="Compare">balance</button>
              <button class="material-symbols-outlined circle-button" type="button" aria-label="Wishlist">heart_check</button>
              <button class="material-symbols-outlined circle-button" type="button" aria-label="Quick view">visibility</button>
            </div>
          </div>
          <div class="product-details">
            <span class="product-categories">
              <a href="javascript:void(0)" rel="tag">${escapeHtml(item.departmentName || 'Category')}</a>
            </span>
            <h5 class="woocommerce-loop-product__title product-title">
              <a href="product.html?itemid=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a>
            </h5>
          </div>
        </div>
      </div>
    `;
    return wrap;
  }

  function renderGrid(items) {
    clearGridPreserveSizer();
    const frag = document.createDocumentFragment();
    items.forEach(item => frag.appendChild(buildCard(item)));
    grid.appendChild(frag);
    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${items.length} of ${state.all.length} results`;
    }
  }

  function applyFilter() {
    const dept = (state.selectedDept || '').toLowerCase();
    state.visible = state.all.filter(it => !dept || (it.departmentName || '').toLowerCase() === dept);
    renderGrid(state.visible);
  }

  function injectDepartmentFilter() {
    if (!beforeLoopBar) return;
    const holder = document.createElement('div');
    holder.className = 'woocommerce-department';
    holder.style.marginLeft = '8px';
    holder.innerHTML = `
      <select id="gxt-dept-filter" class="orderby" aria-label="Filter by department"></select>
    `;
    if (orderingForm && orderingForm.parentNode === beforeLoopBar) {
      beforeLoopBar.insertBefore(holder, orderingForm);
    } else {
      beforeLoopBar.appendChild(holder);
    }
    const sel = $('#gxt-dept-filter', holder);
    sel.innerHTML = '';
    sel.add(new Option('All Departments', ''));
    state.departments.forEach(name => sel.add(new Option(name, name)));
    if (urlDeptName && state.departments.includes(urlDeptName)) {
      sel.value = urlDeptName;
      state.selectedDept = urlDeptName;
    }
    sel.addEventListener('change', (e) => {
      state.selectedDept = e.target.value || '';
      applyFilter();
    });
  }

  // ---------------- Boot ----------------
  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();

    // Prevent initial flicker and show skeletons
    showSkeleton(8);

    fetch(`${baseurl}/api/front/inventory/getinventory`)
      .then(r => r.json())
      .then(json => {
        const rows = Array.isArray(json?.data) ? json.data : [];
        state.all = rows.map(normalizeItem);
        state.departments = computeDepartments(state.all);

        injectDepartmentFilter();
        hideSkeleton();
        applyFilter();
      })
      .catch(err => {
        console.error('Inventory load failed:', err);
        hideSkeleton();
        if (resultCountEl) resultCountEl.textContent = 'Could not load inventory.';
      });
  });
})();
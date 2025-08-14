// js/shop.js
// Populate Woo-style grid with consistent square images + loading skeleton.
// Department = Category. Ignore price & cart.
// ✅ Adds client-side pagination with URL sync: ?department=&page=&perPage=

(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    if (typeof baseurl === 'undefined') {
      console.error('baseurl is not defined. Ensure js/index.js loads before js/shop.js');
    }
  
    // ---------------- URL Params ----------------
    const params = new URLSearchParams(location.search);
    const urlDeptName = (params.get('department') || '').trim();
    const urlPage     = parseInt(params.get('page') || '1', 10);
    const urlPerPage  = parseInt(params.get('perPage') || '12', 10); // default 12 (grid-4 x 3 rows)
  
    const PLACEHOLDER_MAIN  = 'https://dummyimage.com/600x600/e5e7eb/111827.jpg&text=Global+XT';
    const PLACEHOLDER_HOVER = 'https://dummyimage.com/600x600/d1d5db/111827.jpg&text=Global+XT';
  
    const container = $('#gxt-shop-container');
    if (!container) return console.warn('#gxt-shop-container not found');
  
    const grid = $('.isotope-layout-inner', container);
    const resultCountEl = $('.woocommerce-result-count', container);
    const beforeLoopBar = $('.tm-wc-archive-before-loop', container);
    const orderingForm = $('.woocommerce-ordering', container);
  
    // We'll render pagination into this element (created if missing)
    let paginationNav = $('.woocommerce-pagination', container);
    if (!paginationNav) {
      paginationNav = document.createElement('nav');
      paginationNav.className = 'woocommerce-pagination';
      // If there's a typical "after loop" bar, place it there; else after the grid.
      const afterLoopBar = $('.tm-wc-archive-after-loop', container);
      (afterLoopBar || grid.parentNode || container).appendChild(paginationNav);
    }
  
    // ---------------- Styles (square images + skeleton + pagination) ----------------
    function injectStyles() {
      if ($('#gxt-shop-css')) return;
      const style = document.createElement('style');
      style.id = 'gxt-shop-css';
      style.textContent = `
        /* Keep everything scoped to this page block */
        #gxt-shop-container .thumb.image-swap{
          position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:#f3f4f6;
        }
        #gxt-shop-container .thumb.image-swap a{position:absolute;inset:0;display:block;}
        #gxt-shop-container .thumb.image-swap img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .25s ease;}
        #gxt-shop-container .thumb.image-swap a + a img{ opacity:0; }
        #gxt-shop-container .tm-woo-product-item:hover .thumb.image-swap a + a img{ opacity:1; }
        #gxt-shop-container .tm-woo-product-item:hover .thumb.image-swap a:first-child img{ opacity:0; }
  
        /* Skeletons */
        @keyframes gxt-shimmer {0%{background-position:-200% 0;} 100%{background-position:200% 0;}}
        #gxt-shop-container .gxt-skel {background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:gxt-shimmer 1.2s infinite;}
        #gxt-shop-container .gxt-skel-img{width:100%;aspect-ratio:1/1;border-radius:4px;}
        #gxt-shop-container .gxt-skel-badge{display:inline-block;width:110px;height:18px;border-radius:999px;margin:.65rem 0 .35rem;}
        #gxt-shop-container .gxt-skel-line{height:14px;border-radius:6px;margin:.35rem 0;width:90%;}
        #gxt-shop-container .gxt-skel-line.short{width:60%;}
  
        /* Pagination (Woo-style fallback if theme has none) */
        #gxt-shop-container .woocommerce-pagination{display:flex;justify-content:center;margin:24px 0 8px;}
        #gxt-shop-container .woocommerce-pagination ul.page-numbers{display:flex;gap:8px;list-style:none;padding:0;margin:0;flex-wrap:wrap}
        #gxt-shop-container .woocommerce-pagination a.page-numbers,
        #gxt-shop-container .woocommerce-pagination span.page-numbers{
          display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;padding:0 10px;
          border:1px solid #e5e7eb;border-radius:6px;text-decoration:none;line-height:1;font-size:14px;color:#111827;background:#fff;
        }
        #gxt-shop-container .woocommerce-pagination span.current{background:#111827;color:#fff;border-color:#111827;}
        #gxt-shop-container .woocommerce-pagination .dots{border:none;background:transparent}
        #gxt-shop-container .woocommerce-pagination a[aria-disabled="true"]{pointer-events:none;opacity:.5}
        #gxt-shop-container .gxt-perpage{margin-left:auto}
        #gxt-shop-container .tm-wc-archive-before-loop{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
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
    function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
  
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
    function hideSkeleton() { clearGridPreserveSizer(); }
  
    // ---------------- Filter + Render + Pagination ----------------
    const state = {
      all: [],
      filtered: [],
      page: Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1,
      perPage: Number.isFinite(urlPerPage) && urlPerPage > 0 ? urlPerPage : 12,
      departments: [],
      selectedDept: ''
    };
  
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
  
    function renderGridPage() {
      // Compute current slice
      const total = state.filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / state.perPage));
      state.page = clamp(state.page, 1, totalPages);
  
      const start = (state.page - 1) * state.perPage;
      const end = Math.min(start + state.perPage, total);
      const pageItems = state.filtered.slice(start, end);
  
      clearGridPreserveSizer();
      const frag = document.createDocumentFragment();
      pageItems.forEach(item => frag.appendChild(buildCard(item)));
      grid.appendChild(frag);
  
      // Result count text: "Showing X–Y of N"
      if (resultCountEl) {
        const X = total === 0 ? 0 : start + 1;
        const Y = end;
        resultCountEl.textContent = total === 0
          ? 'No products found'
          : `Showing ${X}–${Y} of ${total} results`;
      }
  
      renderPagination(totalPages);
      syncUrl();
    }
  
    function applyFilter() {
      const dept = (state.selectedDept || '').toLowerCase();
      state.filtered = state.all.filter(it => !dept || (it.departmentName || '').toLowerCase() === dept);
      // Reset to page 1 if current page would be out of range
      const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
      if (state.page > totalPages) state.page = 1;
      renderGridPage();
    }
  
    // ---------------- Department Filter UI ----------------
    function injectDepartmentFilter() {
      if (!beforeLoopBar) return;
      const holder = document.createElement('div');
      holder.className = 'woocommerce-department';
      holder.style.marginLeft = '8px';
      holder.innerHTML = `
        <select id="gxt-dept-filter" class="orderby" aria-label="Filter by department"></select>
      `;
  
      // Per-page selector (optional, synced to URL)
      const perPageWrap = document.createElement('div');
      perPageWrap.className = 'gxt-perpage';
      perPageWrap.innerHTML = `
        <label style="font-size:13px;color:#6b7280;margin-right:6px">Per page:</label>
        <select id="gxt-perpage" class="orderby" aria-label="Items per page">
          ${[8,12,16,20,24].map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
      `;
  
      // Place next to ordering form if present
      if (orderingForm && orderingForm.parentNode === beforeLoopBar) {
        beforeLoopBar.insertBefore(holder, orderingForm);
        beforeLoopBar.appendChild(perPageWrap);
      } else {
        beforeLoopBar.appendChild(holder);
        beforeLoopBar.appendChild(perPageWrap);
      }
  
      // Populate department options
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
        state.page = 1;
        applyFilter();
      });
  
      // Per-page setup
      const perSel = $('#gxt-perpage', perPageWrap);
      if ([8,12,16,20,24].includes(state.perPage)) perSel.value = String(state.perPage);
      perSel.addEventListener('change', (e) => {
        const v = parseInt(e.target.value, 10);
        if (Number.isFinite(v) && v > 0) {
          state.perPage = v;
          state.page = 1;
          applyFilter();
        }
      });
    }
  
    // ---------------- Pagination UI ----------------
    function renderPagination(totalPages) {
      // Clear
      paginationNav.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'page-numbers';
  
      function makeBtn(label, page, opts = {}) {
        const isCurrent = page === state.page && !opts.isNav;
        const el = document.createElement(isCurrent ? 'span' : 'a');
        el.className = 'page-numbers' + (opts.isNav ? ` ${opts.isNav}` : '') + (isCurrent ? ' current' : '');
        el.textContent = label;
        if (!isCurrent) {
          el.href = '#';
          el.addEventListener('click', (ev) => {
            ev.preventDefault();
            goToPage(page);
          });
        }
        if (opts.disabled) el.setAttribute('aria-disabled', 'true');
        return el;
      }
  
      const li = (child) => { const li = document.createElement('li'); li.appendChild(child); return li; };
  
      // Prev
      ul.appendChild(li(makeBtn('«', state.page - 1, { isNav: 'prev', disabled: state.page <= 1 })));
  
      // Number window with ellipses
      const windowSize = 2; // show 2 on each side of current
      const pages = [];
      for (let i = 1; i <= totalPages; i++) pages.push(i);
  
      function addDots(){ ul.appendChild(li(Object.assign(document.createElement('span'),{className:'page-numbers dots',textContent:'…'}))); }
  
      pages.forEach((p, idx) => {
        const first = 1, last = totalPages;
        const inWindow = p === first || p === last || Math.abs(p - state.page) <= windowSize;
        const nearStartGap = p === 2 && state.page - windowSize > 3;
        const nearEndGap   = p === totalPages - 1 && state.page + windowSize < totalPages - 2;
  
        if (inWindow) {
          ul.appendChild(li(makeBtn(String(p), p)));
        } else if (nearStartGap || nearEndGap) {
          addDots();
        }
      });
  
      // Next
      ul.appendChild(li(makeBtn('»', state.page + 1, { isNav: 'next', disabled: state.page >= totalPages })));
  
      paginationNav.appendChild(ul);
      paginationNav.style.display = totalPages > 1 ? '' : 'none';
    }
  
    function goToPage(n) {
      const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
      state.page = clamp(n, 1, totalPages);
      renderGridPage();
      // Scroll back to top of grid for better UX
      const top = container.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  
    // ---------------- URL sync (pushState/popstate) ----------------
    function syncUrl() {
      const url = new URL(location.href);
      const sp = url.searchParams;
      if (state.selectedDept) sp.set('department', state.selectedDept); else sp.delete('department');
      sp.set('page', String(state.page));
      sp.set('perPage', String(state.perPage));
      // Only push if changed
      const newQs = sp.toString();
      if (newQs !== location.search.replace(/^\?/,''))
        history.replaceState({page: state.page, perPage: state.perPage, department: state.selectedDept}, '', `${url.pathname}?${newQs}`);
    }
  
    window.addEventListener('popstate', (e) => {
      const sp = new URLSearchParams(location.search);
      const p  = parseInt(sp.get('page') || '1', 10);
      const pp = parseInt(sp.get('perPage') || String(state.perPage), 10);
      const d  = (sp.get('department') || '');
      state.page = Number.isFinite(p) && p > 0 ? p : 1;
      state.perPage = Number.isFinite(pp) && pp > 0 ? pp : state.perPage;
      state.selectedDept = d;
      // Update dropdowns if present
      const deptSel = $('#gxt-dept-filter', container);
      if (deptSel) deptSel.value = state.selectedDept || '';
      const perSel = $('#gxt-perpage', container);
      if (perSel) perSel.value = String(state.perPage);
      applyFilter();
    });
  
    // ---------------- Boot ----------------
    document.addEventListener('DOMContentLoaded', function () {
      injectStyles();
      showSkeleton(8);
  
      fetch(`${baseurl}/api/front/inventory/getinventory`)
        .then(r => r.json())
        .then(json => {
          const rows = Array.isArray(json?.data) ? json.data : [];
          state.all = rows.map(normalizeItem);
          state.departments = computeDepartments(state.all);
  
          injectDepartmentFilter();
  
          // Initialize department from URL if valid
          if (!state.selectedDept && urlDeptName && state.departments.includes(urlDeptName)) {
            state.selectedDept = urlDeptName;
          }
  
          hideSkeleton();
  
          // Prepare filtered list and first render
          const dept = (state.selectedDept || '').toLowerCase();
          state.filtered = state.all.filter(it => !dept || (it.departmentName || '').toLowerCase() === dept);
          renderGridPage();
        })
        .catch(err => {
          console.error('Inventory load failed:', err);
          hideSkeleton();
          if (resultCountEl) resultCountEl.textContent = 'Could not load inventory.';
          paginationNav.style.display = 'none';
        });
    });
  })();
  
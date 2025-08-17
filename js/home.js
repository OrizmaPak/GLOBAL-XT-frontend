
/* ===========================
   Department Banners Renderer
   =========================== */

/**
 * Slugify helper for URLs and alt text.
 */
function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

/**
 * Decide the target URL for a department banner.
 * For STORE categories we point to shop.html; otherwise product.html as a fallback.
 */
function buildDeptLink(dept) {
  const base =
    (dept.category || "").toUpperCase() === "STORE"
      ? "./shop.html"
      : "./product.html";

  const params = new URLSearchParams({
    id: dept.id,
    department: dept.department || "",
    category: dept.category || "",
  });

  return `${base}?${params.toString()}`;
}

/**
 * Render banners into the #department-banners grid.
 * @param {Array} departments  - Array from response.data
 */
function renderDepartmentBanners(departments = []) {
  const container = document.getElementById("department-banners");
  const empty = document.getElementById("dept-banners-empty");
  const tpl = document.getElementById("deptBannerTpl");

  if (!container || !tpl) return;

  // Reset UI
  container.innerHTML = "";
  empty && (empty.style.display = "none");

  if (!Array.isArray(departments) || departments.length === 0) {
    empty && (empty.style.display = "block");
    return;
  }

  // We’ll append columns directly into container; Elementor/Qode expects column children
  const frag = document.createDocumentFragment();

  departments.forEach((dept) => {
    const node = tpl.content.cloneNode(true);

    // Populate image
    const img = node.querySelector(".qodef-m-image-el");
    const safeTitle = dept.department || "Department";
    const safeDesc = dept.shortdesc || "";
    const src =
      dept.image ||
      "https://dummyimage.com/600x400/e5e7eb/111827.jpg&text=Global+XT"; // fallback

    if (img) {
      img.src = src;
      img.alt = `${safeTitle} banner`;
      img.setAttribute("sizes", "(max-width: 600px) 100vw, 600px");
    }

    // Texts
    const titleEl = node.querySelector(".js-title");
    const subEl = node.querySelector(".js-subtitle");
    if (titleEl) titleEl.textContent = safeTitle;
    if (subEl) subEl.textContent = safeDesc;

    // Links: set href on the CTA and the full-card overlay link (last child)
    const href = buildDeptLink(dept);
    const overlay = node.querySelector('.qodef-m-banner-link');
    const cta = node.querySelector('.js-cta');

    if (overlay) {
      overlay.href = href;
      overlay.setAttribute('aria-label', `View ${safeTitle}`);
    }
    if (cta) {
      cta.href = href;
      cta.setAttribute('aria-label', `View ${safeTitle}`);
    }

    frag.appendChild(node);
  });

  container.appendChild(frag);
  hydrateQiInteractiveBanners(container);
}

/**
 * Re-init styles after dynamic inject (and provide a CSS fallback)
 */
function hydrateQiInteractiveBanners(scope = document) {
  // Mark banners as ready (unlocks CSS fallback below)
  scope.querySelectorAll('.qodef-qi-interactive-banner').forEach((card) => {
    card.classList.add('qodef--ready');
  });

  // If the theme exposes a re-init hook, call it safely
  try {
    // Common Elementor/Qi hooks; guarded so it never crashes if absent
    if (window.qiAddonsForElementor && typeof window.qiAddonsForElementor.qodefInit === 'function') {
      window.qiAddonsForElementor.qodefInit(); // re-scan dynamic widgets
    }
    if (window.elementorFrontend && window.elementorFrontend.hooks) {
      window.elementorFrontend.hooks.doAction('frontend/element_ready/global');
    }
  } catch (_) {}
}

/**
 * Example hook: call this right after your Departments API returns.
 * Expecting the response shape you pasted:
 * {
 *   status: true,
 *   data: [ { id, department, category, shortdesc, image, ... }, ... ]
 * }
 */
function handleDepartmentsResponse(responseJson) {
  try {
    const departments = (responseJson && responseJson.data) || [];
    renderDepartmentBanners(departments);
  } catch (e) {
    console.error("Failed to render departments:", e);
    renderDepartmentBanners([]); // show empty state
  }
}

/* ===== OPTIONAL: if you already fetch departments on page load, just call:
fetch(DEPARTMENTS_URL)
  .then(res => res.json())
  .then(handleDepartmentsResponse)
  .catch(() => renderDepartmentBanners([]));
*/

document.addEventListener('DOMContentLoaded', function() {
    fetch(`${baseurl}/api/front/admin/department`)
        .then(response => response.json())
        .then(handleDepartmentsResponse)
        .catch(() => renderDepartmentBanners([]));
});


/* =========================== Featured Products Slider =========================== */
/**
 * This targets the Elementor/Qi slider block you pasted (the one whose wrapper
 * has .qodef-qi-woo-shortcode-product-slider + .swiper-wrapper).
 * It replaces the placeholder slides with fresh items from the inventory API.
 *
 * Requirements:
 * - baseurl is defined in js/index.js
 * - index.html already includes the Qi/Elementor slider markup (your pasted section)
 * - This file (home.js) loads after index.js
 */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const PLACEHOLDER_IMG = 'https://dummyimage.com/700x800/e5e7eb/111827.jpg&text=Global+XT';

  // ---- Styles (tiny scoped skeleton for the slider) ----
  function injectFeaturedStyles() {
    if (document.querySelector('#gxt-featured-css')) return;
    const style = document.createElement('style');
    style.id = 'gxt-featured-css';
    style.textContent = `
      @keyframes gxt-shimmer {0%{background-position:-200% 0;}100%{background-position:200% 0;}}
      .gxt-skel {background:linear-gradient(90deg,#eee,#f7f7f7,#eee);background-size:200% 100%;animation:gxt-shimmer 1.2s infinite;}
  
      /* ---------- FIXED SIZE CONFIG (tweak these) ---------- */
      .elementor-element-36cb354,
      .qodef-qi-woo-shortcode-product-slider {
        --gxt-card-w: 320px;   /* desktop width */
        --gxt-card-h: 380px;   /* desktop height */
      }
      @media (max-width: 640px) {
        .elementor-element-36cb354,
        .qodef-qi-woo-shortcode-product-slider {
          --gxt-card-w: 240px; /* mobile width */
          --gxt-card-h: 300px; /* mobile height */
        }
      }
  
      /* Center slide content so fixed box sits nicely */
      .elementor-element-36cb354 .qodef-e-product-inner,
      .qodef-qi-woo-shortcode-product-slider .qodef-e-product-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
  
      /* Fixed-size image box */
      .elementor-element-36cb354 .qodef-e-product-image-holder,
      .qodef-qi-woo-shortcode-product-slider .qodef-e-product-image-holder {
        width: var(--gxt-card-w);
        height: var(--gxt-card-h);
        max-width: 100%;
        margin: 0 auto 10px;
        border-radius: 10px;
        overflow: hidden;
      }
  
      /* Image fills the fixed box */
      .elementor-element-36cb354 .qodef-e-product-image-holder img,
      .qodef-qi-woo-shortcode-product-slider .qodef-e-product-image-holder img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* crops neatly to the box */
        display: block;
      }
  
      /* Skeleton uses same fixed box */
      .gxt-skel-img {
        width: var(--gxt-card-w);
        height: var(--gxt-card-h);
        border-radius: 10px;
        margin: 0 auto;
      }
  
      /* Optional: constrain slide min width so three per view look tidy */
      .elementor-element-36cb354 .swiper-slide,
      .qodef-qi-woo-shortcode-product-slider .swiper-slide {
        display: flex;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);
  }
  
  function escapeText(s) {
    return String(s ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function getImages(row) {
    const order = ['imageone','imagetwo','imagethree','imagefour','imagefive','imagesix','imageseven','imageeight','imagenine','imageten'];
    const imgs = order.map(k => row?.[k]).filter(Boolean);
    return imgs.length ? imgs : [PLACEHOLDER_IMG];
  }

  // Try to find the exact widget you pasted; fallback to the first slider on page
  function getSliderWidgetRoot() {
    // Your pasted widget element carries this Elementor class:
    const exact = document.querySelector('.elementor-element-36cb354 .qodef-qi-woo-shortcode-product-slider');
    if (exact) return exact;
    // Fallback to the first product slider on page
    return document.querySelector('.qodef-qi-woo-shortcode-product-slider');
  }

  function showSliderSkeleton(wrapper, count = 6) {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const slide = document.createElement('div');
      slide.className = 'qodef-e swiper-slide product';
      slide.innerHTML = `
        <div class="qodef-e-product-inner">
          <div class="qodef-e-product-image">
            <div class="qodef-e-product-image-holder gxt-skel gxt-skel-img"></div>
          </div>
          <div class="qodef-e-product-content" style="padding:8px 4px 14px;">
            <div class="gxt-skel gxt-skel-line full"></div>
            <div class="gxt-skel gxt-skel-line short"></div>
          </div>
        </div>
      `;
      wrapper.appendChild(slide);
    }
  }

  function buildSlide(item) {
    const imgs = getImages(item);
    const name = escapeText(item.itemname || 'Item');
    const deptName = escapeText(item.departmentname || String(item.department || ''));
    const productHref = `./product.html?itemid=${encodeURIComponent(item.itemid)}`;
    const deptHref = `./shop.html?department=${encodeURIComponent(item.department || '')}`;

    // Try to match the Qi/Elementor markup so the theme styles apply cleanly
    const slide = document.createElement('div');
    slide.className = 'qodef-e swiper-slide product type-product instock';
    slide.innerHTML = `
      <div class="qodef-e-product-inner">
        <div class="qodef-e-product-image" onclick="window.location.href='${productHref}'">
          <div class="qodef-e-product-image-holder">
            <img decoding="async" width="700" height="800" src="${imgs[0]}" class="attachment-full size-full" alt="${name}">
          </div>
        </div>
        <div class="qodef-e-product-content">
          <h5 itemprop="name" class="qodef-e-product-title qodef-e-title entry-title">
            <a itemprop="url" class="qodef-e-product-title-link" href="${productHref}">${name}</a>
          </h5>
          <div class="qodef-e-product-categories">
            <a href="${deptHref}" rel="tag">${deptName}</a>
          </div>
          <div class="qodef-e-swap-holder">
            <!-- No pricing yet; keep structure so layout stays consistent -->
            <div class="qodef-woo-product-price price"><span class="woocommerce-Price-amount amount">—</span></div>
          </div>
        </div>
        <a href="${productHref}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link" aria-label="${name}"></a>
      </div>
    `;
    return slide;
  }

  // Re-init the Qi/Elementor slider after DOM changes
  function hydrateQiSlider(widget) {
    try {
      // Elementor/Qi scan
      if (window.qiAddonsForElementor && typeof window.qiAddonsForElementor.qodefInit === 'function') {
        window.qiAddonsForElementor.qodefInit();
      }
      if (window.elementorFrontend && window.elementorFrontend.hooks) {
        window.elementorFrontend.hooks.doAction('frontend/element_ready/global');
      }
  
      // The actual swiper container is inside the widget
      const container = widget.querySelector('.qodef-qi-swiper-container');
      if (container) {
        if (container.swiper) {
          container.swiper.destroy(true, true);
        }
        const swiper = new Swiper(container, {
          loop: true,
          slidesPerView: 3,
          spaceBetween: 30,
          autoplay: { delay: 3000, disableOnInteraction: false },
          navigation: {
            nextEl: container.querySelector('.swiper-button-next'),
            prevEl: container.querySelector('.swiper-button-prev'),
          },
          pagination: {
            el: container.querySelector('.swiper-pagination'),
            clickable: true,
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }
        });
      }
    } catch (err) {
      console.warn('hydrateQiSlider failed:', err);
    }
  }
  
  

  function renderFeaturedProducts(items = []) {
    const widget = getSliderWidgetRoot();
    if (!widget) return;

    const wrapper = widget.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    // Replace slides
    wrapper.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      // if empty, leave a subtle note (or keep skeletons)
      const slide = document.createElement('div');
      slide.className = 'qodef-e swiper-slide';
      slide.innerHTML = `<div style="padding:24px;color:#6b7280;">No products available.</div>`;
      wrapper.appendChild(slide);
      hydrateQiSlider(widget);
      return;
    }

    const frag = document.createDocumentFragment();
    items.slice(0, 12).forEach(item => frag.appendChild(buildSlide(item)));
    wrapper.appendChild(frag);

    // Re-initialize the swiper so navigation/pagination reconnect
    hydrateQiSlider(widget);
  }

  async function loadFeaturedProducts() {
    const widget = getSliderWidgetRoot();
    if (!widget) return;

    injectFeaturedStyles();

    const wrapper = widget.querySelector('.swiper-wrapper');
    showSliderSkeleton(wrapper, 6);

    try {
      // Pull latest inventory (adjust limit as you like)
      const res = await fetch(`${baseurl}/api/front/inventory/getinventory?limit=12`);
      const json = await res.json();
      const rows = Array.isArray(json?.data) ? json.data : [];
      renderFeaturedProducts(rows);
    } catch (e) {
      console.error('Failed to load featured products:', e);
      // Leave skeletons or show a soft error slide
      if (wrapper) {
        wrapper.innerHTML = `<div class="qodef-e swiper-slide"><div style="padding:24px;color:#991b1b;">Could not load featured products.</div></div>`;
      }
      hydrateQiSlider(widget);
    }
  }

  // Boot after the page + your other home.js logic
  document.addEventListener('DOMContentLoaded', loadFeaturedProducts);
})();


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
      ? "globalxt/shop.html"
      : "globalxt/product.html";

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

    // Links (both overlay and button)
    const href = buildDeptLink(dept);
    node.querySelectorAll(".qodef-m-banner-link, .js-cta").forEach((a) => {
      a.href = href;
      a.setAttribute("aria-label", `View ${safeTitle}`);
    });

    frag.appendChild(node);
  });

  container.appendChild(frag);
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

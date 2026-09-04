// Clean URL routing for indexable guide pages while preserving legacy hash routes.
const starberrySeoRoutes = {
  welcome: "/",
  rules: "/rules/",
  join: "/join/",
  skills: "/skills/",
  crops: "/crops/",
  food: "/food/",
  economy: "/economy/",
  supporter: "/ranks/"
};

const starberryPathRoutes = Object.fromEntries(
  Object.entries(starberrySeoRoutes).map(([id, path]) => [path, id])
);

function starberryPageUrl(id) {
  return starberrySeoRoutes[id] || `/#${id}`;
}

function starberryIsKnownPage(id) {
  if (starberrySeoRoutes[id]) return true;
  if (typeof state === "undefined" || !state.navigation) return false;
  return state.navigation.groups.some(group => group.pages.some(page => page.id === id));
}

currentId = function() {
  const hashId = window.location.hash.replace("#", "").trim();

  // Legacy/non-SEO pages still use hashes on the root URL, e.g. /#getting-started.
  // Prefer a known page hash over the root path so those pages render correctly.
  if (hashId && starberryIsKnownPage(hashId)) return hashId;

  let path = window.location.pathname || "/";
  if (!path.endsWith("/")) path += "/";
  if (starberryPathRoutes[path]) return starberryPathRoutes[path];

  return hashId || "welcome";
};

renderNav = function() {
  const nav = document.getElementById("nav");
  nav.innerHTML = state.navigation.groups.map(group => `
    <div class="nav-group">
      <div class="nav-group-title">✦ ${group.title} ✦</div>
      ${group.pages.map(page => `
        <a class="nav-link" data-page="${page.id}" href="${starberryPageUrl(page.id)}">
          <span class="nav-icon">${page.icon}</span>
          <span>${page.label}</span>
        </a>
      `).join("")}
    </div>
  `).join("");
};

// On clean URL pages, legacy #page links still need to reach the correct guide page.
// Section links in the On This Page menu are intentionally left alone for smooth scrolling.
document.addEventListener("click", event => {
  const anchor = event.target.closest("a[href^='#']");
  if (!anchor || anchor.closest("#toc")) return;
  const id = (anchor.getAttribute("href") || "").slice(1);
  if (!id || !starberryIsKnownPage(id)) return;
  event.preventDefault();
  window.location.href = starberryPageUrl(id);
}, true);

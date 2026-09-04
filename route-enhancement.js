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

currentId = function() {
  let path = window.location.pathname || "/";
  if (!path.endsWith("/")) path += "/";
  if (starberryPathRoutes[path]) return starberryPathRoutes[path];
  return window.location.hash.replace("#", "") || "welcome";
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

// Convert legacy page hashes and search-result links into their clean URL equivalent.
document.addEventListener("click", event => {
  const anchor = event.target.closest("a[href^='#']");
  if (!anchor) return;
  const id = (anchor.getAttribute("href") || "").slice(1);
  if (!id || !starberrySeoRoutes[id]) return;
  event.preventDefault();
  window.location.href = starberrySeoRoutes[id];
}, true);

// Keeps the On This Page links inside the current documentation page.
// app.js uses the URL hash for top-level page routing, so normal #section
// anchors would otherwise be mistaken for page IDs.

document.addEventListener("click", event => {
  const link = event.target.closest("#toc a");
  if (!link) return;

  event.preventDefault();

  const href = link.getAttribute("href") || "";
  const sectionId = href.startsWith("#") ? href.slice(1) : href;
  const section = document.getElementById(sectionId);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Highlight the section currently in view without changing the route hash.
const tocObserver = new MutationObserver(() => {
  const toc = document.getElementById("toc");
  if (!toc) return;

  const links = [...toc.querySelectorAll("a")];
  if (!links.length) return;

  const sections = links
    .map(link => {
      const id = (link.getAttribute("href") || "").replace(/^#/, "");
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const updateActive = () => {
    const offset = 150;
    let active = sections[0];

    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= offset) {
        active = item;
      } else {
        break;
      }
    }

    links.forEach(link => link.classList.remove("active"));
    active?.link.classList.add("active");
  };

  window.removeEventListener("scroll", window.__starberryTocScrollHandler);
  window.__starberryTocScrollHandler = updateActive;
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
});

tocObserver.observe(document.getElementById("toc"), {
  childList: true,
  subtree: true
});

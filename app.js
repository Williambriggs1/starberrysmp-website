const state = {
  navigation: null,
  pages: {},
  server: null,
  crops: [],
  foods: [],
  skills: [],
  economy: null,
  cosmetics: []
};

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

async function loadData() {
  const [navigation, pages, server, crops, foods, skills, economy, cosmetics] = await Promise.all([
    loadJSON("data/navigation.json"),
    loadJSON("data/pages.json"),
    loadJSON("data/server.json"),
    loadJSON("data/crops.json"),
    loadJSON("data/foods.json"),
    loadJSON("data/skills.json"),
    loadJSON("data/economy.json"),
    loadJSON("data/cosmetics.json")
  ]);

  state.navigation = navigation;
  state.pages = pages;
  state.server = server;
  state.crops = crops;
  state.foods = foods;
  state.skills = skills;
  state.economy = economy;
  state.cosmetics = cosmetics;

  renderNav();
  renderPage(currentId());
  setupSearch();
}

function currentId() {
  return location.hash.replace("#", "") || "welcome";
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = state.navigation.groups.map(group => `
    <div class="nav-group">
      <div class="nav-group-title">✦ ${group.title} ✦</div>
      ${group.pages.map(page => `
        <a class="nav-link" data-page="${page.id}" href="#${page.id}">
          <span class="nav-icon">${page.icon}</span>
          <span>${page.label}</span>
        </a>
      `).join("")}
    </div>
  `).join("");
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderPage(id) {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === id);
  });

  let page;
  if (id === "welcome") page = buildWelcomePage();
  else if (id === "join") page = buildJoinPage();
  else if (id === "skills") page = buildSkillsPage();
  else if (id === "crops") page = buildCropsPage();
  else if (id === "food") page = buildFoodPage();
  else if (id === "economy") page = buildEconomyPage();
  else if (id === "cosmetics") page = buildCosmeticsPage();
  else page = state.pages[id];

  const target = document.getElementById("page");
  const toc = document.getElementById("toc");

  if (!page) {
    target.innerHTML = `
      <section class="hero">
        <span class="eyebrow">🍓 StarberrySMP</span>
        <h1>Page not found</h1>
        <p>That path wandered a little too far into the forest.</p>
        <a class="button" href="#welcome">Return home</a>
      </section>`;
    toc.innerHTML = "";
    return;
  }

  target.innerHTML = `
    <div class="breadcrumb">✦ ${page.category} · StarberrySMP</div>
    <section class="hero">
      <span class="eyebrow">${page.eyebrow || page.category}</span>
      <h1>${page.title}</h1>
      <p>${page.intro}</p>
    </section>
    ${page.sections.map(section => {
      const sid = slugify(section.title);
      return `
        <section class="section" id="${sid}">
          <h2><span class="highlight">${section.title}</span></h2>
          ${section.html}
        </section>
      `;
    }).join("")}
  `;

  toc.innerHTML = page.sections.map(section => {
    const sid = slugify(section.title);
    return `<a href="#${sid}">${section.title}</a>`;
  }).join("");

  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function buildWelcomePage() {
  const s = state.server;
  return {
    category: "THE FOREST",
    eyebrow: "The Starberry Forest",
    title: "🍓 Welcome to the Forest",
    intro: s.tagline,
    sections: [
      {
        title: "About Starberry 🌿",
        html: `
          <p>${s.about}</p>
          <div class="quote-card"><strong>${s.motto}</strong></div>
        `
      },
      {
        title: "What can you expect? ⭐",
        html: `
          <div class="feature-grid">
            ${state.skills.map(skill => `
              <div class="feature"><strong>${skill.icon} ${skill.name}</strong><span>${skill.short_description}</span></div>
            `).join("")}
            <div class="feature"><strong>🌱 Custom Crops</strong><span>New crops and foods that expand survival without replacing vanilla gameplay.</span></div>
            <div class="feature"><strong>🌐 Crossplay</strong><span>Designed for both Java and Bedrock players.</span></div>
          </div>
        `
      },
      {
        title: "Joining Information 🌱",
        html: `
          <ul class="clean-list">
            <li><strong>Java IP:</strong> ${s.java_address}</li>
            <li><strong>Bedrock Address:</strong> ${s.bedrock_address}</li>
            <li><strong>Bedrock Port:</strong> ${s.bedrock_port}</li>
            <li><strong>Version:</strong> ${s.version}</li>
          </ul>
          <a class="button" href="#join">View joining guide</a>
        `
      },
      {
        title: "Development 🍓",
        html: `
          <ul class="clean-list">
            ${s.timeline.map(x => `<li><strong>${x.label}:</strong> ${x.value}</li>`).join("")}
          </ul>
          <div class="quote-card">🌱 ${s.development_note}</div>
        `
      }
    ]
  };
}

function buildJoinPage() {
  const s = state.server;
  return {
    category: "GETTING STARTED",
    eyebrow: "Getting Started",
    title: "🌱 How To Join",
    intro: "Everything you need to connect to StarberrySMP from Java or Bedrock.",
    sections: [
      {
        title: "Server Info 🍓",
        html: `
          <ul class="clean-list">
            <li><strong>Java:</strong> <span class="code-line">${s.java_address}</span></li>
            <li><strong>Bedrock:</strong> <span class="code-line">${s.bedrock_address}</span></li>
            <li><strong>Bedrock Port:</strong> <span class="code-line">${s.bedrock_port}</span></li>
            <li><strong>Version:</strong> ${s.version}</li>
          </ul>
        `
      },
      {
        title: "Java 🖥️",
        html: `
          <ol class="steps">
            <li>Open Minecraft: Java Edition.</li>
            <li>Choose <strong>Multiplayer</strong>.</li>
            <li>Select <strong>Add Server</strong>.</li>
            <li>Enter <span class="code-line">${s.java_address}</span>.</li>
            <li>Save the server and join.</li>
          </ol>
        `
      },
      {
        title: "Bedrock 📱",
        html: `
          <ol class="steps">
            <li>Open Minecraft Bedrock Edition.</li>
            <li>Press <strong>Play</strong> and open the <strong>Servers</strong> tab.</li>
            <li>Select <strong>Add Server</strong>.</li>
            <li>Enter <span class="code-line">${s.bedrock_address}</span> and port <span class="code-line">${s.bedrock_port}</span>.</li>
            <li>Save it and join the forest.</li>
          </ol>
        `
      }
    ]
  };
}

function buildSkillsPage() {
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "⭐ Skills",
    intro: "Long-term progression that rewards the things you already do in survival.",
    sections: [
      {
        title: "Core Skills 🌿",
        html: `
          <div class="feature-grid">
            ${state.skills.map(skill => `
              <div class="feature"><strong>${skill.icon} ${skill.name}</strong><span>${skill.description}</span></div>
            `).join("")}
          </div>
        `
      },
      ...state.skills.map(skill => ({
        title: `${skill.name} Milestones ${skill.icon}`,
        html: `
          <ul class="clean-list">
            ${skill.milestones.map(m => `<li><strong>Level ${m.level}:</strong> ${m.reward}</li>`).join("")}
          </ul>
        `
      }))
    ]
  };
}


function creatorCredit(item) {
  if (!item.creator || !item.creator.name) return "";
  const role = item.creator.role || "Modeler";
  const name = item.creator.url
    ? `<a href="${item.creator.url}" target="_blank" rel="noopener">${item.creator.name}</a>`
    : item.creator.name;

  return `<div class="creator-credit"><span>✦</span><span>${role}: <strong>${name}</strong></span></div>`;
}

function mediaMarkup(item, mediaClass = "") {
  const media = item.media || {};
  const fallback = media.fallback_icon || item.icon || "✦";

  if (media.type === "png" && media.src) {
    return `
      <div class="entry-media ${mediaClass}">
        <img class="entry-image" src="${media.src}" alt="${item.name}" loading="lazy"
             onerror="this.closest('.entry-media').innerHTML='<div class=&quot;media-fallback&quot;>${fallback}</div>'">
      </div>`;
  }

  if (media.type === "model" && media.src) {
    const viewerId = `model-${item.id}-${Math.random().toString(36).slice(2,8)}`;
    requestAnimationFrame(() => renderMinecraftModel(viewerId, media, fallback));
    return `
      <div class="entry-media model-media ${mediaClass}">
        <div id="${viewerId}" class="mc-model-viewer" aria-label="${item.name} 3D preview"></div>
        <div class="model-badge">3D MODEL</div>
      </div>`;
  }

  return `<div class="entry-media ${mediaClass}"><div class="media-fallback">${fallback}</div></div>`;
}


async function renderMinecraftModel(viewerId, media, fallback) {
  const viewer = document.getElementById(viewerId);
  if (!viewer) return;

  try {
    const response = await fetch(media.src);
    if (!response.ok) throw new Error(`Could not load model: ${media.src}`);
    const model = await response.json();

    const elements = model.elements || [];
    if (!elements.length) throw new Error("No model elements found.");

    viewer.innerHTML = "";
    const scene = document.createElement("div");
    scene.className = "mc-scene";
    viewer.appendChild(scene);

    // Model JSON usually points to Minecraft resource-pack texture IDs such as
    // "starberry:item/strawberry". A website cannot know where those files live,
    // so data/*.json can supply local mappings in media.textures.
    const textureRefs = model.textures || {};
    const textureOverrides = media.textures || {};

    function resolveTexture(faceTexture) {
      if (!faceTexture) return null;

      let ref = faceTexture;
      const seen = new Set();

      while (typeof ref === "string" && ref.startsWith("#")) {
        const key = ref.slice(1);
        if (seen.has(key)) break;
        seen.add(key);

        // Website-level mapping takes priority.
        if (textureOverrides[key]) return textureOverrides[key];

        ref = textureRefs[key];
        if (!ref) return null;
      }

      if (typeof ref === "string") {
        if (textureOverrides[ref]) return textureOverrides[ref];

        // Direct relative PNG paths work as-is.
        if (ref.endsWith(".png") || ref.startsWith("./") || ref.startsWith("../") || ref.startsWith("assets/")) {
          return ref;
        }

        // Optional convenience: namespace:path -> assets/textures/namespace/path.png
        // This lets exported models work if you mirror the resource-pack path.
        if (ref.includes(":")) {
          const [namespace, path] = ref.split(":");
          return `assets/textures/${namespace}/${path}.png`;
        }

        return `assets/textures/${ref}.png`;
      }

      return null;
    }

    function defaultUV(faceName, from, to) {
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      const dz = to[2] - from[2];

      switch (faceName) {
        case "up":
        case "down": return [0, 0, dx, dz];
        case "north":
        case "south": return [0, 0, dx, dy];
        case "east":
        case "west": return [0, 0, dz, dy];
        default: return [0, 0, 16, 16];
      }
    }

    function createFace(faceName, faceData, from, to, size, center) {
      const face = document.createElement("div");
      face.className = `mc-face mc-${faceName}`;

      const sx = size.x, sy = size.y, sz = size.z;
      const cx = center.x, cy = center.y, cz = center.z;

      let width, height, transform;

      // CSS uses Y downward. Flip Minecraft Y around the 8-unit model center.
      const px = (cx - 8);
      const py = -(cy - 8);
      const pz = (cz - 8);

      if (faceName === "north") {
        width = sx; height = sy;
        transform = `translate3d(${px}px, ${py}px, ${pz - sz/2}px) rotateY(180deg)`;
      } else if (faceName === "south") {
        width = sx; height = sy;
        transform = `translate3d(${px}px, ${py}px, ${pz + sz/2}px)`;
      } else if (faceName === "east") {
        width = sz; height = sy;
        transform = `translate3d(${px + sx/2}px, ${py}px, ${pz}px) rotateY(90deg)`;
      } else if (faceName === "west") {
        width = sz; height = sy;
        transform = `translate3d(${px - sx/2}px, ${py}px, ${pz}px) rotateY(-90deg)`;
      } else if (faceName === "up") {
        width = sx; height = sz;
        transform = `translate3d(${px}px, ${py - sy/2}px, ${pz}px) rotateX(90deg)`;
      } else {
        width = sx; height = sz;
        transform = `translate3d(${px}px, ${py + sy/2}px, ${pz}px) rotateX(-90deg)`;
      }

      const unit = 10;
      face.style.width = `${Math.max(width * unit, 1)}px`;
      face.style.height = `${Math.max(height * unit, 1)}px`;
      face.style.marginLeft = `${-width * unit / 2}px`;
      face.style.marginTop = `${-height * unit / 2}px`;

      // Translate model units -> CSS pixels inside the transform.
      transform = transform.replace(/(-?\d+(?:\.\d+)?)px/g, (_, n) => `${parseFloat(n) * unit}px`);
      face.style.transform = transform;

      const texturePath = resolveTexture(faceData?.texture);
      const uv = faceData?.uv || defaultUV(faceName, from, to);

      if (texturePath) {
        const wrap = document.createElement("div");
        wrap.className = "mc-texture-clip";

        const img = document.createElement("img");
        img.src = texturePath;
        img.alt = "";
        img.draggable = false;

        const u1 = uv[0], v1 = uv[1], u2 = uv[2], v2 = uv[3];
        const uvW = Math.max(Math.abs(u2 - u1), 0.001);
        const uvH = Math.max(Math.abs(v2 - v1), 0.001);

        // Scale the full texture so the requested UV slice fills the face.
        img.style.width = `${(16 / uvW) * 100}%`;
        img.style.height = `${(16 / uvH) * 100}%`;
        img.style.left = `${-(Math.min(u1,u2) / uvW) * 100}%`;
        img.style.top = `${-(Math.min(v1,v2) / uvH) * 100}%`;

        if (u2 < u1) img.style.transform += " scaleX(-1)";
        if (v2 < v1) img.style.transform += " scaleY(-1)";

        img.onerror = () => {
          face.classList.add("mc-missing-texture");
          wrap.innerHTML = `<span>?</span>`;
          console.warn(`Missing model texture: ${texturePath}`);
        };

        wrap.appendChild(img);
        face.appendChild(wrap);
      } else {
        const color = faceData?.color || "#d9627d";
        face.style.background = color;
      }

      return face;
    }

    for (const element of elements) {
      const from = element.from || [0,0,0];
      const to = element.to || [16,16,16];

      const size = {
        x: to[0] - from[0],
        y: to[1] - from[1],
        z: to[2] - from[2]
      };

      const center = {
        x: (from[0] + to[0]) / 2,
        y: (from[1] + to[1]) / 2,
        z: (from[2] + to[2]) / 2
      };

      const faces = element.faces || {};
      const names = ["north","south","east","west","up","down"];

      for (const name of names) {
        // Standard Minecraft JSON may omit invisible faces.
        if (element.faces && !faces[name]) continue;
        scene.appendChild(createFace(name, faces[name] || {}, from, to, size, center));
      }
    }

    // Basic mouse drag rotation.
    let rotX = -24;
    let rotY = 36;
    let dragging = false;
    let lastX = 0, lastY = 0;

    function applyRotation() {
      scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(.82)`;
    }
    applyRotation();

    viewer.addEventListener("pointerdown", e => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      viewer.setPointerCapture?.(e.pointerId);
    });

    viewer.addEventListener("pointermove", e => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * .6;
      rotX -= (e.clientY - lastY) * .45;
      rotX = Math.max(-80, Math.min(80, rotX));
      lastX = e.clientX;
      lastY = e.clientY;
      applyRotation();
    });

    viewer.addEventListener("pointerup", () => dragging = false);
    viewer.addEventListener("pointercancel", () => dragging = false);

  } catch (err) {
    console.error(err);
    viewer.innerHTML = `<div class="media-fallback">${fallback}</div>`;
  }
}

async function renderSimpleModel(canvasId, src, fallback) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error("Model could not be loaded.");
    const model = await response.json();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Starberry's lightweight local model format:
    // { elements:[{from:[x,y,z],to:[x,y,z],color:"#hex"}] }
    // It also accepts ordinary Minecraft/Blockbench cuboid "elements".
    const elements = model.elements || [];
    if (!elements.length) throw new Error("No model elements found.");

    const angleY = -0.62;
    const angleX = 0.48;
    const scale = 8.4;
    const ox = canvas.width / 2;
    const oy = canvas.height / 2 + 18;

    function project(p) {
      let [x,y,z] = p;
      x -= 8; y -= 8; z -= 8;

      const cy = Math.cos(angleY), sy = Math.sin(angleY);
      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;

      const cx = Math.cos(angleX), sx = Math.sin(angleX);
      const ry = y * cx - rz * sx;
      const rz2 = y * sx + rz * cx;

      return [ox + rx * scale, oy - ry * scale, rz2];
    }

    const faces = [];
    for (const el of elements) {
      const f = el.from || [0,0,0];
      const t = el.to || [16,16,16];
      const color = el.color || "#d9627d";
      const pts = {
        "000":[f[0],f[1],f[2]], "100":[t[0],f[1],f[2]],
        "010":[f[0],t[1],f[2]], "110":[t[0],t[1],f[2]],
        "001":[f[0],f[1],t[2]], "101":[t[0],f[1],t[2]],
        "011":[f[0],t[1],t[2]], "111":[t[0],t[1],t[2]]
      };

      [
        ["north", ["000","100","110","010"], .78],
        ["south", ["101","001","011","111"], .95],
        ["west",  ["001","000","010","011"], .68],
        ["east",  ["100","101","111","110"], .88],
        ["up",    ["010","110","111","011"], 1.10],
        ["down",  ["001","101","100","000"], .55]
      ].forEach(([name, ids, shade]) => {
        const p = ids.map(id => project(pts[id]));
        faces.push({
          p,
          depth: p.reduce((a,v)=>a+v[2],0)/4,
          color,
          shade
        });
      });
    }

    faces.sort((a,b) => a.depth - b.depth);

    for (const face of faces) {
      ctx.beginPath();
      ctx.moveTo(face.p[0][0], face.p[0][1]);
      for (let i=1; i<face.p.length; i++) ctx.lineTo(face.p[i][0], face.p[i][1]);
      ctx.closePath();

      const hex = face.color.replace("#","");
      const n = parseInt(hex.length===3 ? hex.split("").map(c=>c+c).join("") : hex,16);
      const r = Math.max(0, Math.min(255, ((n>>16)&255)*face.shade));
      const g = Math.max(0, Math.min(255, ((n>>8)&255)*face.shade));
      const b = Math.max(0, Math.min(255, (n&255)*face.shade));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(15,20,16,.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  } catch (err) {
    console.error(err);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = "64px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(fallback, canvas.width/2, canvas.height/2);
  }
}

function buildCropsPage() {
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "🌱 Custom Crops",
    intro: "Discover new crops that add variety to farming while keeping the system simple and vanilla-friendly.",
    sections: state.crops.map(crop => ({
      title: `${crop.name} ${crop.icon || ""}`,
      html: `
        <div class="catalog-card">
          ${mediaMarkup(crop)}
          <div class="catalog-details">
            <span class="item-tag">CUSTOM CROP</span>
            <h3>${crop.name}</h3>
            <p>${crop.description}</p>
            <div class="stat-row">
              <span><strong>Growth:</strong> ${crop.growth}</span>
              <span><strong>Harvest:</strong> ${crop.harvest}</span>
              <span><strong>Used For:</strong> ${crop.uses.join(", ")}</span>
            </div>
            ${creatorCredit(crop)}
          </div>
        </div>
      `
    }))
  };
}

function buildFoodPage() {
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "🥧 Cooking & Food",
    intro: "Turn crops and familiar ingredients into cozy foods with straightforward recipes.",
    sections: state.foods.map(food => ({
      title: `${food.name} ${food.icon || ""}`,
      html: `
        <div class="catalog-card">
          ${mediaMarkup(food, "food-media")}
          <div class="catalog-details">
            <span class="item-tag">CUSTOM FOOD</span>
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <div class="stat-row">
              <span><strong>Type:</strong> ${food.type}</span>
              <span><strong>Main Ingredient:</strong> ${food.main_ingredient}</span>
              <span><strong>Purpose:</strong> ${food.purpose.join(", ")}</span>
            </div>
            ${creatorCredit(food)}
          </div>
        </div>
        <div class="recipe-card">
          ${food.recipe.map((ingredient, i) => `
            ${i ? '<div class="recipe-plus">+</div>' : ''}
            <div><span>${ingredient.icon}</span><strong>${ingredient.amount}× ${ingredient.name}</strong></div>
          `).join("")}
          <div class="recipe-arrow">→</div>
          <div><span>${food.icon}</span><strong>1× ${food.name}</strong></div>
        </div>
      `
    }))
  };
}

function buildCosmeticsPage() {
  return {
    category: "GETTING STARTED",
    eyebrow: "Collection",
    title: "✨ Cosmetics",
    intro: "Browse cosmetic items and see who created each model.",
    sections: state.cosmetics.map(item => ({
      title: `${item.name}`,
      html: `
        <div class="catalog-card">
          ${mediaMarkup(item, "cosmetic-media")}
          <div class="catalog-details">
            <span class="item-tag">${item.category || "COSMETIC"}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            ${item.availability ? `<div class="stat-row"><span><strong>Availability:</strong> ${item.availability}</span></div>` : ""}
            ${creatorCredit(item)}
          </div>
        </div>
      `
    }))
  };
}

function buildEconomyPage() {
  const e = state.economy;
  return {
    category: "GAMEPLAY",
    eyebrow: "Gameplay",
    title: "💰 Currency & Bank",
    intro: e.intro,
    sections: [
      {
        title: "Currency 💵",
        html: `<p>${e.currency_description}</p><div class="quote-card"><strong>${e.currency_goal}</strong></div>`
      },
      {
        title: "The Bank 🏦",
        html: `
          <p>${e.bank.description}</p>
          <div class="bank-rate">
            <div class="bank-item">
              <span class="bank-icon">${e.bank.input_icon}</span>
              <div><small>SELL</small><strong>${e.bank.input_amount} ${e.bank.input_item}</strong></div>
            </div>
            <div class="bank-arrow">→</div>
            <div class="bank-item payout">
              <span class="bank-icon">${e.bank.output_icon}</span>
              <div><small>RECEIVE</small><strong>$${e.bank.output_amount}</strong></div>
            </div>
          </div>
          <div class="notice"><strong>Bank Rate:</strong> ${e.bank.input_amount} ${e.bank.input_item} = $${e.bank.output_amount}</div>
        `
      },
      {
        title: "Why this baseline? ✦",
        html: `<p>${e.bank.reason}</p>`
      }
    ]
  };
}

function setupSearch() {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");

  const searchable = [];
  state.navigation.groups.forEach(group => {
    group.pages.forEach(p => {
      searchable.push({
        id: p.id,
        label: p.label,
        category: group.title,
        text: `${p.label} ${group.title}`.toLowerCase()
      });
    });
  });

  function update() {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.hidden = true;
      return;
    }
    const matches = searchable.filter(x => x.text.includes(q)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(x => `<a href="#${x.id}"><strong>${x.label}</strong><small>${x.category}</small></a>`).join("")
      : `<div style="padding:12px 14px;color:#91a193;">No matches found.</div>`;
    results.hidden = false;
  }

  input.addEventListener("input", update);
  results.addEventListener("click", () => {
    results.hidden = true;
    input.value = "";
  });

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      input.focus();
    }
    if (e.key === "Escape") {
      results.hidden = true;
      input.blur();
    }
  });
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

window.addEventListener("hashchange", () => renderPage(currentId()));

loadData().catch(error => {
  console.error(error);
  document.getElementById("page").innerHTML = `
    <section class="hero">
      <span class="eyebrow">Setup Needed</span>
      <h1>Couldn’t load the data files.</h1>
      <p>This site uses JSON files, so it needs to be opened through a local web server instead of double-clicking index.html.</p>
      <div class="notice"><strong>Run:</strong> <span class="code-line">python -m http.server 8000</span><br>Then open <span class="code-line">http://localhost:8000</span></div>
    </section>`;
});

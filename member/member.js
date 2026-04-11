const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

const API2 =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/2";

// ảnh fallback
const DEFAULT_IMAGES = [
  "../img/mem/adzit.jpg", // mặc định
  "../img/mem/thuyle.jpg", // cho "thu"
];

// lưu perks
let perksData = [];

/**
 * 🔤 Chuẩn hoá tên (bỏ dấu + lowercase)
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * 📸 Lấy đường dẫn ảnh
 */
function getImagePath(name) {
  return `../img/mem/${encodeURIComponent(name)}.jpg`;
}

/**
 * ❌ fallback theo tên (KHÔNG random)
 */
function handleImageError(img, name) {
  img.onerror = null;

  const n = normalizeName(name);

  if (n.startsWith("thu")) {
    img.src = DEFAULT_IMAGES[1]; // thuy
  } else {
    img.src = DEFAULT_IMAGES[0]; // viet
  }
}

async function loadMembers() {
  const container = document.getElementById("character-grid");

  if (!container) {
    console.error("Không tìm thấy #character-grid");
    return;
  }

  try {
    const [res1, res2] = await Promise.all([fetch(API), fetch(API2)]);

    const rows = await res1.json();
    perksData = await res2.json();

    if (!rows || rows.length === 0) return;

    const members = Object.keys(rows[0]).filter(
      (key) => key !== "Hoa" && key !== "Ảnh",
    );

    members.forEach((name) => {
      const div = document.createElement("div");
      div.className = "character-portrait";

      const imgPath = getImagePath(name);

      div.innerHTML = `
        <img src="${imgPath}" alt="${name}">
      `;

      const img = div.querySelector("img");
      img.onerror = () => handleImageError(img, name);

      div.onclick = () => {
        document
          .querySelectorAll(".character-portrait")
          .forEach((p) => p.classList.remove("selected"));

        div.classList.add("selected");

        const bigImg = document.getElementById("big-portrait-img");
        const charName = document.getElementById("char-name");
        const perksList = document.getElementById("perks-list");

        if (bigImg) {
          bigImg.src = imgPath;
          bigImg.onerror = () => handleImageError(bigImg, name);
        }

        if (charName) {
          charName.textContent = name.toUpperCase();
        }

        const perks = perksData
          .map((row) => row[name])
          .filter((v) => v && v.trim() !== "");

        if (perksList) {
          perksList.innerHTML =
            perks.length > 0
              ? perks.map((p) => `<li>${p}</li>`).join("")
              : `<li>Không có dữ liệu</li>`;
        }

        if (typeof showPopup === "function") {
          showPopup();
        }
      };

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:red; grid-column:1/-1;'>Lỗi tải dữ liệu...</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadMembers);

const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

const API2 =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/2";

// ảnh fallback
const DEFAULT_IMAGES = ["../img/mem/Dzit.jpg", "../img/mem/thuy.jpg"];

// biến đếm để đổi ảnh
let fallbackIndex = 0;

// lưu perks
let perksData = [];

/**
 * 📸 Lấy đường dẫn ảnh
 */
function getImagePath(name) {
  return `../img/mem/${encodeURIComponent(name)}.jpg`;
}

/**
 * ❌ fallback theo thứ tự (người 1 -> img1, người 2 -> img2,...)
 */
function handleImageError(img) {
  const imgFallback = DEFAULT_IMAGES[fallbackIndex % DEFAULT_IMAGES.length];

  fallbackIndex++; // tăng lên cho lần sau

  img.onerror = null; // tránh loop
  img.src = imgFallback;
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
      img.onerror = () => handleImageError(img);

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
          bigImg.onerror = () => handleImageError(bigImg);
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

const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

const API2 =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/2";

// fallback
const DEFAULT_IMAGE_1 = "../img/mem/viet.jpg"; // lần đầu
const DEFAULT_IMAGE_2 = "../img/mem/thuy.jpg"; // các lần sau

let perksData = [];
let firstErrorUsed = false; // chỉ dùng để đánh dấu lần lỗi đầu tiên

/**
 * 📸 path ảnh
 */
function getImagePath(name) {
  return `../img/mem/${encodeURIComponent(name)}.jpg`;
}

/**
 * ❌ fallback chuẩn
 */
function handleImageError(img) {
  img.onerror = null;

  // nếu ảnh này đã có loại fallback → dùng lại (để đồng bộ)
  if (img.dataset.fallbackType) {
    img.src =
      img.dataset.fallbackType === "first" ? DEFAULT_IMAGE_1 : DEFAULT_IMAGE_2;
    return;
  }

  // chưa có → xét lần đầu hay chưa
  if (!firstErrorUsed) {
    img.dataset.fallbackType = "first";
    img.src = DEFAULT_IMAGE_1;
    firstErrorUsed = true;
  } else {
    img.dataset.fallbackType = "default";
    img.src = DEFAULT_IMAGE_2;
  }
}

async function loadMembers() {
  const container = document.getElementById("character-grid");

  if (!container) return;

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

      div.innerHTML = `<img src="${imgPath}" alt="${name}">`;

      const img = div.querySelector("img");

      // 👇 gắn lỗi
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

          // 👇 QUAN TRỌNG: copy fallbackType từ ảnh nhỏ
          if (img.dataset.fallbackType) {
            bigImg.dataset.fallbackType = img.dataset.fallbackType;
          }

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
  }
}

document.addEventListener("DOMContentLoaded", loadMembers);

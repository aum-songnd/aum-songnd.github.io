const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

const API2 =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/2";

// ảnh duy nhất
const IMAGE_PATH = "../img/member/chin.jpg";

// lưu dữ liệu API2
let perksData = [];

async function loadMembers() {
  const container = document.getElementById("character-grid");

  try {
    // load song song 2 API
    const [res1, res2] = await Promise.all([fetch(API), fetch(API2)]);

    const rows = await res1.json();
    perksData = await res2.json();

    if (!rows || rows.length === 0) return;

    const members = Object.keys(rows[0]).filter((key) => key !== "Hoa");

    members.forEach((name) => {
      const div = document.createElement("div");
      div.className = "character-portrait";

      div.innerHTML = `
        <img src="${IMAGE_PATH}" alt="${name}">
      `;

      div.onclick = () => {
        // bỏ selected cũ
        document
          .querySelectorAll(".character-portrait")
          .forEach((p) => p.classList.remove("selected"));

        div.classList.add("selected");

        // set info
        document.getElementById("big-portrait-img").src = IMAGE_PATH;
        document.getElementById("char-name").textContent = name.toUpperCase();

        // 👉 lấy perks từ API2 theo name
        const perks = perksData
          .map((row) => row[name])
          .filter((v) => v && v.trim() !== "");

        // render perks
        document.getElementById("perks-list").innerHTML =
          perks.length > 0
            ? perks.map((p) => `<li>${p}</li>`).join("")
            : `<li>Không có dữ liệu</li>`;

        // mở popup
        showPopup();
      };

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:#f66; grid-column:1/-1;'>Lỗi tải dữ liệu...</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMembers();
});

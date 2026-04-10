const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

// ảnh duy nhất
const IMAGE_PATH = "../img/member/chin.jpg";

async function loadMembers() {
  const container = document.getElementById("character-grid");

  try {
    const res = await fetch(API);
    const rows = await res.json();
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

        // 👉 SET DATA
        document.getElementById("big-portrait-img").src = IMAGE_PATH;
        document.getElementById("char-name").textContent = name.toUpperCase();

        document.getElementById("perks-list").innerHTML = `
          <li>Trở nên nhanh nhẹn khi ướt</li>
          <li>One Big Ol' Masochist</li>
          <li>Clinical Depression Also Included</li>
        `;

        // 👉 GỌI POPUP (đã có trong HTML)
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

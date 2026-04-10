const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

const params = new URLSearchParams(window.location.search);
const memberName = params.get("name");

async function loadProfile() {
  const container = document.getElementById("data");
  const titleEl = document.getElementById("member-name");

  if (!memberName) {
    container.innerHTML = '<p class="loading">Không tìm thấy thành viên.</p>';
    return;
  }

  titleEl.textContent = memberName;

  try {
    const res = await fetch(API);
    const rows = await res.json();

    const trees = rows.filter((row) => row[memberName] === "TRUE");

    if (trees.length === 0) {
      container.innerHTML = '<p class="loading">Chưa có cây nào.</p>';
      return;
    }

    const frag = document.createDocumentFragment();

    trees.forEach((row) => {
      const div = document.createElement("div");
      div.className = "card has-user";
      div.innerHTML = `<div class="name">🌿 ${row["Hoa"]}</div>`;
      frag.appendChild(div);
    });

    const count = document.createElement("p");
    count.className = "count";
    count.textContent = `${trees.length} cây`;

    container.innerHTML = "";
    container.appendChild(frag);
    container.appendChild(count);
  } catch (err) {
    container.innerHTML =
      '<p class="loading">Lỗi tải dữ liệu. Vui lòng thử lại.</p>';
    console.error(err);
  }
}

loadProfile();

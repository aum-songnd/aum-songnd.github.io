const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

let allData = [];

function getName(item) {
  return Object.keys(item)
    .filter((key) => item[key] === "TRUE" && key !== "Hoa")
    .join(", ");
}

function render(data) {
  const container = document.getElementById("data");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML =
      '<p class="loading">Không tìm thấy kết quả nào.</p>';
    return;
  }

  const frag = document.createDocumentFragment();

  data.forEach((item) => {
    const tree = item["Hoa"];
    if (!tree) return;

    const name = getName(item);
    const hasUser = name !== "";
    const imgIndex = String(item.originalIndex).padStart(3, "0");

    const div = document.createElement("div");
    div.className = "card " + (hasUser ? "has-user" : "no-user");

    div.innerHTML = `
      <div class="card-img">
        <img src="https://aum-songnd.github.io/img/hoa/${imgIndex}.webp"
             alt="${tree}"
             onerror="this.src='img/hoa/001.webp'">
      </div>
      <div class="name">${tree}</div>
      <div class="answer">${hasUser ? "👤 " + name : "❌ Chưa có người"}</div>
    `;

    frag.appendChild(div);
  });

  container.appendChild(frag);

  const count = document.createElement("p");
  count.className = "count";
  count.textContent = `${data.length} kết quả`;
  container.appendChild(count);
}

async function loadData() {
  try {
    const res = await fetch(API);
    const json = await res.json();

    allData = json.map((item, index) => ({
      ...item,
      originalIndex: index + 1,
    }));
  } catch (err) {
    document.getElementById("data").innerHTML =
      '<p class="loading">Lỗi tải dữ liệu. Vui lòng thử lại.</p>';
    console.error(err);
  }
}

window.addEventListener("load", async () => {
  const hint = document.getElementById("hint");
  if (hint) {
    hint.style.display = "block";
  }

  document.getElementById("data").innerHTML =
    '<p class="loading">Đang tải dữ liệu...</p>';

  await loadData();

  document.getElementById("data").innerHTML =
    '<p class="loading">Nhập ít nhất 2 ký tự để tìm kiếm.</p>';
});

let debounceTimer;

document.getElementById("search").addEventListener("input", function () {
  clearTimeout(debounceTimer);

  const keyword = this.value.toLowerCase().trim();

  if (keyword.length < 2) {
    document.getElementById("data").innerHTML =
      '<p class="loading">Nhập ít nhất 2 ký tự để tìm kiếm.</p>';
    return;
  }

  debounceTimer = setTimeout(() => {
    const filtered = allData.filter((item) => {
      const tree = (item["Hoa"] || "").toLowerCase();
      const name = getName(item).toLowerCase();

      return tree.includes(keyword) || name.includes(keyword);
    });

    render(filtered);
  }, 250);
});
const API =
  "https://opensheet.elk.sh/1xT9xqRBkRddx9uPv9gNE0WR0M8TcXw14-vtzGQlszrc/1";

async function loadMembers() {
  const container = document.getElementById("data");
  try {
    const res = await fetch(API);
    const rows = await res.json();

    if (!rows || rows.length === 0) {
      container.innerHTML = '<p class="loading">Không có dữ liệu.</p>';
      return;
    }

    const members = Object.keys(rows[0]).filter((key) => key !== "Hoa");

    if (members.length === 0) {
      container.innerHTML =
        '<p class="loading">Không tìm thấy thành viên nào.</p>';
      return;
    }

    const grid = document.createElement("div");
    grid.className = "member-grid";

    members.forEach((name) => {
      const a = document.createElement("a");
      a.className = "member-chip";
      a.textContent = name;
      a.href = `profile.html?name=${encodeURIComponent(name)}`;
      grid.appendChild(a);
    });

    const count = document.createElement("p");
    count.className = "count";
    count.textContent = `${members.length} thành viên`;

    container.innerHTML = "";
    container.appendChild(grid);
    container.appendChild(count);
  } catch (err) {
    container.innerHTML =
      '<p class="loading">Lỗi tải dữ liệu. Vui lòng thử lại.</p>';
    console.error(err);
  }
}

loadMembers();

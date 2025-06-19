<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Asistencia</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f0f0f0; }
    h1 { color: #333; }
    input, select, button { margin: 5px; padding: 8px; }
    .user-list, .attendance-list { margin-top: 20px; }
    .card { background: white; padding: 10px; margin: 5px 0; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .delete-btn { color: red; cursor: pointer; float: right; }
  </style>
</head>
<body>

  <h1>Control de Asistencia</h1>

  <h3>Registrar nuevo usuario</h3>
  <input type="text" id="userName" placeholder="Nombre del usuario" />
  <button onclick="addUser()">Registrar</button>

  <div class="user-list">
    <h3>Usuarios</h3>
    <div id="users"></div>
  </div>

  <h3>Pase de Lista</h3>
  <select id="userSelect"></select>
  <select id="statusSelect">
    <option value="present">Presente</option>
    <option value="late">Tarde</option>
    <option value="absent">Ausente</option>
  </select>
  <button onclick="markAttendance()">Registrar asistencia</button>

  <div class="attendance-list">
    <h3>Asistencia registrada</h3>
    <div id="attendance"></div>
  </div>

  <script>
    const API = "";

    async function fetchData() {
      const res = await fetch(API + "/attendance");
      const data = await res.json();
      renderUsers(data.users);
      renderAttendance(data.attendance, data.users);
    }

    async function addUser() {
      const name = document.getElementById("userName").value;
      if (!name) return alert("Nombre requerido");

      await fetch(API + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      document.getElementById("userName").value = "";
      fetchData();
    }

    async function deleteUser(id) {
      await fetch(API + "/users/" + id, { method: "DELETE" });
      fetchData();
    }

    async function markAttendance() {
      const userId = document.getElementById("userSelect").value;
      const status = document.getElementById("statusSelect").value;
      await fetch(API + "/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status })
      });
      fetchData();
    }

    function renderUsers(users) {
      const userContainer = document.getElementById("users");
      const userSelect = document.getElementById("userSelect");
      userContainer.innerHTML = "";
      userSelect.innerHTML = "";

      users.forEach(u => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `${u.name} <span class="delete-btn" onclick="deleteUser('${u.id}')">🗑️</span>`;
        userContainer.appendChild(div);

        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.name;
        userSelect.appendChild(opt);
      });
    }

    function renderAttendance(records, users) {
      const container = document.getElementById("attendance");
      container.innerHTML = "";
      records.slice().reverse().forEach(r => {
        const user = users.find(u => u.id === r.userId);
        const name = user ? user.name : "Desconocido";
        const div = document.createElement("div");
        div.className = "card";
        div.textContent = `${r.date}: ${name} - ${r.status}`;
        container.appendChild(div);
      });
    }

    fetchData();
  </script>
</body>
</html>

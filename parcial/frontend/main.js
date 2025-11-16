// main.js - SPA para CRUD de Películas (Versión Completa)

const API_URL = 'http://localhost:5000';
let jwt = '';
let userRole = '';
let username = '';

function render(view) {
    document.getElementById('app').innerHTML = view;
}

function navBar() {
    let links = '';
    if (!jwt) {
        links += `<a href="#" onclick="goTo('login')">Login</a>`;
        links += `<a href="#" onclick="goTo('register')">Registro</a>`;
    } else {
        if (userRole === 'admin') links += `<a href="#" onclick="goTo('users')">Usuarios</a>`;
        links += `<a href="#" onclick="goTo('peliculas')">Películas</a>`;
        links += `<a href="#" onclick="logout()">Logout</a>`;
        links += `<span style="margin-left:16px;color:#888;">${username} (${userRole})</span>`;
    }
    return `<nav>${links}</nav>`;
}

function goTo(page) {
    if (page === 'login') render(loginView());
    else if (page === 'register') render(registerView());
    else if (page === 'users') {
        if (jwt && userRole === 'admin') loadUsers();
        else goTo('peliculas');
    }
    else if (page === 'peliculas') {
        if (jwt) loadPeliculas();
        else goTo('login');
    }
}

function showMessage(msg, type='error') {
    return `<div class="${type}">${msg}</div>`;
}

/* LOGIN */
function loginView() {
    return navBar() + `
    <div class="login-page">
        <h2>Login</h2>
        <form onsubmit="event.preventDefault(); login()">
            <input type="text" id="login-username" placeholder="Usuario" required />
            <input type="password" id="login-password" placeholder="Contraseña" required />
            <button class="button" type="submit">Entrar</button>
        </form>
        <div id="login-msg"></div>
        <p>¿No tienes cuenta? <a href="#" onclick="goTo('register')">Regístrate aquí</a></p>
    </div>`;
}

function login() {
    const user = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password })
    })
    .then(r => r.json())
    .then(data => {
        if (data.access_token) {
            jwt = data.access_token;
            username = user;
            try {
                const payload = JSON.parse(atob(jwt.split('.')[1]));
                userRole = payload.role || (payload.additional_claims?.role) || '';
            } catch { userRole = ''; }
            goTo('peliculas');
        } else {
            document.getElementById('login-msg').innerHTML = showMessage(data.error || 'Error de login');
        }
    });
}

/* REGISTRO */
function registerView() {
    return navBar() + `
    <div class="register-page">
        <h2>Registro</h2>
        <form onsubmit="event.preventDefault(); register()">
            <input type="text" id="reg-username" placeholder="Usuario" required />
            <input type="password" id="reg-password" placeholder="Contraseña" required />
            <select id="reg-role">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
            </select>
            <button class="button" type="submit">Registrar</button>
        </form>
        <div id="reg-msg"></div>
        <p>¿Ya tienes cuenta? <a href="#" onclick="goTo('login')">Inicia sesión aquí</a></p>
    </div>`;
}

function register() {
    const user = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    fetch(`${API_URL}/registry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password, role })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('reg-msg').innerHTML =
            data.id ? showMessage('Usuario registrado', 'success')
                    : showMessage(data.error || 'Error al registrar');
    });
}

/* USUARIOS */
function loadUsers() {
    render(navBar() + '<h2>Usuarios</h2><div id="users-list">Cargando...</div>');
    fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${jwt}` } })
    .then(r => r.json())
    .then(data => {
        if (!Array.isArray(data)) {
            document.getElementById('users-list').innerHTML = showMessage(data.error || 'Error al cargar usuarios');
            return;
        }

        let html = `<table><tr><th>ID</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr>`;
        data.forEach(u => {
            html += `<tr>
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>
                    <button onclick="editUser(${u.id}, '${u.username}')">Editar</button>
                    <button onclick="deleteUser(${u.id})">Eliminar</button>
                </td>
            </tr>`;
        });
        html += `</table>
        <h3>Crear usuario</h3>
        <form onsubmit="event.preventDefault(); createUser()">
            <input type="text" id="new-username" placeholder="Usuario" required />
            <input type="password" id="new-password" placeholder="Contraseña" required />
            <select id="new-role">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
            </select>
            <button class="button" type="submit">Crear</button>
        </form>
        <div id="user-msg"></div>`;
        document.getElementById('users-list').innerHTML = html;
    });
}

function createUser() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-role').value;

    fetch(`${API_URL}/registry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        body: JSON.stringify({ username, password, role })
    }).then(() => loadUsers());
}

function editUser(id, username) {
    const newUsername = prompt('Nuevo nombre de usuario:', username);
    if (!newUsername) return;
    const newPassword = prompt('Nueva contraseña (vacío para no cambiar):', '');
    fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        body: JSON.stringify({ username: newUsername, password: newPassword })
    }).then(() => loadUsers());
}

function deleteUser(id) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` }
    }).then(() => loadUsers());
}

/* PELÍCULAS */
function loadPeliculas() {
    render(navBar() + '<h2>Películas</h2><div id="peliculas-list">Cargando...</div>');

    fetch(`${API_URL}/peliculas`, { headers: { 'Authorization': `Bearer ${jwt}` } })
    .then(r => r.json())
    .then(data => {
        let html = '';
        if (Array.isArray(data)) {
            if (data.length > 0) {
                html += `<table>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Director</th>
                        <th>Año</th>
                        <th>Género</th>
                        <th>Duración</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>`;

                data.forEach(p => {
                    html += `<tr>
                        <td>${p.id}</td>
                        <td>${p.titulo}</td>
                        <td>${p.director}</td>
                        <td>${p.anio}</td>
                        <td>${p.genero}</td>
                        <td>${p.duracion} min</td>
                        <td>${p.descripcion}</td>
                        <td>
                            <button onclick="editPelicula(${p.id}, '${p.titulo}', '${p.director}', ${p.anio}, '${p.genero}', ${p.duracion}, \`${p.descripcion}\`)">Editar</button>
                            <button onclick="deletePelicula(${p.id})">Eliminar</button>
                        </td>
                    </tr>`;
                });
                html += `</table>`;
            } else {
                html += `<div class="success">No hay películas registradas.</div>`;
            }
        } else {
            html += showMessage(data.error || 'Error al cargar películas');
        }

        html += `<h3>Registrar nueva película</h3>
        <form onsubmit="event.preventDefault(); createPelicula()">
            <input type="text" id="new-titulo" placeholder="Título" required />
            <input type="text" id="new-director" placeholder="Director" required />
            <input type="number" id="new-anio" placeholder="Año" min="1800" max="2100" required />
            <input type="text" id="new-genero" placeholder="Género" required />
            <input type="number" id="new-duracion" placeholder="Duración (minutos)" min="1" required />
            <textarea id="new-descripcion" placeholder="Descripción" required></textarea>
            <button class="button" type="submit">Crear</button>
        </form>
        <div id="pel-msg"></div>`;

        document.getElementById('peliculas-list').innerHTML = html;
    });
}

function createPelicula() {
    const titulo = document.getElementById('new-titulo').value;
    const director = document.getElementById('new-director').value;
    const anio = parseInt(document.getElementById('new-anio').value);
    const genero = document.getElementById('new-genero').value;
    const duracion = parseInt(document.getElementById('new-duracion').value);
    const descripcion = document.getElementById('new-descripcion').value;

    fetch(`${API_URL}/peliculas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        body: JSON.stringify({ titulo, director, anio, genero, duracion, descripcion })
    }).then(() => loadPeliculas());
}

function editPelicula(id, titulo, director, anio, genero, duracion, descripcion) {
    const newTitulo = prompt('Nuevo título:', titulo);
    if (newTitulo === null) return;
    const newDirector = prompt('Nuevo director:', director);
    if (newDirector === null) return;
    const newAnio = prompt('Nuevo año:', anio);
    if (newAnio === null) return;
    const newGenero = prompt('Nuevo género:', genero);
    if (newGenero === null) return;
    const newDuracion = prompt('Nueva duración (minutos):', duracion);
    if (newDuracion === null) return;
    const newDescripcion = prompt('Nueva descripción:', descripcion);
    if (newDescripcion === null) return;

    fetch(`${API_URL}/peliculas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        body: JSON.stringify({
            titulo: newTitulo,
            director: newDirector,
            anio: parseInt(newAnio),
            genero: newGenero,
            duracion: parseInt(newDuracion),
            descripcion: newDescripcion
        })
    }).then(() => loadPeliculas());
}

function deletePelicula(id) {
    if (!confirm('¿Seguro que quieres eliminar esta película?')) return;
    fetch(`${API_URL}/peliculas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` }
    }).then(() => loadPeliculas());
}

/* LOGOUT */
function logout() {
    jwt = '';
    userRole = '';
    username = '';
    goTo('login');
}

window.onload = () => goTo('login');

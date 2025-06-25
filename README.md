# Banco Albora - Frontend

Este proyecto corresponde al frontend de la plataforma bancaria digital desarrollada con React y Vite. Permite la gestión visual y la interacción de usuarios, administradores y organizaciones con los diferentes módulos del sistema bancario, tales como cuentas, tarjetas, préstamos, seguros, inversiones, servicios, notificaciones y conversión de divisas. Incluye paneles diferenciados para cada tipo de usuario, autenticación segura y una experiencia moderna y responsiva.

---

## Integración con el Backend

Este frontend está diseñado para consumir la API REST del backend de Banco Albora (Node.js + MongoDB). Es necesario tener el backend en funcionamiento y configurar la URL base de la API para que el frontend pueda comunicarse correctamente.

Puedes definir la URL de la API en un archivo `.env` en la raíz del frontend, por ejemplo:

```
VITE_API_URL=http://localhost:3001/api
```

Asegúrate de que la variable coincida con la dirección y puerto donde corre tu backend.

---

## Funcionalidades principales ⚙

### Gestión de usuarios ✔
- Registro y autenticación de clientes, administradores y organizaciones.
- Edición de perfil, cambio de contraseña y recuperación de acceso.
- Visualización y gestión de cuentas favoritas y afiliaciones a organizaciones.

### Panel administrativo y de usuario 🖥️
- Paneles personalizados para administradores, usuarios y organizaciones.
- Control de clientes, transferencias, depósitos y favoritos.
- Visualización de movimientos financieros y detalles de cuentas.

### Módulo de Seguros 🛡️
- Solicitud y consulta de seguros.
- Visualización de solicitudes y gestión administrativa.

### Conversión de moneda 💸
- Conversión de divisas en tiempo real (USD, EUR, etc).

### Transacciones y Préstamos 🏦
- Creación y visualización de depósitos, retiros y transferencias.
- Solicitud y seguimiento de préstamos.

### Gestión de Organizaciones 🏢
- Registro y administración de organizaciones.
- Visualización de cuentas y depósitos de organizaciones.

### Notificaciones 📰
- Notificaciones en tiempo real sobre movimientos y eventos relevantes.

### Gestión de Tarjetas 💳
- Solicitud, activación y visualización de tarjetas de débito y crédito.

### Gestión de servicios e inversiones 🧾
- Visualización y gestión de productos, servicios y pólizas de inversión.

---

## 🛠️ Tecnologías utilizadas

- React
- Vite
- JavaScript (ES6+)
- CSS Modules
- Axios (para consumo de API)
- Context API y Hooks personalizados

---

## Estructura del proyecto

```
src/
  App.jsx
  main.jsx
  index.css
  routes.jsx
  components/
    ... (componentes reutilizables y específicos por módulo)
  pages/
    ... (páginas agrupadas por funcionalidad)
  services/
    api.jsx
    index.js
  shared/
    hooks/
    validators/
public/
  logo_albora.png
```

---

## Instrucciones de instalación 🖥

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO_FRONTEND>
   ```

2. **Abrir una terminal en la carpeta del proyecto.**

3. **Configurar la URL de la API:**
   - Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
     ```env
     VITE_API_URL=http://localhost:3001/api
     ```
   - Cambia la URL si tu backend corre en otra dirección o puerto.

4. **Instalar dependencias:**
   ```bash
   npm install
   ```

5. **Ejecutar el proyecto:**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador:**
   - Usualmente en `http://localhost:5173/` (según indique la terminal).
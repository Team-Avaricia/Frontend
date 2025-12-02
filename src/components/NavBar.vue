<script setup lang="ts">

const links = [
  { path: '/', label: 'Inicio', name: 'landing' },
  { path: '/registrarse', label: 'Registrarse', name: 'register' },
  { path: '/iniciar-sesion', label: 'Iniciar sesión', name: 'login' },
  { path: '/panel-control', label: 'Panel de control', name: 'dashboard' },
  { path: '/ingresos', label: 'Ingresos', name: 'incoming' },
  { path: '/egresos', label: 'Egresos', name: 'outcoming' }
]
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h1>Riwi Wallet</h1>
      </div>
      <ul class="navbar-links">
        <li v-for="link in links" :key="link.name">
          <RouterLink
            :to="link.path"
            :class="{ active: $route.name === link.name }"
            class="nav-link"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #333;
  padding: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  height: 70px;
}

.navbar-brand h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

.navbar-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 5px;
  align-items: center;
}

.nav-link {
  color: #e0e0e0;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: inline-block;
  font-weight: 500;
  font-size: 15px;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #555;
  color: white;
}

.nav-link.active {
  background-color: #4caf50;
  color: white;
}

@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 20px;
  }

  .navbar-links {
    gap: 3px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }

  .navbar-brand h1 {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    height: auto;
    min-height: 70px;
    flex-wrap: wrap;
    padding: 10px 15px;
    justify-content: center;
    gap: 10px;
  }

  .navbar-brand {
    width: 100%;
    text-align: center;
  }

  .navbar-brand h1 {
    font-size: 18px;
  }

  .navbar-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>


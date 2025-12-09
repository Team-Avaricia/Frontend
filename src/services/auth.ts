export const authService = {
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    // Limpiar token de autenticación
    localStorage.removeItem('authToken');
    // Limpiar información del usuario
    localStorage.removeItem('userInfo');
    // Limpiar cualquier otro dato de sesión
    localStorage.removeItem('user');
  },
};




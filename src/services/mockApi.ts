// Servicio Mock para simular respuestas del backend
// Este archivo será reemplazado cuando el backend esté disponible

interface User {
  id: string;
  name: string;
  lastName: string;
  userName: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  user: User;
}

// Base de datos simulada en memoria
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan',
    lastName: 'Pérez',
    userName: 'juanp',
    email: 'juan@ejemplo.com',
  },
  {
    id: '2',
    name: 'María',
    lastName: 'García',
    userName: 'mariag',
    email: 'maria@ejemplo.com',
  },
];

// Contraseñas mockeadas (en producción NUNCA almacenar así)
const mockPasswords: Record<string, string> = {
  'juan@ejemplo.com': 'Password123!',
  'juanp': 'Password123!',
  'maria@ejemplo.com': 'Password456!',
  'mariag': 'Password456!',
};

// Simular delay de red
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  async login(credentials: { email?: string; userName?: string; password: string }): Promise<LoginResponse> {
    await delay();

    const identifier = credentials.email || credentials.userName || '';
    const password = credentials.password;

    // Buscar usuario
    const user = mockUsers.find(
      u => u.email === identifier || u.userName === identifier
    );

    if (!user) {
      throw {
        response: {
          data: {
            message: 'Usuario no encontrado. Por favor verifica tus credenciales.',
          },
          status: 404,
        },
      };
    }

    // Verificar contraseña
    const storedPassword = mockPasswords[identifier];
    if (storedPassword !== password) {
      throw {
        response: {
          data: {
            message: 'Contraseña incorrecta. Por favor intenta de nuevo.',
          },
          status: 401,
        },
      };
    }

    // Login exitoso
    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user,
    };
  },

  async register(userData: {
    name: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
  }): Promise<RegisterResponse> {
    await delay();

    // Verificar si el email ya existe
    const emailExists = mockUsers.some(u => u.email === userData.email);
    if (emailExists) {
      throw {
        response: {
          data: {
            message: 'Este correo electrónico ya está registrado. Por favor usa otro o inicia sesión.',
          },
          status: 409,
        },
      };
    }

    // Verificar si el username ya existe
    const userNameExists = mockUsers.some(u => u.userName === userData.userName);
    if (userNameExists) {
      throw {
        response: {
          data: {
            message: 'Este nombre de usuario ya está en uso. Por favor elige otro.',
          },
          status: 409,
        },
      };
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
    };

    // Agregar a la "base de datos" simulada
    mockUsers.push(newUser);
    mockPasswords[userData.email] = userData.password;
    mockPasswords[userData.userName] = userData.password;

    console.log('✅ Usuario registrado (Mock):', newUser);
    console.log('📊 Usuarios actuales:', mockUsers);

    return {
      message: 'Usuario creado exitosamente',
      user: newUser,
    };
  },

  // Método para obtener el usuario actual (usando el token)
  async getCurrentUser(): Promise<User> {
    await delay(300);

    const token = localStorage.getItem('authToken');
    if (!token) {
      throw {
        response: {
          data: {
            message: 'No autenticado',
          },
          status: 401,
        },
      };
    }

    // Extraer ID del token mock
    const match = token.match(/mock-jwt-token-(\d+)-/);
    const userId = match ? match[1] : '1';

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw {
        response: {
          data: {
            message: 'Usuario no encontrado',
          },
          status: 404,
        },
      };
    }

    return user;
  },
};

// Flag para activar/desactivar el modo mock
export const USE_MOCK_API = true;


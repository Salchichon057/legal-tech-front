# LegalTech Platform - Frontend

Aplicación moderna y responsiva Next.js 15 para gestión de casos legales con autenticación AWS Cognito, proporcionando interfaz intuitiva para operaciones de casos y gestión de documentos.

## Stack Tecnológico

| Tecnología          | Versión | Propósito                                                  |
| ------------------- | ------- | ---------------------------------------------------------- |
| **Next.js**         | 15.1.4  | Framework React con App Router, Server Components, SSR/SSG |
| **TypeScript**      | 5.x     | Seguridad de tipos, experiencia de desarrollo mejorada     |
| **React**           | 18.3.1  | Librería UI con hooks y server components                  |
| **Tailwind CSS**    | 4.x     | Framework CSS utility-first, diseño mobile-first           |
| **shadcn/ui**       | Latest  | Componentes UI accesibles construidos sobre Radix UI       |
| **i18next**         | 25.x    | Internacionalización (Inglés/Español)                      |
| **Axios**           | 1.13.2  | Cliente HTTP con interceptores para comunicación API       |
| **Zod**             | 4.x     | Validación de esquemas para formularios y respuestas API   |
| **React Hook Form** | 7.x     | Validación de formularios performante y gestión de estado  |

## Arquitectura

### Estructura de la Aplicación

```
app/
├── layout.tsx                 # Layout raíz con proveedor I18n
├── page.tsx                   # Página de inicio
├── globals.css                # Estilos globales, base Tailwind
│
├── login/                     # Rutas de autenticación
│   └── page.tsx               # Página de login
├── register/
│   └── page.tsx               # Página de registro
├── dashboard/
│   └── page.tsx               # Dashboard con lista de casos
└── cases/
    └── [id]/
        └── page.tsx           # Detalle de caso con gestión de archivos

components/
├── ui/                        # Componentes UI base (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── toast.tsx
│   └── ...
│
├── shared/                    # Componentes de negocio compartidos
│   ├── I18nProvider.tsx       # Inicialización i18n lado cliente
│   └── LanguageSwitcher.tsx   # Componente de cambio de idioma
│
└── providers/
    └── client-toaster.tsx     # Proveedor de notificaciones toast

modules/                       # Módulos funcionales
├── auth/
│   ├── services/
│   │   └── authService.ts     # Cliente API de autenticación
│   └── types.ts               # Tipos relacionados con auth
│
├── cases/
│   ├── services/
│   │   └── casesService.ts    # Cliente API de casos
│   └── types.ts               # Tipos relacionados con casos
│
└── files/
    ├── services/
    │   └── filesService.ts    # Cliente API de archivos
    ├── components/
    │   ├── FileUpload.tsx     # Componente drag & drop upload
    │   └── FileList.tsx       # Listado de archivos con acciones
    └── types.ts               # Tipos relacionados con archivos

lib/
├── api-client.ts              # Instancia Axios con interceptores
├── i18n.ts                    # Configuración i18next
├── utils.ts                   # Funciones utilidad (cn, etc.)
└── validators/
    ├── auth.validator.ts      # Esquemas Zod para auth
    └── case.validator.ts      # Esquemas Zod para casos

locales/
├── en/
│   └── translation.json       # Traducciones en inglés
└── es/
    └── translation.json       # Traducciones en español
```

### Arquitectura de Componentes

```
┌─────────────────────────────────────┐
│         Layout Raíz                 │
│  (I18nProvider, Toaster)            │
└──────────┬──────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐    ┌────▼─────┐
│Páginas │    │Páginas   │
│Públicas│    │Protegidas│
└────────┘    └────┬─────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐    ┌────▼────┐
    │Dashboard │    │Detalle  │
    │          │    │de Caso  │
    └──────────┘    └────┬────┘
                         │
                    ┌────▼─────┐
                    │Gestión   │
                    │Archivos  │
                    └──────────┘
```

### Flujo de Datos

```
┌──────────┐
│ Acciones │
│  Usuario │
└────┬─────┘
     │
     ▼
┌──────────────┐
│  Componente  │
│    React     │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│   Capa de    │
│  Servicios   │
│(Cliente API) │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│    Axios     │
│Interceptores │
│(Auth, Error) │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│   Backend    │
│     API      │
└──────────────┘
```

## Características Principales

### Sistema de Autenticación

**Flujo de Registro:**

1. Usuario envía formulario de registro con email, contraseña, nombre, teléfono
2. Validación Zod en lado del cliente
3. Llamada API a endpoint proxy `/auth/register`
4. Login automático después de registro exitoso
5. Token JWT almacenado en memoria y cookies
6. Redirección a dashboard

**Flujo de Login:**

1. Usuario envía credenciales (email, contraseña)
2. Validación lado cliente con Zod
3. Llamada API a `/auth/login` vía proxy backend
4. Token recibido y almacenado
5. Espera de 100ms para validación de token
6. Redirección a dashboard

**Gestión de Tokens:**

- Access token almacenado en headers por defecto de Axios
- Refresh automático de token en respuestas 401
- Manejo de expiración de token con refresh token
- Logout limpia tokens y redirige a login

**Características de Seguridad:**

- Validación lado cliente antes de llamadas API
- Requisitos de fortaleza de contraseña aplicados
- Mensajes de error localizados
- Solo HTTPS en producción

### Gestión de Casos

**Características del Dashboard:**

- Listar todos los casos del usuario con paginación
- Crear nuevo caso con validación de formulario
- Búsqueda y filtrado por estado
- Layout de tarjetas responsivo
- Estados de carga y manejo de errores
- Estado vacío con call-to-action

**Página de Detalle de Caso:**

- Ver información del caso (título, descripción, estado, fecha de creación)
- Badge de estado con codificación de color
- Sección de gestión de archivos
- Breadcrumbs de navegación
- Layout responsivo

**Operaciones de Casos:**

- Crear: Formulario modal con validación
- Actualizar: Edición inline (característica futura)
- Eliminar: Eliminación lógica con confirmación
- Actualización de estado: Selección dropdown

### Gestión de Archivos

**Características de Upload:**

- Interfaz drag and drop
- Fallback de navegador de archivos
- Validación lado cliente (tipo, tamaño)
- Vista previa de archivo antes de upload
- Feedback de progreso de upload
- Notificaciones toast de éxito/error

**Características de Descarga:**

- Generación de URL prefirmada desde backend
- Descarga directa desde S3
- Indicación de progreso de descarga
- Iconos de tipo de archivo (PDF, Word, Imágenes)

**Operaciones de Archivos:**

- Upload: Drag & drop o navegador
- Descarga: Un clic con URL prefirmada
- Eliminar: Diálogo de confirmación, eliminación lógica
- Listar: Lista de archivos filtrable, ordenable

**Validación:**

- Tipos permitidos: PDF, Word, Imágenes
- Tamaño máximo: 10 MB
- Validación de tipo MIME
- Mensajes de error localizados

### Internacionalización (i18n)

**Idiomas Soportados:**

- Inglés (en)
- Español (es)

**Características:**

- Detección automática de idioma del navegador
- Selector de idioma en header
- Selección de idioma persistente (localStorage)
- Todo el texto de UI traducido
- Localización de fecha/hora
- Formato de números

**Cobertura de Traducción:**

- Páginas de autenticación
- Dashboard y páginas de casos
- Gestión de archivos
- Mensajes de error
- Etiquetas de estado
- Labels y placeholders de formularios

### Diseño Responsivo

**Breakpoints:**

- Móvil: < 768px
- Tablet: 768px - 1024px
- Escritorio: > 1024px

**Optimizaciones Móviles:**

- Menú hamburguesa para navegación
- Layouts de tarjetas apiladas
- Botones táctiles friendly (mín 44px)
- Imágenes optimizadas
- Animaciones reducidas

## Configuración de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Configuración API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Configuración de Aplicación
NEXT_PUBLIC_APP_NAME=LegalTech Platform
NEXT_PUBLIC_DEFAULT_LOCALE=es
```

**Variables de Entorno:**

- `NEXT_PUBLIC_API_URL`: URL base de la API backend
- `NEXT_PUBLIC_APP_NAME`: Nombre de la aplicación para branding
- `NEXT_PUBLIC_DEFAULT_LOCALE`: Idioma por defecto (en/es)

## Instalación y Configuración

### Requisitos Previos

- Node.js 18.x o superior
- Gestor de paquetes pnpm (recomendado)
- API Backend corriendo (ver README del backend)

### Pasos de Instalación

1. **Instalar dependencias:**

```bash
pnpm install
```

2. **Configurar variables de entorno:**

```bash
cp .env.example .env.local
# Editar .env.local con tu configuración
```

3. **Iniciar servidor de desarrollo:**

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts de Desarrollo

```bash
# Iniciar servidor de desarrollo con hot reload
pnpm run dev

# Construir para producción
pnpm run build

# Iniciar servidor de producción (requiere build primero)
pnpm run start

# Ejecutar ESLint
pnpm run lint
```

## Componentes de Interfaz de Usuario

### Componentes shadcn/ui

Componentes pre-configurados y accesibles construidos sobre Radix UI:

- **Button**: Variantes primary, secondary, outline, ghost
- **Input**: Input de texto con label y estados de error
- **Card**: Contenedor de contenido con header, body, footer
- **Badge**: Indicadores de estado con variantes de color
- **Dialog**: Diálogos modales para formularios y confirmaciones
- **Toast**: Sistema de notificaciones para feedback del usuario
- **Select**: Selección dropdown
- **Checkbox**: Input booleano
- **Alert Dialog**: Diálogos de confirmación

### Componentes Personalizados

**FileUpload:**

- Zona drag and drop
- Integración con navegador de archivos
- Tarjeta de vista previa de archivo
- Botón de upload con estado de carga
- Funcionalidad de limpiar/cancelar

**FileList:**

- Tarjetas de archivo con metadata
- Botones de descarga y eliminar
- Iconos de tipo de archivo
- Estado vacío
- Skeleton de carga

**LanguageSwitcher:**

- Iconos de banderas para idiomas
- Menú dropdown
- Indicador de idioma activo
- Selección persistente

## Integración con API

### Configuración del Cliente API

Instancia centralizada de Axios con interceptores:

```typescript
// Interceptor de request: Añadir token de auth
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: Manejar errores y refresh de token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar refresh de token
      await refreshToken();
      // Reintentar request original
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Patrón de Capa de Servicios

Todas las llamadas API abstraídas en clases de servicio:

```typescript
// authService.ts
class AuthService {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  }

  async register(data: RegisterFormData): Promise<RegisterResponse> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  }
}

export const authService = new AuthService();
```

### Manejo de Errores

Manejo consistente de errores en toda la aplicación:

```typescript
try {
  await casesService.createCase(data);
  toast({
    title: t("cases.createSuccess"),
    description: t("cases.caseCreated"),
  });
} catch (error: any) {
  toast({
    title: t("errors.createFailed"),
    description: error.message || t("errors.tryAgain"),
    variant: "destructive",
  });
}
```

## Validación de Formularios

### Esquemas Zod

Validación type-safe con Zod:

```typescript
// auth.validator.ts
export const loginSchema = z.object({
  email: z.string().email("Dirección de email inválida"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### Integración con React Hook Form

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(loginSchema),
});

const onSubmit = async (data: LoginFormData) => {
  // Datos del formulario ya validados
  await authService.login(data);
};
```

## Gestión de Estado

### Estado de Componentes

Estado local con useState para estado de UI:

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [cases, setCases] = useState<Case[]>([]);
```

### Estado del Servidor

Fetching de datos en useEffect con limpieza apropiada:

```typescript
useEffect(() => {
  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await casesService.getCases();
      setCases(data);
    } catch (error) {
      setError("Error al cargar casos");
    } finally {
      setLoading(false);
    }
  };

  loadCases();
}, []);
```

### Estado de Formularios

React Hook Form para estado de formularios complejos:

```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: zodResolver(createCaseSchema),
  defaultValues: {
    title: "",
    description: "",
    status: CaseStatus.NEW,
  },
});
```

## Enfoque de Estilos

### Tailwind CSS

Enfoque utility-first con diseño responsivo:

```tsx
<div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Login</CardTitle>
    </CardHeader>
  </Card>
</div>
```

### Tokens de Diseño

Espaciado, colores, tipografía consistentes:

- Espaciado: Unidad base 4px (1 = 4px)
- Colores: Primary, secondary, destructive, muted
- Tipografía: Familia de fuente Inter
- Sombras: Elevación sutil
- Bordes: Esquinas redondeadas, bordes sutiles

### Soporte de Modo Oscuro

Variables CSS para cambio de tema (característica futura):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}
```

## Optimización de Performance

### Code Splitting

Code splitting automático con App Router de Next.js:

```typescript
// Imports dinámicos para componentes pesados
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
});
```

### Optimización de Imágenes

Componente Image de Next.js para imágenes optimizadas:

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={200} height={50} priority />;
```

### Lazy Loading

Diferir recursos no críticos:

```typescript
// Lazy load de componentes below-the-fold
const FileManager = dynamic(() => import("./FileManager"), {
  ssr: false,
});
```

## Mejores Prácticas de Seguridad

### Prevención XSS

- Sanitizar inputs de usuario
- Usar escapado built-in de React
- Validar y sanitizar en backend

### Protección CSRF

- Política same-origin
- CORS configurado apropiadamente
- Autenticación basada en tokens

### Política de Seguridad de Contenido

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
];
```

## Despliegue

### Build de Producción

```bash
# Crear build optimizado de producción
pnpm run build

# Iniciar servidor de producción
pnpm run start
```

### Despliegue en Vercel

Plataforma recomendada para aplicaciones Next.js:

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Despliegue automático en push a main
4. Despliegues de preview para pull requests

### Configuración por Entorno

**Desarrollo:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Staging:**

```env
NEXT_PUBLIC_API_URL=https://api-staging.legaltech.com
```

**Producción:**

```env
NEXT_PUBLIC_API_URL=https://api.legaltech.com
```

## Decisiones Arquitectónicas

### ¿Por qué Next.js 15 App Router?

**Beneficios:**

- Server Components reducen tamaño de bundle del cliente
- Performance mejorada con streaming SSR
- Fetching de datos simplificado con componentes async
- Mejor SEO con server-side rendering
- Routing basado en archivos con layouts anidados

**Compromisos:**

- Curva de aprendizaje para nuevos paradigmas
- Migración desde Pages Router requiere refactorización

### ¿Por qué Tailwind CSS sobre CSS-in-JS?

**Beneficios:**

- Cero overhead en runtime
- Tamaños de bundle más pequeños
- Desarrollo más rápido con clases utility
- Sistema de diseño consistente
- Diseño responsivo mobile-first

**Compromisos:**

- Nombres de clase verbose
- Curva de aprendizaje para clases utility

### ¿Por qué shadcn/ui sobre Material-UI?

**Beneficios:**

- Componentes copy-paste (sin paquete npm)
- Control total sobre código de componentes
- Tamaño de bundle más pequeño
- Construido sobre primitivas accesibles Radix UI
- Fácil customización

**Compromisos:**

- Actualizaciones manuales de componentes
- Menos componentes pre-construidos

### ¿Por qué Axios sobre Fetch?

**Beneficios:**

- Interceptores para manejo de auth y errores
- Transformación de request/response
- Parsing automático de JSON
- Mejor manejo de errores
- Cancelación de requests

**Compromisos:**

- Dependencia adicional
- Bundle ligeramente más grande

## Solución de Problemas

### Problemas Comunes

**Errores de Conexión API:**

```bash
# Verificar que NEXT_PUBLIC_API_URL sea correcto
# Revisar que el backend esté corriendo
# Confirmar que CORS esté configurado apropiadamente
```

**Errores de Build:**

```bash
# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules
pnpm install
```

**i18n No Carga:**

```bash
# Verificar que archivos de locale existan
# Revisar inicialización de i18n en I18nProvider
# Confirmar código de idioma en localStorage
```

### Tips de Desarrollo

**Problemas de Hot Reload:**

- Reiniciar servidor de dev
- Limpiar caché del navegador
- Revisar errores de sintaxis

**Estado No Se Actualiza:**

- Verificar que actualizaciones de estado sean inmutables
- Revisar dependencias de useEffect
- Confirmar que React DevTools muestre cambios de estado

## Accesibilidad

### Cumplimiento WCAG 2.1 Nivel AA

**Características:**

- Elementos HTML semánticos
- Labels ARIA cuando sea necesario
- Soporte de navegación por teclado
- Indicadores de foco visibles
- Ratios de contraste de color cumplidos
- Compatible con lectores de pantalla

**Pruebas:**

- Puntuación de accesibilidad Lighthouse > 90
- Validación con axe DevTools
- Pruebas de navegación solo con teclado

## Licencia

UNLICENSED - Proyecto privado

## Autor

**Steve Roger Castillo Robles**

- GitHub: [https://github.com/Salchichon057](https://github.com/Salchichon057)
- LinkedIn: [https://www.linkedin.com/in/steve-roger-castillo-robles057](https://www.linkedin.com/in/steve-roger-castillo-robles057)

## Historial de Versiones

**0.1.0** - Release inicial

- Autenticación de usuarios con AWS Cognito
- Dashboard de gestión de casos
- Página de detalle de caso con gestión de archivos
- Internacionalización (Inglés/Español)
- Diseño responsivo

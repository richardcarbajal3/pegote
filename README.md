# PEGOTE

Marketplace de stickers ilustrados peruanos. La autoría siempre queda con el artista.

Diseño basado en `pegote.html` (paleta papel/tomate/mostaza/azul, tipografías
Bungee + Fraunces + DM Mono).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** para estilos
- **Prisma** + SQLite (dev) / Postgres (prod)
- **Auth.js v5** con login de Google
- API routes para upload, checkout y download
- Sin dependencias externas para pagos todavía: el checkout está mockeado
  (crea la orden como `paid`). Cuando se conecte Yape/Plin/Stripe, basta con
  cambiar `app/api/checkout/route.ts` y agregar el webhook.

## Cómo correrlo (otra sesión)

```bash
# 1. Instalar
npm install

# 2. Variables de entorno
cp .env.example .env
# editar .env y rellenar AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET

# 3. Base de datos (SQLite en dev)
npx prisma db push

# 4. Datos iniciales (los 8 stickers del modelo + 8 artistas demo)
npm run db:seed

# 5. Dev server
npm run dev
# → http://localhost:3000
```

### Configurar Google OAuth

1. Ir a https://console.cloud.google.com/apis/credentials
2. **Create Credentials → OAuth client ID → Web application**
3. **Authorized JavaScript origins**: `http://localhost:3000`
4. **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5. Copiar `Client ID` → `AUTH_GOOGLE_ID` y `Client Secret` → `AUTH_GOOGLE_SECRET` en `.env`

Generar `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Estructura

```
app/
├── page.tsx                    # Landing (mirror de pegote.html)
├── galeria/                    # Lista de stickers + búsqueda
├── sticker/[id]/               # Detalle + comprar
├── artista/[username]/         # Perfil público de artista
├── vender/                     # Info para artistas
├── login/                      # Login con Google
├── onboarding/                 # Elegir @username + activar artista
├── dashboard/
│   ├── page.tsx                # Resumen, stickers, compras
│   ├── upload/                 # Subir nuevo sticker
│   └── ventas/                 # Tabla de ventas (artistas)
├── api/
│   ├── auth/[...nextauth]/     # Auth.js handlers
│   ├── stickers/upload/        # POST: nuevo sticker
│   ├── checkout/               # POST: crear orden
│   └── download/[id]/          # GET: descargar (verifica compra)
└── components/                 # Marquee, Nav, Footer, StickerCard, etc.

lib/
├── prisma.ts                   # Cliente único de Prisma
└── seed-data.ts                # Los 8 stickers del modelo

prisma/
├── schema.prisma               # User, Sticker, Order, OrderItem...
└── seed.ts                     # Carga los datos iniciales

auth.ts                         # Config de Auth.js v5
middleware.ts                   # Protege /dashboard, /onboarding, /api/checkout
```

## Flujo del usuario

1. **Visitante** → ve la landing, navega la galería, abre un sticker.
2. Click en "Comprar" → redirige a `/login` (Google).
3. Primer login → onboarding: elige `@username`, opcionalmente activa "soy artista".
4. **Comprador**: paga (mock por ahora), recibe acceso a `/api/download/[id]`.
5. **Artista**: dashboard con upload, lista de stickers y ventas. Cobra 70%.

## Qué falta para producción

- Conectar pagos reales: Yape API / Stripe / Culqi → ver comentario en
  `app/api/checkout/route.ts`.
- Mover uploads de `public/uploads/` a S3 / R2 con signed URLs (los archivos
  comprados no deberían ser servidos públicamente como hoy).
- Pasar `provider = "sqlite"` a `"postgresql"` en `prisma/schema.prisma`.
- Webhooks de pago para confirmar `status: "paid"`.
- Sistema de payout para artistas (transferencias semanales).
- Email transaccional (Resend / Postmark) al confirmar compra.
- Tests (Playwright para flujo de compra, Vitest para API).

## Notas

- El checkout actual NO cobra dinero — solo registra la orden. Esto es intencional
  para poder probar el flujo completo sin pasarela de pagos.
- Los SVGs del seed se usan como `previewUrl` y `fileUrl` (mismo string). En
  prod separarías: preview reducido en CDN, archivo full en bucket privado.
- `pegote.html` se conserva en la raíz como referencia visual del diseño.

En el proyecto ipaMarcosPaz debe hacerse estos cambios.

1. Seguridad previa
    Las claves que aparecieron en el contexto deben rotarse antes de producción:

 * SUPABASE_SERVICE_ROLE_KEY
 * PLATFORM_SSO_SECRET
La anon key puede ser pública, pero conviene regenerarla si fue expuesta junto con secretos.

2. Ajuste necesario en IglesiasNet
Antes de modificar el sitio, el sistema central debe exigir autenticación del cliente.

Actualmente /auth/token acepta:
    {
  "code": "...",
  "client_id": "1ipa",
  "redirect_uri": "..."
    }
Debe exigir también:
    {
  "code": "...",
  "client_id": "1ipa",
  "redirect_uri": "...",
  "client_secret": "..."
    }   
El client_secret debe existir solamente:

En IglesiasNet, dentro de client_registry o secrets.
En Vercel del proyecto ipaMarcosPaz.
Nunca debe enviarse al navegador.

3. Variables de entorno en ipaMarcosPaz
Crear variables privadas en Vercel:
    IGLESIANET_URL=https://www.iglesianet.org
    IPA_CLIENT_ID=1ipa
    IPA_REDIRECT_URI=https://www.ipamarcospaz.org/area-privada/callback
    IPA_CLIENT_SECRET=secreto-privado-del-cliente
    SESSION_SECRET=secreto-privado-de-sesion
No deben comenzar con VITE_, porque serían visibles en el navegador.

Las variables públicas actuales de Supabase pueden mantenerse:
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...

4. Crear endpoint de inicio
Crear: api/auth/start.ts

Responsabilidades:

Generar un state aleatorio usando crypto.
Guardar state en cookie:
HttpOnly
Secure en producción
SameSite=Lax
expiración corta
Redirigir a:
  https://www.iglesianet.org/auth/authorize
    ?client_id=1ipa
    &redirect_uri=https%3A%2F%2Fwww.ipamarcospaz.org%2Farea-privada%2Fcallback
    &state=STATE_GENERADO

El state nunca debe ser fijo ni generado únicamente en React.

5. Cambiar Navbar.tsx
En:src/components/Navbar.tsx
Agregar un enlace: 
    <a href="/api/auth/start">
    Área privada
    </a>

No debe apuntar directamente a: 
    /auth/authorize?client_id=1ipa

porque el sitio necesita generar y guardar state en el backend.

6. Crear callback
Crear: api/auth/callback.ts

Debe:
Recibir code y state.
Leer el state guardado en cookie.
Comparar ambos valores usando comparación segura.
Rechazar si no coinciden.
Hacer un POST server-to-server a: 
https://www.iglesianet.org/auth/token

{
  "code": "...",
  "client_id": "1ipa",
  "redirect_uri": "https://www.ipamarcospaz.org/area-privada/callback",
  "client_secret": "..."
}

Crear una sesión local en cookie HttpOnly.
Borrar la cookie state.
Redirigir al área privada.
El callback nunca debe imprimir code, tokens o datos del usuario en logs.

7. Crear área privada
Agregar una ruta de aplicación para el usuario autenticado, por ejemplo: src/components/AreaPrivada.tsx

o una ruta compatible con el router que se agregue.

Debe:

Consultar la sesión mediante un endpoint server-side.
Mostrar el correo y el contexto recibido.
Ofrecer botón de cierre de sesión.
No almacenar tokens sensibles en localStorage.
8. Crear endpoint de sesión
Crear: api/auth/session.ts

Debe leer la cookie de sesión HttpOnly y devolver únicamente datos seguros:
{
  "authenticated": true,
  "email": "...",
  "client_id": "1ipa",
  "tenant_id": "...",
  "role": "Administrador_institucion"
}

No debe devolver secretos ni tokens internos.

9. Crear logout
Crear: api/auth/logout.ts

Debe:

Eliminar la cookie de sesión.
Redirigir al sitio institucional.
No llamar directamente a Supabase desde el navegador usando credenciales administrativas.
10. Configuración de Vercel
El proyecto ya contiene vercel.json. Debe verificarse que las funciones api/*.ts sean reconocidas por Vercel.

También debe configurarse: https://www.ipamarcospaz.org

como dominio de producción.

11. Configuración de Supabase Auth
En el proyecto Supabase de 1ipa, debe estar permitido exactamente: https://www.ipamarcospaz.org/area-privada/callback

No usar comodines como: *

12. Registro central de 1ipa
En IglesiasNet debe existir:
client_id: 1ipa
country_code: ar
hostname: www.ipamarcospaz.org
redirect_uri: https://www.ipamarcospaz.org/area-privada/callback
active: true

También debe registrarse el client_secret de forma segura.

13. Pruebas obligatorias
Inicio correcto
www.ipamarcospaz.org
  -> Área privada
  -> IglesiasNet
  -> login
  -> callback
  -> área privada

  State inválido
Modificar el parámetro state.

Resultado esperado: Acceso rechazado

Redirect falso
Intentar usar: redirect_uri=https://otro-dominio.com/callback

Resultado esperado:
HTTP 400

Code reutilizado
Usar dos veces el mismo code.

Resultado esperado: Código inválido o expirado
Cliente incorrecto
Enviar: client_id=otro-cliente      

Resultado esperado: Acceso rechazado

Logout
Cerrar sesión y volver a entrar al área privada.

Resultado esperado: Redirección al login

Orden correcto
Rotar secretos expuestos.
Mejorar /auth/token para exigir client_secret.
Registrar el secreto de 1ipa en IglesiasNet.
Crear variables privadas en Vercel.
Crear api/auth/start.ts.
Agregar el botón en Navbar.tsx.
Crear api/auth/callback.ts.
Crear api/auth/session.ts.
Crear api/auth/logout.ts.
Crear la pantalla de área privada.
Configurar el dominio Vercel.
Ejecutar las pruebas de seguridad.
Publicar el botón en producción.
La implementación del sitio debe hacerse en https://github.com/WILWSO/ipaMarcosPaz.git,



## Rodando el sistema - funcionó perfectamente el 20/08/2026
1. Probar localmente
**Terminal 1: IglesiasNet**
npm run dev -- --port 5173

**Terminal 2: ipaMarcosPaz**
npm run dev:vercel

Abrir http://localhost:3000 y pulsar Área privada.

2. Corregir IglesiasNet
  En IglesiasNet deben verificar:
    * Que exista el cliente 1ipa.
    * Que exista el tenant 09d5d211-1f6a-46a4-8a17-b5277d017e34.
    * Que el tenant esté asociado al cliente 1ipa.
    * Que esté activo.
    * Que /membership-request?... devuelva la iglesia en churches, no churches: [].

3. Registrar el callback local
  Para probar SSO local, IglesiasNet debe aceptar:
    http://localhost:3000/area-privada/callback
  En producción debe aceptar:
    https://www.ipamarcospaz.org/area-privada/callback

4. Verificar producción
  En Vercel deben existir estas variables privadas:
    IGLESIANET_URL=https://www.iglesianet.org
    IPA_CLIENT_ID=1ipa
    IPA_REDIRECT_URI=https://www.ipamarcospaz.org/area-privada/callback
    IPA_CLIENT_SECRET=...
    SESSION_SECRET=...

5. Credenciales
El error de usuario y contraseña ocurre dentro de IglesiasNet. Hay que confirmar allí que wiltontecnologias sea un correo válido, que el usuario esté activo y restablecer la contraseña si es necesario.

## Correcciones
- 21/08/2026
  Está pasando 1 cosa que no debería pasar:
  El enlace del formulario de solicitud de membresia: http://localhost:5173/membership-request?client_id=1ipa&tenant=09d5d211-1f6a-46a4-8a17-b5277d017e34, no abre pre selecionado el tenant con sus congregaciones. necesita cargar el tenant en options del campo "iglesia" del form solicitud de membresía. Además, debe ser publico para el usuario, o sea, cualquier persona que abrir la pagina de ipamarcospaz y quiera ser miembro de la iglesia puede acceder, así como es publico enviar um mensaje en el fomr de la seccion contacto y poblar la tabla mensajes en supabase, tambien debe ser publico rellenar el form solicitud de membresía con pre seleccion del tenant y poblar la tabla membership_request

  Diagnóstico: el bug es de IglesiasNet, no de ipaMarcosPaz. El enlace generado en
  src/data/contenido.ts ya incluye client_id y tenant correctamente.
  Falta en IglesiasNet:
  1. Que /membership-request lea el query param tenant y precargue/filtre las
     opciones del campo "iglesia" con las congregaciones de ese tenant.
  2. Que la ruta sea pública (sin login), igual que el patrón usado en
     Contacto.tsx de este repo: insert público en Supabase con clave anon.
  3. Policy RLS de insert público en la tabla membership_request (proyecto
     Supabase de IglesiasNet), análoga a "mensajes_insercion_publica" de
     supabase/schema.sql.
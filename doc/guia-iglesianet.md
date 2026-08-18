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
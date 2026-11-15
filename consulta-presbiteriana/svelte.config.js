import adapter from '@sveltejs/adapter-static';
// Sin variables: compilación en build/ para la raíz, con rutas relativas (paquete local).
// El sitio principal define BASE_PATH y BUILD_DIR para publicar la app bajo un subpath.
const base = process.env.BASE_PATH ?? '';
export default { kit: { adapter: adapter({ pages: process.env.BUILD_DIR ?? 'build' }), paths: { base, relative: base === '' } } };

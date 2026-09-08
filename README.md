# MusicFetch — front-end

Aplicación de una sola página para buscar artistas y álbumes en la
[Verome API](https://github.com/Kirazul/Verome-API), generar una tarjeta con su
información y guardarla en un feed personal. Cada usuario ve únicamente las
tarjetas que ha creado.

Proyecto final del bootcamp de desarrollo web de TripleTen (Etapa 1: etiquetado,
JSX y conexión con una API third-party).

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación queda en <http://localhost:5173>.

### La API

La aplicación consume la [Verome API](https://github.com/Kirazul/Verome-API),
un proyecto de terceros (MIT) escrito en Deno. Está desplegada en
<https://verome-api.enunezgit.deno.net> desde un fork propio, así que
`npm run dev` y `npm run build` funcionan sin configurar nada.

Para trabajar contra una copia local de la API:

```bash
npm install -g deno
git clone https://github.com/eNunezGit/Verome-API.git ../verome-api
cd ../verome-api && deno task start          # queda en :8000
```

y define `VITE_VEROME_BASE_URL=http://localhost:8000` en `.env`. Cuando no hay
ninguna API respondiendo, la búsqueda muestra un mensaje de error en lugar de
fallar en silencio.

Las imágenes que devuelve la API vienen a 60 px en las búsquedas y como
banners de hasta 2880 px en las fichas de artista. `veromeApi.js` reescribe el
tamaño en la propia URL para pedirlas siempre a 544 px cuadrados: las
miniaturas dejan de verse borrosas y los banners bajan de ~900 KB a ~100 KB.
Si una miniatura no existe o no se puede cargar, la tarjeta cae en una portada
de reserva.

### Comandos

| Comando           | Qué hace                                   |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con recarga en vivo |
| `npm run build`   | Compilación de producción en `dist/`       |
| `npm run preview` | Sirve la compilación de producción         |
| `npm run lint`    | ESLint sobre todo el proyecto              |

## Estructura

```
src/
├── components/        un componente por carpeta, con su JSX y su CSS
├── contexts/          CurrentUserContext
├── hooks/             useForm, useEscapeKey
├── images/            imágenes del proyecto
├── utils/
│   ├── constants.js   constantes en MAYÚSCULAS y configuración
│   ├── veromeApi.js   peticiones a la API third-party
│   └── mainApi.js     backend simulado (sesión y tarjetas)
├── vendor/fonts/      Inter y Roboto Slab en .woff2
├── index.css          estilos base
└── main.jsx           punto de entrada
```

## Decisiones

**Vite en lugar de CRA.** El criterio del proyecto menciona CRA, pero
`create-react-app` está descontinuado desde 2025 e instala dependencias con
vulnerabilidades conocidas. El proyecto usa Vite, que cumple la misma función
(generar los archivos de infraestructura) y produce la misma estructura de
`components`, `fonts` y punto de entrada.

**Sin librerías de interfaz.** La única dependencia de terceros en tiempo de
ejecución, además de React, es `react-router-dom` para la navegación interna, tal
como recomienda el propio proyecto. Los botones, los campos y las ventanas
modales están construidos a mano. Las peticiones usan la API Fetch nativa: no
hay axios ni jQuery.

**Backend simulado.** `src/utils/mainApi.js` guarda usuarios y tarjetas en
`localStorage` imitando la forma de una base de datos, con las tarjetas indexadas
por usuario. Todas sus funciones devuelven promesas, así que sustituir el cuerpo
de cada una por un `fetch()` al servidor real no obliga a tocar los componentes.

**Tipografías propias.** Inter (texto) y Roboto Slab (títulos) se sirven desde
`src/vendor/fonts/` con `@font-face` y `font-display: swap`, no desde el CDN de
Google. Las dos son fuentes variables, así que un archivo por subset cubre todos
los pesos: cuatro `.woff2` y 188 KB en total. Cada familia lleva detrás fuentes
del sistema como alternativa.

**Interfaz en inglés.** Todo el texto visible, el atributo `lang` y la ruta
`/my-feed` están en inglés. Los comentarios del código y este README siguen en
español.

## Despliegue

El front-end se despliega en Vercel, que detecta Vite y compila con
`npm run build` sin configuración adicional.

El único archivo necesario es `vercel.json`. Vercel no reescribe las rutas de
una SPA por su cuenta, así que sin él una visita directa a `/my-feed`
devolvería un 404 en lugar de la aplicación:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No hace falta declarar ninguna variable de entorno en el panel: la URL de la
API es el valor por defecto en `constants.js`, de modo que una compilación
desde un clon limpio ya apunta al despliegue público.

## Pendiente

- Backend real que sustituya a `mainApi.js`. Mientras tanto, la sesión y las
  tarjetas viven en el `localStorage` de cada navegador.

## Enlaces del proyecto

| Qué | Dónde |
| --- | --- |
| Aplicación desplegada | <https://web-musicfetch-frontend.vercel.app> |
| API desplegada | <https://verome-api.enunezgit.deno.net> |
| Repositorio del front-end | <https://github.com/eNunezGit/web-musicfetch-frontend> |
| Fork de la API | <https://github.com/eNunezGit/Verome-API> |

La API es un fork de [Kirazul/Verome-API](https://github.com/Kirazul/Verome-API),
que es el proyecto original. El fork solo existe para poder desplegarla en una
organización propia de Deno Deploy; el código de la API no es de este proyecto.

El front-end se despliega solo en cada push a `main`, y cada pull request recibe
además su propia URL de vista previa.

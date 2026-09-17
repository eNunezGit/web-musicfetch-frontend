# MusicFetch — front-end

Aplicación de una sola página para buscar artistas y álbumes en la
[Verome API](https://github.com/Kirazul/Verome-API), generar una tarjeta con su
información y guardarla en un feed personal. Cada usuario ve únicamente las
tarjetas que ha creado.

Proyecto final del bootcamp de desarrollo web de TripleTen.

## Las dos API

La aplicación habla con dos servidores distintos, y conviene no confundirlos:

| | Qué hace | Cliente |
|---|---|---|
| **Verome API** | Busca artistas y álbumes. Es de terceros y es pública. | `src/utils/veromeApi.js` |
| **Backend propio** | Registro, sesión y tarjetas guardadas. Exige token. | `src/utils/mainApi.js` |

## Puesta en marcha

```bash
npm install
npm run dev
```

La aplicación queda en <http://localhost:5173>.

Las dos API tienen su despliegue público como valor por defecto, así que
`npm run dev` y `npm run build` funcionan sin configurar nada.

### La Verome API

Un proyecto de terceros (MIT) escrito en Deno, desplegado en
<https://verome-api.enunezgit.deno.net> desde un fork propio.

Para trabajar contra una copia local:

```bash
npm install -g deno
git clone https://github.com/eNunezGit/Verome-API.git ../verome-api
cd ../verome-api && deno task start          # queda en :8000
```

y define `VITE_VEROME_BASE_URL=http://localhost:8000` en `.env`. Cuando no hay
ninguna API respondiendo, la búsqueda muestra un mensaje de error en lugar de
fallar en silencio.

### El backend propio

Está en [web-musicfetch-backend](https://github.com/eNunezGit/web-musicfetch-backend)
y desplegado en <https://api.musicfetch.chickenkiller.com>. Para trabajar contra
el servidor local, arráncalo (`npm run dev`, queda en :3000) y define
`VITE_MAIN_BASE_URL=http://localhost:3000` en `.env`.

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
│   ├── veromeApi.js   peticiones a la Verome API
│   └── mainApi.js     peticiones al backend propio (sesión y tarjetas)
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

**Del token solo se guarda el token.** Al iniciar sesión, `localStorage`
recibe el JWT y nada más. El usuario y sus tarjetas se piden al servidor en
cada arranque con ese token: así una tarjeta borrada desde otro navegador no
sigue apareciendo aquí, y no hay dos copias de la misma verdad.

**La sesión se cierra solo si el servidor la rechaza.** Al recargar, un 401 o
un 403 descartan el token; un servidor que no responde, no. Cerrar la sesión
por una caída ajena obligaría al usuario a volver a entrar sin motivo.

**Los errores se traducen por código, no por texto.** La API responde en
español y la interfaz está en inglés, así que `mainApi.js` rechaza con el
código de estado a la vista y el texto se decide en `AUTH_ERRORS`
(`constants.js`). Traducir el mensaje del servidor ataría la interfaz a la
redacción exacta del backend.

**Dos identificadores por tarjeta.** `id` es el de la API de música y `savedId`
el `_id` del documento en el backend. Con el primero se reconoce una tarjeta ya
guardada entre los resultados de búsqueda; el segundo es el que espera
`DELETE /tracks/:id`. La conversión entre la tarjeta y lo que guarda el
servidor vive entera en `mainApi.js`: fuera de ahí la aplicación solo maneja
tarjetas.

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

No hace falta declarar ninguna variable de entorno en el panel: las URL de las
dos API son los valores por defecto en `constants.js`, de modo que una
compilación desde un clon limpio ya apunta a los despliegues públicos.

El backend autoriza por CORS el dominio de Vercel y también las URL de vista
previa que Vercel crea por rama, así que una rama nueva no necesita ningún
cambio en el servidor.

## Enlaces del proyecto

| Qué | Dónde |
| --- | --- |
| Aplicación desplegada | <https://web-musicfetch-frontend.vercel.app> |
| Backend desplegado | <https://api.musicfetch.chickenkiller.com> |
| Verome API desplegada | <https://verome-api.enunezgit.deno.net> |
| Repositorio del front-end | <https://github.com/eNunezGit/web-musicfetch-frontend> |
| Repositorio del backend | <https://github.com/eNunezGit/web-musicfetch-backend> |
| Fork de la Verome API | <https://github.com/eNunezGit/Verome-API> |

La Verome API es un fork de
[Kirazul/Verome-API](https://github.com/Kirazul/Verome-API), que es el proyecto
original. El fork solo existe para poder desplegarla en una organización propia
de Deno Deploy; el código de esa API no es de este proyecto.

El front-end se despliega solo en cada push a `main`, y cada pull request recibe
además su propia URL de vista previa.

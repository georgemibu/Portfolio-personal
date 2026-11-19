# Jorge Rocha — Portfolio

Portfolio profesional de Jorge Rocha, desarrollado con Astro. El sitio es estático, responsive, accesible y cuenta con español e inglés.

## Requisitos

- Node.js 22 o superior
- npm

## Instalación

```powers
npm install
```

## Desarrollo local

```powers
npm run dev
```

Astro sirve el sitio normalmente en `http://localhost:4321`.

## Compilación

```powers
npm run build
```

La salida estática queda en `dist/`.

## Vista previa de producción

```powers
npm run preview
```

## Publicación

Subí el contenido de `dist/` a cualquier alojamiento de sitios estáticos, por ejemplo Netlify, Vercel o GitHub Pages.

## Agregar proyectos

Editá `src/data/projects.ts`. Cada proyecto usa esta estructura:

```ts
{
  id: 'identificador-unico',
  name: 'Nombre',
  category: 'frontend', // frontend | backend | fullstack
  descriptionEs: 'Descripción en español.',
  descriptionEn: 'Description in English.',
  technologies: ['React', 'Node.js'],
  demoUrl: 'https://ejemplo.com/',
  repositoryUrl: 'https://github.com/usuario/repositorio',
  featured: true,
  accent: 'lime', // lime | violet | orange | blue
  status: 'live', // live | repository
}
```

Para incorporar un proyecto al bloque destacado, cambiá `featured` a `true`. Conviene mantener entre 3 y 4 proyectos destacados. Las tarjetas se generan automáticamente.

Para agregar una imagen real, colocala en `public/images/projects/` y agregá la propiedad `image` al modelo antes de mapearla en `ProjectCard.astro`. Actualmente las tarjetas usan una composición gráfica propia para evitar enlaces e imágenes rotas.

## Traducciones

Las cadenas visibles están en `src/data/translations.ts`. El sistema persiste la preferencia ES/EN en `localStorage` y cambia el contenido sin recargar la página.

Los nombres propios, tecnologías y URLs no se traducen. Para agregar texto nuevo:

1. Incorporá una clave a ambos idiomas.
2. Agregá `data-i18n="clave"` al elemento.
3. Ejecutá `npm run build`.

Las descripciones bilingües de proyectos están en `src/data/projects.ts`.

## Incorporar el CV

Los CV actuales están disponibles en `public/` en español e inglés. La sección Sobre mí ofrece dos enlaces con descarga directa:

- `CV Jorge Adolfo Rocha - Fullstack Developer (Espanol).pdf`
- `CV Jorge Adolfo Rocha - Fullstack Developer (English).pdf`

Para reemplazar una versión, conservá el nombre del archivo o actualizá el atributo `href` correspondiente en `src/pages/index.astro`.

## Configurar el formulario de contacto con EmailJS

El formulario usa EmailJS para entregar mensajes directamente desde el navegador, con validación y estados reales de envío, éxito y error.

1. Creá una cuenta en EmailJS y conectá el servicio de correo que recibirá los mensajes.
2. Creá una plantilla con estas variables: `name`, `email`, `subject` y `message`. Podés copiar el HTML de [`docs/emailjs-template.html`](./docs/emailjs-template.html) en el editor de contenido HTML de EmailJS. El formulario también envía `title` como alias de `subject` para aceptar plantillas que ya usan ese nombre.
3. En los ajustes de la plantilla, configurá el destinatario como `georgemibu@gmail.com`, el asunto como `Nuevo mensaje desde el portfolio: {{subject}}` (o `{{title}}` si tu plantilla ya usa ese parámetro) y `{{email}}` como `Reply-To`. Dejá `From Email` con la dirección que el servicio de correo conectado autoriza.
4. Copiá `.env.example` a `.env` y completá:

   ```env
   PUBLIC_EMAILJS_SERVICE_ID=...
   PUBLIC_EMAILJS_TEMPLATE_ID=...
   PUBLIC_EMAILJS_PUBLIC_KEY=...
   ```

5. Reiniciá el servidor de desarrollo (`npm run dev`) o configurá esas mismas variables en el proveedor de despliegue antes de compilar.

El Public Key, Service ID y Template ID están destinados al uso en cliente. **No agregues la Private Key ni credenciales del correo al frontend ni a variables `PUBLIC_`.** Limitá el dominio permitido en EmailJS y configurá sus controles anti-spam/cuotas. Sin las tres variables públicas, el formulario no envía y muestra un mensaje indicando que falta configurarlo.

## Mantenimiento

- Diseño global: `src/styles/global.css`
- Datos de proyectos: `src/data/projects.ts`
- Traducciones: `src/data/translations.ts`
- Layout base y metadatos: `src/layouts/BaseLayout.astro`
- Componentes: `src/components/`
- Interacciones: `src/scripts/site.js`

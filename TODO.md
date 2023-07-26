# Implementación de logger

## Consigna

- Basado en nuestro proyecto principal, implementar un logger

## Se debe entregar

- [x] Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor): **debug, http, info, warning, error, fatal**
- [x] Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola
- [x] Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info.
- [x] Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”
- [ ] Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
- [x] Crear un endpoint /loggerTest que permita probar todos los logs

## Formato

- Link al repositorio de Github con el proyecto (sin node_modules)

## Sugerencias

- Puedes revisar el testing del entregable [Aqui](https://docs.google.com/document/d/1t--s1L7rv9cg5GENOveul9sHM6LcSclkIC1UWYU3TKs/edit)
- La ruta loggerTest es muy importante para que tu entrega pueda ser calificada de manera rápida y eficiente. ¡No olvides colocarla!

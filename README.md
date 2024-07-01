# manteca-challenge API

## Descripción
Esta API permite gestionar usuarios y sus transacciones financieras. Incluye autenticación, gestión de cuentas, y operaciones de transacciones.

## Características
- Registro de usuarios
- Autenticación de usuarios
- Gestión de cuentas de usuario
- Realización de transacciones en pesos y dolares
- Consulta de balance de cuentas
- Paginación de transacciones

## Tecnologías Utilizadas
- Node.js
- Express
- MongoDB
- Mongoose
- TypeScript
- JWT para autenticación
- bcrypt para hashing de contraseñas

## Requisitos Previos
- Node.js y npm instalados
- MongoDB en ejecución

## Instalación
1. Clona el repositorio:
    ```sh
    git clone https://github.com/AgustinRafanelli/manteca-challenge.git
    cd manteca-challenge
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Crea un archivo `.env` y configura tus variables de entorno. Al ser un ejercicio, se dejaron valores por defecto, pero en la practica solo tomaria las del .env.

4. Inicia el servidor:
    ```sh
    npm start
    ```

## Uso
Para aprender su uso se genero documentacion de los endpoints https://documenter.getpostman.com/view/19427826/2sA3dviBew

## Estructura del Proyecto
.
├── config
├── src
│ ├── config
│ ├── constants
│ ├── controllers
│ ├── helpers
│ ├── interfaces
│ ├── middlewares
│ ├── models
│ ├── routes
│ ├── utils
│ ├── app.ts
├── .env
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json

## Aclaraciones
1. Como tenia que trabajar con CBUs busque como se componia. Todos los CBUs estan compuestos por el numero de entidad, que le puse `111` a nuestro banco ficticio, el numero de sucursal en el que esta registrado el usuario, que supuse una unica sucursal al ser un banco pequeino, y el numero de cliente o `clientId` en este caso.

2. Genere inicio de sesiones mediante token, por dos razones. Darle mas profundidad a la logica de usuario y que no sea necesario pasar que usuario es con el que quiero trabajer, eso ya esta dentro del token.

3. A su vez, esto me llevo a generar algunos middleware y helpers para no repetir tanto codigo dentro de los endpoints.

4. Tanto por el CBU y el token, decidi crear un ID extra del que proporciona mongoDB. Cree un `clientId` que es secuencial. 

5. Uno de los focos que me parecieron impotantes fue que tenga una buena estructura, asi el prototipo podria servir como base por la claridad y la escalabilidad que proporciona.

6. Ya que use postman para probar los endpoints, genere una documentacion y especifique el uso de cada uno en el.
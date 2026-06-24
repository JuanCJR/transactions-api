# Transactions API (NestJS + Clean & Hexagonal Architecture)

Este proyecto sirve como **base y plantilla de normalización** para Banco Itaú, implementando la **Arquitectura Hexagonal** bajo la estructura estándar de **Clean Architecture** (`domain`, `application`, `infrastructure`). 

El objetivo principal es lograr un desacoplamiento completo de las reglas de negocio respecto a las tecnologías y frameworks (como NestJS o bases de datos específicas), facilitando la testabilidad, mantenimiento e independencia tecnológica.

---

## 1. Estructura del Proyecto

El código de negocio se organiza modularmente en `src/modules/accounts/` bajo las siguientes capas:

```text
src/modules/accounts/
├── domain/                  # 1. Capa de Dominio (Reglas de negocio puras)
│   ├── models/              # Entidades y Value Objects (ej. Account, Money)
│   ├── exceptions/          # Excepciones específicas de negocio (ej. InsufficientFundsException, CreditScoreTooLowException)
│   ├── ports/               # Puertos técnicos puros (ej. LoggerPort, AppConfig, CreditBureauPort)
│   └── repositories/        # Puertos de salida especializados en BD (ej. AccountRepository)
│
├── application/             # 2. Capa de Aplicación (Casos de uso / Orquestación)
│   ├── dtos/                # Data Transfer Objects puros (parámetros de entrada de casos de uso)
│   └── use-cases/           # Flujos de negocio concretos (ej. TransferUseCase, CreateAccountUseCase)
│
└── infrastructure/          # 3. Capa de Infraestructura (Adaptadores y Framework)
    ├── controllers/         # Adaptadores de entrada (Controladores HTTP, DTOs de validación web)
    ├── database/            # Adaptadores de salida de persistencia (InMemory, ORMs, etc.)
    ├── http-clients/        # Adaptadores de salida para APIs externas (ej. MockCreditBureauAdapter)
    ├── logger/              # Adaptadores de salida técnicos (Loggers de NestJS)
    ├── config/              # Adaptadores de salida técnicos (Configuración de NestJS)
    ├── filters/             # Filtros de excepciones para traducir errores de dominio a HTTP
    └── accounts.module.ts   # Configuración de Inyección de Dependencias de NestJS
```

---

## 2. Responsabilidades y Explicación de Archivos

### 📂 1. Capa de Dominio (`domain`)
Contiene las reglas de negocio de la empresa. **Es 100% puro TypeScript** y no tiene importaciones de NestJS ni de librerías externas.

*   📄 **`models/money.vo.ts` (Value Object)**
    *   *Propósito*: Encapsula el comportamiento del dinero (cantidad y moneda). Es **inmutable** (retorna siempre una nueva instancia en operaciones matemáticas) para evitar mutaciones accidentales en memoria.
*   📄 **`models/account.model.ts` (Entity)**
    *   *Propósito*: Entidad de negocio de cuenta bancaria. Mantiene el estado del saldo bancario y encapsula las reglas de modificación de saldo mediante sus métodos `.deposit()` y `.withdraw()`.
*   📄 **`exceptions/insufficient-funds.exception.ts`**
    *   *Propósito*: Excepción nativa de negocio arrojada cuando una cuenta no tiene fondos suficientes.
*   📄 **`exceptions/credit-score-too-low.exception.ts`**
    *   *Propósito*: Excepción de negocio arrojada cuando un titular no califica para abrir una cuenta corriente debido a un historial financiero deficiente.
*   📄 **`ports/credit-bureau.port.ts` (Outbound Port)**
    *   *Propósito*: Puerto de salida que define la firma requerida para conectarse con un buró de crédito externo (ej: Equifax/Dicom).
*   📄 **`repositories/account.repository.ts` (Outbound Port)**
    *   *Propósito*: Clase abstracta que define las firmas obligatorias de persistencia que el dominio/aplicación necesitan para operar con cuentas.

---

### 📂 2. Capa de Aplicación (`application`)
Orquesta el flujo de datos entre el usuario (a través de infraestructura) y las entidades del dominio. **Es 100% puro TypeScript**.

*   📄 **`dtos/create-account-input.dto.ts` & `transfer-input.dto.ts`**
    *   *Propósito*: Estructuras de datos puras que el caso de uso requiere como entrada. No contienen decoradores HTTP.
*   📄 **`use-cases/create-account.use-case.ts`**
    *   *Propósito*: Caso de uso para crear una cuenta. Antes de crearla, consulta el score al puerto `CreditBureauPort` para validar la viabilidad del cliente.
*   📄 **`use-cases/get-account.use-case.ts`**
    *   *Propósito*: Caso de uso concreto para consultar los detalles y saldo de una cuenta.
*   📄 **`use-cases/transfer.use-case.ts`**
    *   *Propósito*: Caso de uso que orquesta el retiro de saldo en origen, depósito en destino y persistencia secuencial. Inyecta abstracciones (`AccountRepository`, `LoggerPort`, `AppConfig`) para aislar la lógica de límites técnicos y registros.

---

### 📂 3. Capa de Infraestructura (`infrastructure`)
Detalles de implementación del sistema. Contiene las dependencias del framework NestJS y librerías externas.

*   📄 **`controllers/account.controller.ts` (Primary Adapter)**
    *   *Propósito*: Recibe peticiones REST HTTP, valida las entradas mapeando de DTOs HTTP a DTOs de aplicación, ejecuta el caso de uso adecuado y formatea la respuesta JSON final.
*   📄 **`controllers/dto/`**
    *   *Propósito*: DTOs con decoradores de validación de `class-validator` (ej. `@IsString()`, `@Min()`) para asegurar el formato de entrada HTTP.
*   📄 **`database/in-memory-account.repository.ts` (Secondary Adapter)**
    *   *Propósito*: Implementa la clase abstracta `AccountRepository`. Almacena y lee datos de una base de datos virtual simulada por un `Map`.
*   📄 **`http-clients/mock-credit-bureau.adapter.ts` (Secondary Adapter)**
    *   *Propósito*: Adaptador que implementa el puerto `CreditBureauPort` simulando una consulta REST a la API de Equifax/Dicom para validar historiales crediticios.
*   📄 **`logger/nest-logger.adapter.ts` (Secondary Adapter)**
    *   *Propósito*: Implementa el puerto de logs utilizando la clase interna `Logger` de NestJS.
*   📄 **`config/nest-config.adapter.ts` (Secondary Adapter)**
    *   *Propósito*: Implementa la configuración del límite de transferencia leyendo variables de entorno.
*   📄 **`filters/domain-exception.filter.ts`**
    *   *Propósito*: Interceptor global que detecta excepciones de negocio (como `InsufficientFundsException` y `CreditScoreTooLowException`) y las traduce a respuestas estructuradas con códigos HTTP adecuados (como `422` o `400`).
*   📄 **`accounts.module.ts`**
    *   *Propósito*: Configura el contenedor de inyección de dependencias (IoC Container) de NestJS. Dado que los casos de uso son clases puras sin decoradores `@Injectable()`, aquí se usa `useFactory` e `inject` para cablearlos y mantener la pureza de la arquitectura.

---

## 3. Instalación del Proyecto

Instala las dependencias del framework:
```bash
npm install
```

Para asegurar las validaciones decoradas de los DTOs de entrada HTTP:
```bash
npm install class-validator class-transformer
```

---

## 4. Ejecución

```bash
# Modo desarrollo con auto-recarga (watch mode)
npm run start:dev

# Construcción de TypeScript para validación
npm run build

# Ejecución de Pruebas Unitarias
npm run test

# Ejecución de Pruebas E2E
npm run test:e2e
```

---

## 5. Ejemplos de Pruebas de API (cURL)

### A. Crear Cuenta A (Diego Maradona - Califica Aprobado)
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"holderName": "Diego Maradona", "initialAmount": 500000, "currency": "CLP"}'
```
*Retornará el ID generado de la Cuenta A (ej: `A1B2C3D`).*

### B. Crear Cuenta B (Lionel Messi - Califica Aprobado)
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"holderName": "Lionel Messi", "initialAmount": 10000, "currency": "CLP"}'
```
*Retornará el ID generado de la Cuenta B (ej: `X9Y8Z7W`).*

### C. Intentar Crear Cuenta para Titular Moroso (Rechazado, retorna 400 BadRequest)
La simulación rechaza a cualquier titular con el término "moroso" o "deudor" en su nombre:
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"holderName": "Jorge Moroso Valenzuela", "initialAmount": 50000, "currency": "CLP"}'
```

### D. Consultar saldo inicial de Cuenta A
```bash
curl http://localhost:3000/accounts/A1B2C3D
```

### E. Intentar Transferencia Excediendo el Límite de Infraestructura (Retorna 400)
El límite por defecto en `NestConfigAdapter` es `$100.000 CLP`. Intentamos transferir `$150.000`:
```bash
curl -X POST http://localhost:3000/accounts/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId": "A1B2C3D", "toAccountId": "X9Y8Z7W", "amount": 150000, "currency": "CLP"}'
```

### F. Intentar Transferencia Excediendo los Fondos del Dominio (Retorna 422)
Intentamos transferir `$80.000` (si la cuenta sólo posee `$50.000` de saldo disponible):
```bash
curl -X POST http://localhost:3000/accounts/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId": "A1B2C3D", "toAccountId": "X9Y8Z7W", "amount": 80000, "currency": "CLP"}'
```

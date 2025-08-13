# BitacoraMVP-Front
# 📝 MVP - SPA Bitácora Microhuasca

Este proyecto es una **Single Page Application (SPA)** desarrollada como MVP (Producto Mínimo Viable) para **Bitácora Microhuasca**, una herramienta diseñada para acompañar procesos terapéuticos mediante el registro reflexivo en formato de audio.

## 🎯 Objetivo

Facilitar el **registro diario de reflexiones personales** por parte de los participantes, y permitir a los administradores hacer **seguimiento básico del uso** de la herramienta.

## 👥 Historias de Usuario

### 🧑‍💼 Administrador
- **Registro de participantes:** Permitir la creación de cuentas para nuevos usuarios.
- **Visualización de frecuencia de uso:** Mostrar la cantidad de registros por participante para seguimiento del proceso.

### 👤 Participante
- **Ingreso a la app:** Acceso rápido mediante credenciales o enlace personalizado.
- **Visualización del día del proceso:** Mostrar el día actual del proceso terapéutico.
- **Registro de reflexión por nota de voz:** Grabación diaria de reflexiones.
- **Revisión de reflexiones anteriores:** Acceso al historial de grabaciones.

## 🛠️ Stack Tecnológico

### 1. Frontend (SPA)
- React + Vite
- Funcionalidades:
  - Registro de notas de voz
  - Visualización del avance diario
  - Revisión de reflexiones anteriores
  - Acceso a vistas para administradores

### 2. Backend (API REST)
- Funciones:
  - Autenticación de usuarios
  - Gestión de participantes y registros
  - Almacenamiento seguro
  - Cálculo de métricas de uso

### 3. Base de Datos (SQL)
- PostgreSQL o MySQL
- Tablas principales:
  - Usuarios (con roles: participante/admin)
  - Registros de reflexión (audio, fecha, usuario_id)
  - Avances del proceso
  - Métricas de uso

**Autor:**  
👤 *Jesu Guzmán* – Full Stack Developer  
📅 *2025*


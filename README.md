# Ing-Software


## Proyecto Horizonte (nombre provisional)

## Descripción
El Proyecto Horizonte es una herramienta tecnológica diseñada para combatir la deserción escolar en zonas vulnerables. Este sistema unifica los datos académicos, de asistencia y conductuales de los estudiantes con el fin de medir, comparar y alertar de manera oportuna a las autoridades pertinentes (profesores, directivos, duplas psicosociales) sobre posibles riesgos de deserción escolar.

## Integrantes
- Mary González      ----> Product Owner (PO)
- Benjamín Farías    ----> Scrum Master (SM)
- Omar Millar        ----> Developer (DEV)

## Arquitectura
La arquitectura seleccionada corresponde a un Monolito Modular con Arquitectura Limpia (Clean Architecture) basada en principios de Arquitectura Hexagonal.

## Tecnologías y Herramientas

-Lenguajes y Formatos: Python, JSON, SQL.
-Librerías Principales: Pandas, OpenPyXL.
-Infraestructura y Servicios: Microsoft Services.
-Herramientas de Gestión y Versionado: Jira, Git, GitHub.
-Entorno de Desarrollo: Visual Studio Code.
-Apoyo Inteligente: IA (Claude, Gemini).

## Estructura del Repositorio
/proyecto
├── main.py                
├── README.md               
├── .gitignore                
├── BD.xlsx                  
├── RegistrosAuditoria.json    
├── docs/                      
├── src/                        
│   ├── generador_fichas.py     
│   └── ficha_template.json     
└── tests/                                     

## Requisitos Previos e Instalación
Para ejecutar el proyecto de manera local, asegúrate de tener instalado Python 3.8 o superior.

Instala las dependencias necesarias ejecutando el siguiente comando en tu terminal:
pip install pandas openpyxl

## Características Principales y Uso

El sistema opera actualmente mediante una Interfaz de Línea de Comandos (CLI) ejecutando python main.py. Sus funcionalidades incluyen:

-Simulación de RBAC (Control de Acceso Basado en Roles): Al iniciar, el sistema solicita el rol del usuario (Director, Profesor Jefe, Inspector, etc.) para enmascarar u ocultar datos sensibles según la Ley 19.628.

-Generador de Fichas de Estudiantes: Conecta la base de datos Excel (BD.xlsx) con un modelo de datos en JSON, cruzando automáticamente la información académica del alumno con la de su apoderado y sus especialidades.

-Búsqueda y Filtrado Inteligente: Permite ubicar estudiantes mediante coincidencia parcial de Nombre, validación exacta de RUT, o filtrando masivamente por ID de Especialidad Técnico-Profesional.

-Edición y Auditoría: Incluye un formulario interactivo con validación estricta (ej. RUT de 9 dígitos) que permite sobreescribir campos directamente en la base de datos de Excel, dejando un rastro detallado en RegistrosAuditoria.json.


# Ing-Software

# Nombre del proyecto
Proyecto Horizonte (nombre provisional)

## Descripción
El "Proyecto Horizonte" es una herramienta para combatir la deserción escolar en zonas vulnerables. Proyecto Horizonte unifica los datos de los estudiantes (asistencia, calificaciones y conductas) con el fin de medir y comparar dichos datos y dar aviso oportuno a las autoridades pertinentes (profesores, directivos académicos) sobre una posible deserción escolar.

## Integrantes
- Mary González      ----> PO
- Benjamín Farías    ----> SM
- Omar Millar        ----> DEV

## Arquitectura
La arquitectura seleccionada corresponde a un Monolito Modular con Arquitectura Limpia (Clean Architecture) basada en principios de Arquitectura Hexagonal.

## Tecnologías
-Microsoft services
-Json
-SQL
-JIRA
-IA (Cloude, Gemini)
-Git
-GitHub
-Visual Studio Code

## Organización del repositorio
/proyecto
├── Main
├── README.md
├── .gitignore
├── docs/
├── src/
└── tests/

## Requisitos previos
- Python 3.8 o superior.
- Instalar Pandas y OpenPyXL:
  ```bash
  pip install pandas openpyxl

## Generador de Fichas de Estudiantes
Este proyecto conecta una base de datos Excel (`BD.xlsx`) con un modelo de datos en JSON para generar fichas individuales de estudiantes, enlazando automáticamente la información del alumno con la de su apoderado mediante el `rut_estudiante`.


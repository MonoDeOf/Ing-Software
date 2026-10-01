import pandas as pd


class MotorRiesgo:
    def __init__(
        self,
        ruta_excel,
        umbral_asistencia=75,
        nota_deficiente=4.0,
        minimo_notas_deficientes=2,
        operador_logico="AND"
    ):
        self.ruta_excel = ruta_excel
        self.umbral_asistencia = umbral_asistencia
        self.nota_deficiente = nota_deficiente
        self.minimo_notas_deficientes = minimo_notas_deficientes
        self.operador_logico = operador_logico.upper()

        self._validar_configuracion()

        self.df_datos = pd.read_excel(ruta_excel, sheet_name="Datos")
        self.df_notas = pd.read_excel(ruta_excel, sheet_name="Notas")

    def _validar_configuracion(self):
        if not 0 <= self.umbral_asistencia <= 100:
            raise ValueError(
                "El umbral de asistencia debe estar entre 0 y 100."
            )

        if self.minimo_notas_deficientes < 0:
            raise ValueError(
                "La cantidad mínima de notas deficientes no puede ser negativa."
            )

        if self.operador_logico not in ("AND", "OR"):
            raise ValueError(
                "El operador lógico debe ser AND u OR."
            )

    def contar_notas_deficientes(self, rut_estudiante):
        notas_estudiante = self.df_notas[
            self.df_notas["rut_estudiante"] == rut_estudiante
        ]

        if notas_estudiante.empty:
            return 0

        cantidad = (
            notas_estudiante["nota"] < self.nota_deficiente
        ).sum()

        return int(cantidad)

    def evaluar_estudiante(self, rut_estudiante):
        estudiante = self.df_datos[
            self.df_datos["rut_estudiante"] == rut_estudiante
        ]

        if estudiante.empty:
            return None

        fila = estudiante.iloc[0]

        asistencia = float(fila["asistencia"])

        # La BD guarda la asistencia como decimal.
        # Ejemplo: 0.863 = 86.3 %
        if 0 <= asistencia <= 1:
            asistencia *= 100

        asistencia = round(asistencia, 1)

        cantidad_notas_deficientes = self.contar_notas_deficientes(
            rut_estudiante
        )

        condicion_asistencia = asistencia < self.umbral_asistencia

        condicion_notas = (
            cantidad_notas_deficientes
            >= self.minimo_notas_deficientes
        )

        if self.operador_logico == "AND":
            regla_disparada = condicion_asistencia and condicion_notas
        else:
            regla_disparada = condicion_asistencia or condicion_notas

        factores_negativos = sum([
            condicion_asistencia,
            condicion_notas
        ])

        if factores_negativos == 2:
            nivel_riesgo = "ALTO"
        elif factores_negativos == 1:
            nivel_riesgo = "MEDIO"
        else:
            nivel_riesgo = "BAJO"

        return {
            "rut_estudiante": rut_estudiante,
            "nombre": str(fila["nombre"]),
            "apellido_paterno": str(fila["apellido_paterno"]),
            "asistencia": asistencia,
            "cantidad_notas_deficientes": cantidad_notas_deficientes,
            "cumple_condicion_asistencia": condicion_asistencia,
            "cumple_condicion_notas": condicion_notas,
            "operador_logico": self.operador_logico,
            "regla_disparada": regla_disparada,
            "nivel_riesgo": nivel_riesgo
        }

    def evaluar_todos(self):
        resultados = []

        for rut in self.df_datos["rut_estudiante"].dropna().unique():
            resultado = self.evaluar_estudiante(rut)

            if resultado is not None:
                resultados.append(resultado)

        return resultados

    
import pytest
from src.motor_riesgo import MotorRiesgo


def test_estudiante_inexistente():
    motor = MotorRiesgo("BD.xlsx")
    resultado = motor.evaluar_estudiante("00000000-0")

    assert resultado is None


def test_regla_and_disparada():
    motor = MotorRiesgo(
        "BD.xlsx",
        umbral_asistencia=90,
        minimo_notas_deficientes=2,
        operador_logico="AND"
    )

    resultado = motor.evaluar_estudiante("23.374.906-0")

    assert resultado["cumple_condicion_asistencia"] is True
    assert resultado["cumple_condicion_notas"] is True
    assert resultado["regla_disparada"] is True


def test_regla_or_no_disparada():
    motor = MotorRiesgo(
        "BD.xlsx",
        umbral_asistencia=75,
        minimo_notas_deficientes=2,
        operador_logico="OR"
    )

    resultado = motor.evaluar_estudiante("23.201.589-6")

    assert resultado["cumple_condicion_asistencia"] is False
    assert resultado["cumple_condicion_notas"] is False
    assert resultado["regla_disparada"] is False


def test_umbral_asistencia_invalido():
    with pytest.raises(ValueError):
        MotorRiesgo(
            "BD.xlsx",
            umbral_asistencia=120
        )


def test_operador_logico_invalido():
    with pytest.raises(ValueError):
        MotorRiesgo(
            "BD.xlsx",
            operador_logico="XOR"
        )


def test_evaluar_todos():
    motor = MotorRiesgo(
        "BD.xlsx",
        umbral_asistencia=90,
        minimo_notas_deficientes=2,
        operador_logico="AND"
    )

    resultados = motor.evaluar_todos()

    assert len(resultados) == 46
    assert all("rut_estudiante" in r for r in resultados)
    assert all("regla_disparada" in r for r in resultados)
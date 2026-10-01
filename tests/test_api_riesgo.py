from fastapi.testclient import TestClient
from src.api_riesgo import app

client = TestClient(app)


def test_obtener_configuracion():
    response = client.get("/api/risk-config")

    assert response.status_code == 200

    data = response.json()

    assert "umbral_asistencia" in data
    assert "minimo_notas_deficientes" in data
    assert "operador_logico" in data


def test_actualizar_configuracion_valida():
    nueva_configuracion = {
        "umbral_asistencia": 85,
        "minimo_notas_deficientes": 3,
        "operador_logico": "OR"
    }

    response = client.put(
        "/api/risk-config",
        json=nueva_configuracion
    )

    assert response.status_code == 200

    data = response.json()

    assert data["configuracion"]["umbral_asistencia"] == 85
    assert data["configuracion"]["minimo_notas_deficientes"] == 3
    assert data["configuracion"]["operador_logico"] == "OR"


def test_asistencia_fuera_de_rango():
    configuracion = {
        "umbral_asistencia": 120,
        "minimo_notas_deficientes": 2,
        "operador_logico": "AND"
    }

    response = client.put(
        "/api/risk-config",
        json=configuracion
    )

    assert response.status_code == 422


def test_operador_invalido():
    configuracion = {
        "umbral_asistencia": 75,
        "minimo_notas_deficientes": 2,
        "operador_logico": "XOR"
    }

    response = client.put(
        "/api/risk-config",
        json=configuracion
    )

    assert response.status_code == 400
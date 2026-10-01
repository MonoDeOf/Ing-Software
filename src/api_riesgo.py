from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class RiskConfig(BaseModel):
    umbral_asistencia: float = Field(ge=0, le=100)
    minimo_notas_deficientes: int = Field(ge=0)
    operador_logico: str


configuracion_actual = RiskConfig(
    umbral_asistencia=75,
    minimo_notas_deficientes=2,
    operador_logico="AND"
)


@app.get("/api/risk-config")
def obtener_configuracion():
    return configuracion_actual


@app.put("/api/risk-config")
def actualizar_configuracion(config: RiskConfig):
    global configuracion_actual

    operador = config.operador_logico.upper()

    if operador not in ("AND", "OR"):
        raise HTTPException(
            status_code=400,
            detail="El operador lógico debe ser AND u OR."
        )

    configuracion_actual = RiskConfig(
        umbral_asistencia=config.umbral_asistencia,
        minimo_notas_deficientes=config.minimo_notas_deficientes,
        operador_logico=operador
    )

    return {
        "mensaje": "Configuración actualizada correctamente.",
        "configuracion": configuracion_actual
    }
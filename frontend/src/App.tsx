import { useEffect, useState } from "react";
import "./App.css";

type RiskConfig = {
  umbral_asistencia: number;
  minimo_notas_deficientes: number;
  operador_logico: "AND" | "OR";
};

function App() {
  const [umbralAsistencia, setUmbralAsistencia] = useState(75);
  const [minimoNotasDeficientes, setMinimoNotasDeficientes] = useState(2);
  const [operadorLogico, setOperadorLogico] = useState<"AND" | "OR">("AND");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/risk-config")
      .then((response) => response.json())
      .then((data: RiskConfig) => {
        setUmbralAsistencia(data.umbral_asistencia);
        setMinimoNotasDeficientes(data.minimo_notas_deficientes);
        setOperadorLogico(data.operador_logico);
      })
      .catch(() => {
        setMensaje("No se pudo cargar la configuración actual.");
      });
  }, []);

  const guardarConfiguracion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (umbralAsistencia < 0 || umbralAsistencia > 100) {
      setMensaje("El porcentaje de asistencia debe estar entre 0 y 100.");
      return;
    }

    if (minimoNotasDeficientes < 0) {
      setMensaje(
        "La cantidad mínima de notas deficientes no puede ser negativa."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/risk-config",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            umbral_asistencia: umbralAsistencia,
            minimo_notas_deficientes: minimoNotasDeficientes,
            operador_logico: operadorLogico,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setMensaje("Configuración actualizada correctamente.");
    } catch {
      setMensaje("No se pudo guardar la configuración.");
    }
  };

  return (
    <main className="page">
      <section className="card">
        <div className="header">
          <h1>Configuración de riesgo</h1>
          <p>
            Modifica los criterios utilizados para identificar estudiantes en
            situación de riesgo.
          </p>
        </div>

        <form onSubmit={guardarConfiguracion}>
          <div className="field">
            <label htmlFor="asistencia">
              Umbral crítico de asistencia
            </label>

            <div className="input-with-suffix">
              <input
                id="asistencia"
                type="number"
                min="0"
                max="100"
                value={umbralAsistencia}
                onChange={(e) =>
                  setUmbralAsistencia(Number(e.target.value))
                }
              />
              <span>%</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notas">
              Cantidad mínima de notas deficientes
            </label>

            <input
              id="notas"
              type="number"
              min="0"
              value={minimoNotasDeficientes}
              onChange={(e) =>
                setMinimoNotasDeficientes(Number(e.target.value))
              }
            />
          </div>

          <div className="field">
            <label htmlFor="operador">Operador lógico</label>

            <select
              id="operador"
              value={operadorLogico}
              onChange={(e) =>
                setOperadorLogico(e.target.value as "AND" | "OR")
              }
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>

          <button type="submit">Guardar cambios</button>

          {mensaje && (
            <p className="message">
              {mensaje}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default App;
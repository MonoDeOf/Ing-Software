import { useEffect, useState } from "react";
import "./App.css";

type RiskConfig = {
  umbral_asistencia: number;
  minimo_notas_deficientes: number;
  operador_logico: "AND" | "OR";
};

type StudentRisk = {
  rut_estudiante: string;
  nombre: string;
  apellido_paterno: string;
  asistencia: number;
  cantidad_notas_deficientes: number;
  cumple_condicion_asistencia: boolean;
  cumple_condicion_notas: boolean;
  operador_logico: string;
  regla_disparada: boolean;
  nivel_riesgo: "BAJO" | "MEDIO" | "ALTO";
};

function App() {
  const [umbralAsistencia, setUmbralAsistencia] = useState(75);
  const [minimoNotasDeficientes, setMinimoNotasDeficientes] = useState(2);
  const [operadorLogico, setOperadorLogico] = useState<"AND" | "OR">("AND");
  const [mensaje, setMensaje] = useState("");

  const [estudiantes, setEstudiantes] = useState<StudentRisk[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(true);
  const [errorEstudiantes, setErrorEstudiantes] = useState("");

  const cargarConfiguracion = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/risk-config"
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: RiskConfig = await response.json();

      setUmbralAsistencia(data.umbral_asistencia);
      setMinimoNotasDeficientes(data.minimo_notas_deficientes);
      setOperadorLogico(data.operador_logico);
    } catch {
      setMensaje("No se pudo cargar la configuración actual.");
    }
  };

  const cargarEstudiantes = async () => {
    try {
      setCargandoEstudiantes(true);
      setErrorEstudiantes("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/students-risk"
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: StudentRisk[] = await response.json();
      setEstudiantes(data);
    } catch {
      setErrorEstudiantes(
        "No se pudo cargar la lista de estudiantes."
      );
    } finally {
      setCargandoEstudiantes(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
    cargarEstudiantes();
  }, []);

  const guardarConfiguracion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (umbralAsistencia < 0 || umbralAsistencia > 100) {
      setMensaje(
        "El porcentaje de asistencia debe estar entre 0 y 100."
      );
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

      // Vuelve a calcular y cargar los niveles de riesgo
      await cargarEstudiantes();
    } catch {
      setMensaje("No se pudo guardar la configuración.");
    }
  };

  const obtenerClaseRiesgo = (
    nivel: StudentRisk["nivel_riesgo"]
  ) => {
    if (nivel === "ALTO") {
      return "risk-dot risk-high";
    }

    if (nivel === "MEDIO") {
      return "risk-dot risk-medium";
    }

    return "risk-dot risk-low";
  };

  return (
    <main className="page">
      <div className="content">
        <section className="card">
          <div className="header">
            <h1>Configuración de riesgo</h1>
            <p>
              Modifica los criterios utilizados para identificar
              estudiantes en situación de riesgo.
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
                  setOperadorLogico(
                    e.target.value as "AND" | "OR"
                  )
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

        <section className="card students-card">
          <div className="header">
            <h2>Lista de estudiantes</h2>
            <p>
              Nivel de riesgo calculado según la configuración
              vigente.
            </p>
          </div>

          {cargandoEstudiantes && (
            <p>Cargando estudiantes...</p>
          )}

          {errorEstudiantes && (
            <p className="message error">
              {errorEstudiantes}
            </p>
          )}

          {!cargandoEstudiantes &&
            !errorEstudiantes && (
              <div className="table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>RUT</th>
                      <th>Asistencia</th>
                      <th>Notas deficientes</th>
                      <th>Riesgo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {estudiantes.map((estudiante) => (
                      <tr key={estudiante.rut_estudiante}>
                        <td>
                          {estudiante.nombre}{" "}
                          {estudiante.apellido_paterno}
                        </td>

                        <td>
                          {estudiante.rut_estudiante}
                        </td>

                        <td>
                          {estudiante.asistencia}%
                        </td>

                        <td>
                          {
                            estudiante.cantidad_notas_deficientes
                          }
                        </td>

                        <td>
                          <div className="risk-cell">
                            <span
                              className={obtenerClaseRiesgo(
                                estudiante.nivel_riesgo
                              )}
                              aria-label={`Riesgo ${estudiante.nivel_riesgo}`}
                            />

                            <span>
                              {estudiante.nivel_riesgo}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default App;
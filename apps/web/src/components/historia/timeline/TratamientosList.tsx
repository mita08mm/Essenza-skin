import { Card, CardContent } from "@/components/ui";
import { Tratamiento } from "@/types/historia";

interface TratamientosListProps {
  tratamientos: Tratamiento[];
}

export default function TratamientosList({
  tratamientos,
}: TratamientosListProps) {
  return (
    <section className="card space-y-4">
      <div>
        <h4 className="text-xm">Historial medico</h4>
      </div>

      {tratamientos.map((tratamiento) => {
        return (
          <article key={tratamiento.id} className="relative">
            <Card>
              <CardContent className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-marengo">
                  {formatDate(tratamiento.fecha)}
                </p>
     
                <h3 className="mt-2 text-lg font-heading text-concreto">
                  {tratamiento.nombreTratamiento}
                </h3>

                <div className="mt-4 space-y-3 text-sm text-marengo">
                  <Field label="Tipo de tratamiento" value={formatTipo(tratamiento.tipoTratamiento)} />
                  <Field label="Zona tratada" value={tratamiento.zonaTratada} />
                  <Field label="Objetivo" value={tratamiento.objetivo} />
                  <Field label="Nota clínica" value={tratamiento.evaluacionInicial} />
                  <Field label="Procedimiento" value={tratamiento.protocolo} />
                  <Field label="Observaciones" value={tratamiento.observaciones} />
                  <Field label="Próxima consulta" value={formatOptionalDate(tratamiento.proximaSesion)} />
                </div>
              </CardContent>
            </Card>
          </article>
        );
      })}
    </section>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-marengo/70">{label}</p>
      <p className="mt-1 leading-6 text-concreto">{value}</p>
    </div>
  );
}

function formatTipo(tipo: Tratamiento['tipoTratamiento']) {
  const labels: Record<Tratamiento['tipoTratamiento'], string> = {
    FACIAL: 'Facial',
    CORPORAL: 'Corporal',
    CAPILAR: 'Capilar',
    COMBINADO: 'Combinado',
  };

  return labels[tipo];
}

function formatOptionalDate(date?: string) {
  if (!date) return undefined;

  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

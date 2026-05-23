interface EmptyStateProps {
  pacienteId: string;
}

export default function EmptyState({ pacienteId }: EmptyStateProps) {
  void pacienteId;
  return (
    <div className="card p-12 text-center">
      <p className="text-marengo">
        No hay consultas registradas
      </p>
    </div>
  );
}

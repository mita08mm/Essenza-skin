'use client';

export function Process() {
  const steps = [
    {
      number: '01',
      title: 'Consulta',
      description:
        'Evaluación completa de tu piel, cuero cabelludo y cabello con nuestros especialistas.',
    },
    {
      number: '02',
      title: 'Protocolo personalizado',
      description: 'Diseñamos un plan de tratamiento específico para tus necesidades únicas.',
    },
    {
      number: '03',
      title: 'Resultados visibles',
      description: 'Seguimiento continuo para garantizar los mejores resultados y tu satisfacción.',
    },
  ];

  return (
    <section
      className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-32"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
            }}
          >
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: '#c9a96e' }}
            >
              Nuestro Proceso
            </span>
          </div>
          <h2
            className="font-heading text-5xl font-bold lg:text-6xl"
            style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
          >
            Tu transformación en 3 pasos
          </h2>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connecting line */}
          <div
            className="absolute top-12 hidden h-0.5 md:block"
            style={{
              backgroundColor: '#c9a96e',
              left: '16.666%',
              right: '16.666%',
            }}
          />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div
                className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold"
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '3px solid #c9a96e',
                  color: '#c9a96e',
                }}
              >
                {step.number}
              </div>
              <h3 className="mb-3 text-xl font-bold" style={{ color: '#ffffff' }}>
                {step.title}
              </h3>
              <p className="leading-relaxed" style={{ color: '#b0b0b0' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

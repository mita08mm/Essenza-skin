// Validaciones compartidas con Zod (placeholder para futuro)

export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  telefono: (telefono: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(telefono);
  },
  
  documento: (documento: string): boolean => {
    return documento.length >= 7 && documento.length <= 12;
  },
};

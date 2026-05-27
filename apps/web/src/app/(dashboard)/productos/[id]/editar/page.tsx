import { ProductoForm } from '@/features/productos';

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductoForm mode="edit" productoId={id} />;
}

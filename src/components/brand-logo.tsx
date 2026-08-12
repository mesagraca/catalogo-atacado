import Image from "next/image";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return <Image className="brand-logo" src="/logo-mesa-graca.png" alt="Mesa & Graça" width={430} height={120} priority={priority} />;
}

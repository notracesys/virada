'use client';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  // As classes de tamanho (h-*, w-*) precisam ser removidas do className
  // e os valores de width/height precisam ser passados diretamente
  // para o componente Image do Next.js.
  // Como o tamanho é dinâmico, usamos `fill` e deixamos o contêiner pai
  // definir o tamanho.
  return (
    <div className={className}>
      <Image 
        src="/logo.png" 
        alt="Mega Hacker Virada Logo" 
        width={128}
        height={128}
        className="h-full w-full"
      />
    </div>
  );
}

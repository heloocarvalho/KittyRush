import { useEffect, useState } from 'react';

export function usePulo() {
  const [pulando, setPulando] = useState(false);

  function pular() {
    if (pulando) return;
    setPulando(true);
    setTimeout(() => setPulando(false), 650);
  }

  useEffect(() => () => {}, []);
  return { pulando, pular };
}

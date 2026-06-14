// src/components/MagneticButton.tsx
import { motion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ children, className = '' }: MagneticButtonProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic();

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={onMouseMove as unknown as React.MouseEventHandler<HTMLDivElement>}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import { createPortal } from 'react-dom';

export const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') return null;
  const el = document.getElementById('modal-root');
  return el ? createPortal(children, el) : null;
}; 
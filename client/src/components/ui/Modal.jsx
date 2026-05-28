import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="fixed inset-0 m-auto p-0 max-w-lg w-full rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop:backdrop-blur-md backdrop:bg-black/40 text-zinc-100 shadow-2xl focus:outline-none open:animate-in open:fade-in open:zoom-in-95 duration-200"
    >
      <div className="flex flex-col p-6 gap-4">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold tracking-wide">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer hover:bg-zinc-800 transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;

import * as React from 'react';
import ReactModal, { Styles } from 'react-modal';

interface IModalProps {
  isOpen: boolean;
  children: React.ReactChild;
  closeFunction: () => void;
  styles?: Styles;
  id?: string;
}

function Modal({ children, isOpen, closeFunction, styles, id }: IModalProps) {
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(107, 114, 128, 0.5)',
      zIndex: 99,
    },
    content: {
      position: 'null', // to override default styles
      top: 'null',
      left: 'null',
      right: 'null',
      bottom: 'null',
      background: '#fff',
      padding: 0,
      maxHeight: '85vh',
      zIndex: 100,
      ...styles?.content,
    },
  };

  return (
    <ReactModal
      id={id}
      isOpen={isOpen}
      closeTimeoutMS={250}
      onRequestClose={(e) => {
        e.stopPropagation();
        closeFunction();
      }}
      //  @ts-ignore
      style={customStyles}
    >
      <div
        className={`max-h-[${
          styles?.content?.maxHeight ? styles.content.maxHeight : '85vh'
        }]`}
      >
        {children}
      </div>
    </ReactModal>
  );
}

export { Modal };
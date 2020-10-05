import React from 'react'

import c from './Modal.module.scss'

type ModalProps = {
  clickHandle: any
}

const Modal: React.FC<ModalProps> = function Modal(props) {
  return (
    <div className={c['modal']}>
      <div className={c["modal__overlay"]} onClick={props.clickHandle}></div>
      <div className={c["modal__body"]}>
        <div className={c["modal__closer"]} onClick={props.clickHandle}>&times;</div>
        {props.children}
      </div>
    </div>
  );
}

export default Modal
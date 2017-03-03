import React from 'react';

export default function Modal({
  children,
  style = {},
  onClose = () => {}
}) {
  return (
    <div className="root">
      <div className="backdrop" onClick={onClose}/>
      <div className="modal" style={style}>
        {children}
        <div className="close" onClick={onClose}>X</div>
      </div>

      <style jsx>{`
        .root {
          position: fixed;
          left: 0; top: 0; right: 0; bottom: 0;
          overflow-y: auto;
        }

        .backdrop {
          position: absolute;
          background: rgba(255, 255, 255, .5);
          left: 0; top: 0; right: 0; bottom: 0;
        }

        .modal {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translate(-50%, 0);
          background: #fff;
          border-radius: 3px;

          box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
          z-index: 1;
        }

        .close {
          position: absolute;
          right: 16px;
          top: 16px;
        }
      `}</style>
    </div>
  )
}
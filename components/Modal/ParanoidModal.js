import React from 'react';
import Modal from './';

function ParanoidModal({ onModalClose }) {
  return (
    <Modal>
      <div className="root">
        <h1>(((( ;°Д°))))</h1>
        <p>訊息太多回不完啦啊啊啊</p>
        <button onClick={onModalClose}>好啦乖我會回</button>
      </div>
      <style jsx>{`
        .root {
          padding: 40px;
          text-align: center;
        }

        .root h1 {
          animation: shake 0.1s infinite;
        }

        @keyframes shake {
          0% {
            transform: translate3d(0, 0, 0);
          }
          10% {
            transform: translate3d(0, 5px, 0);
          }
          20% {
            transform: translate3d(2px, 3px, 0);
          }
          30% {
            transform: translate3d(2px, -5px, 0);
          }
          50% {
            transform: translate3d(-3px, 3px, 0);
          }
          70% {
            transform: translate3d(1px, -2px, 0);
          }
          90% {
            transform: translate3d(-4px, 2px, 0);
          }
        }
      `}</style>
    </Modal>
  );
}

export default ParanoidModal;

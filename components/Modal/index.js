import React, { PureComponent } from 'react';

export default class Modal extends PureComponent {
  componentDidMount = () => {
    // prevent body scroll with the modal scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
  };

  componentWillUnmount = () => {
    document.body.style.overflow = 'initial';
    document.body.style.position = 'initial';
  };

  render() {
    const { children, style = {}, onClose = () => {} } = this.props;
    return (
      <div className="root">
        <div className="container">
          <div className="backdrop" onClick={onClose} />
          <div className="modal" style={style}>
            {children}
            <div className="close" onClick={onClose}>
              X
            </div>
          </div>
        </div>

        <style jsx>{`
          .root {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
          }
          .container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .backdrop {
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
          }
          .modal {
            position: relative;
            display: inline-block;
            margin: 16% 0;
            background: #fff;
            border-radius: 3px;
            box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3),
              0 15px 12px rgba(0, 0, 0, 0.22);
            z-index: 1;
          }
          .close {
            position: absolute;
            cursor: pointer;
            right: 16px;
            top: 16px;
          }
        `}</style>
      </div>
    );
  }
}

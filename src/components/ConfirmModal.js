import React from 'react';

function ConfirmModal({onSumbit, onCancel, message}) {
  return <div className="modal">
    <p>{message || "Are you sure?"}</p>
    <button onClick={onSumbit}>Yes, I'm sure</button>
    <button onClick={onCancel}>Cancel</button>
  </div>;
}

export default ConfirmModal

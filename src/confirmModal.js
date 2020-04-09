import React from 'react';

function ConfirmModal({onSumbit, onCancel}) {
  console.log(onCancel)
  console.log(onSumbit)
  return <div>
    <p>Are you sure?</p>
    <button onClick={onSumbit}>Yes, I'm sure</button>
    <button onClick={onCancel}>Cancel</button>
  </div>;
}

export default ConfirmModal

import React from 'react';
import './Popup.css';

function emit(type, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type },
      function (response) {
        alert(response);
      }
    );
  });
}

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>选择要检查的汉字</p>
        <button
          onClick={() => {
            emit('enable', (response) => alert(response));
          }}
        >
          Enable
        </button>
      </header>
    </div>
  );
};

export default Popup;

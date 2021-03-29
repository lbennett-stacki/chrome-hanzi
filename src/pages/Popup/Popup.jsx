import React, { useState, useEffect } from 'react';
import './Popup.css';
import { capitalizeFirst } from '../Content/modules/capitalize';

function emit(type, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type }, callback);
  });
}

function enabledText(isEnabled) {
  return isEnabled ? 'disable' : 'enable';
}

const Popup = () => {
  const appKey = 'enable:app';
  const voiceKey = 'enable:voice';
  const [appEnabled, setAppEnabled] = useState(
    window.localStorage.getItem(appKey) || false
  );
  const [voiceEnabled, setVoiceEnabled] = useState(
    window.localStorage.getItem(voiceKey) || false
  );

  function toggleAppEnabled() {
    const next = !appEnabled;
    setAppEnabled(next);
    window.localStorage.setItem(appKey, next);
  }
  function toggleVoiceEnabled() {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    window.localStorage.setItem(voiceKey, next);
  }

  const appEnabledText = enabledText(appEnabled);
  const voiceEnabledText = enabledText(voiceEnabled);

  useEffect(() => {
    appEnabled && emit(`${enabledText(!appEnabled)}`);
    voiceEnabled && emit(`${enabledText(!voiceEnabled)}:voice`);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>选择要检查的汉字</p>

        <button
          onClick={() => {
            emit(`${appEnabledText}`);
            toggleAppEnabled();
          }}
        >
          {capitalizeFirst(appEnabledText)} app
        </button>

        <button
          onClick={() => {
            emit(`${voiceEnabledText}:voice`);
            toggleVoiceEnabled();
          }}
        >
          {capitalizeFirst(voiceEnabledText)} voice
        </button>
      </header>
    </div>
  );
};

export default Popup;

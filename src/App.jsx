// src/App.jsx
import React, { useState } from 'react';
import Quiz from './Quiz';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState('data_en.json'); // Default JSON file

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='title'>JLPT Vocabulary Quiz</h1>
        <div>
          <label htmlFor="file-select">Choose a file: </label>
          <select id="file-select" value={selectedFile} onChange={handleFileChange}>
            <option value="data_en.json">English</option>
            <option value="data_vi.json">Vietnamese</option>
            <option value="data_custom.json">Japanese</option>
            {/* Add more options here as needed */}
          </select>
        </div>
      </header>
      <Quiz selectedFile={selectedFile} />
    </div>
  );
};

export default App;

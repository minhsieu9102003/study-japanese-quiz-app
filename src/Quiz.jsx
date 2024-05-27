// src/Quiz.jsx
import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ selectedFile }) => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showPronounce, setShowPronounce] = useState(false);
    const [familiarWords, setFamiliarWords] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/${selectedFile}`);
            const data = await response.json();
            setWords(data);

            const initialIndex = getRandomIndex(data.length, new Set());
            setCurrentWordIndex(initialIndex);
            generateOptions(data, initialIndex);
        };

        const storedFamiliarWords = JSON.parse(localStorage.getItem('familiarWords')) || [];
        setFamiliarWords(new Set(storedFamiliarWords));

        fetchData();
    }, [selectedFile]);

    const getRandomIndex = (length, excludedIndices) => {
        let index;
        do {
            index = Math.floor(Math.random() * length);
        } while (excludedIndices.has(index));
        return index;
    };

    const generateOptions = (words, index) => {
        const correctWord = words[index];
        const start = Math.max(0, index - 3);
        const end = Math.min(words.length, index + 4);
        const nearestWords = words.slice(start, end).filter(word => word.word !== correctWord.word);
        let options = [correctWord, ...nearestWords.slice(0, 3)];
        options = options.sort(() => Math.random() - 0.5); // Shuffle options once

        setOptions(options);
        setShowPronounce(false);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowPronounce(true);
        if (option.word === words[currentWordIndex].word) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNext = () => {
        const nextIndex = getRandomIndex(words.length, familiarWords);
        setCurrentWordIndex(nextIndex);
        generateOptions(words, nextIndex);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleCheckboxChange = () => {
        const newFamiliarWords = new Set(familiarWords);
        const currentWord = words[currentWordIndex].word;
        if (newFamiliarWords.has(currentWord)) {
            newFamiliarWords.delete(currentWord);
        } else {
            newFamiliarWords.add(currentWord);
        }
        setFamiliarWords(newFamiliarWords);
        localStorage.setItem('familiarWords', JSON.stringify(Array.from(newFamiliarWords)));
    };

    if (words.length === 0) return <div>Loading...</div>;

    const currentWord = words[currentWordIndex];

    return (
        <div className="quiz">
            <h2>What is the meaning of: {currentWord.word}</h2>
            <div className="options">
                {options.map(option => (
                    <button
                        key={option.word}
                        className={`option ${selectedOption ?
                            (option.word === currentWord.word ? 'correct' :
                                (option.word === selectedOption.word ? 'incorrect' : '')) : ''}`}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                    >
                        {option.meaning} {showPronounce && `(${option.pronounce})`}
                    </button>
                ))}
            </div>
            {selectedOption && (
                <button className="next-btn" onClick={handleNext}>
                    Next
                </button>
            )}
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="familiar-checkbox"
                    checked={familiarWords.has(currentWord.word)}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="familiar-checkbox">Mark as familiar</label>
            </div>
        </div>
    );
};

export default Quiz;

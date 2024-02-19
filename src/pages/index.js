import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per question
  const [totalTimeLeft, setTotalTimeLeft] = useState(20 * 10); // Total time for 10 questions

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        if (prevTimeLeft === 0) {
          handleNextQuestion();
          return 20; // Reset timer for next question
        }
        return prevTimeLeft - 1;
      });
      setTotalTimeLeft(prevTotalTimeLeft => prevTotalTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
    if (totalTimeLeft === 0) {
      setShowResult(true);
    }
  }, [totalTimeLeft]);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(response => response.json())
      .then(data => {
        const formattedQuestions = data.results.map(question => {
          const isBoolean = question.type === 'boolean';
          const options = isBoolean ? ['True', 'False'] : [...question.incorrect_answers, question.correct_answer];

          return {
            question: question.question,
            options: options,
            correctAnswer: isBoolean ? question.correct_answer : question.correct_answer,
            isBoolean: isBoolean
          };
        });
        setQuestions(formattedQuestions);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  
    setSelectedOption('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20); // Reset time for the next question
    } else {
      setShowResult(true);
    }
  };
  

  const handleOptionSelect = option => {
    setSelectedOption(option);
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption('');
    setScore(0);
    setShowResult(false);
    setTimeLeft(20);
    setTotalTimeLeft(20 * 10);
  };

  return (
    <div className="container mx-auto p-4">
      {showResult ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
          <p>You scored {score} out of {questions.length}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4" onClick={handleResetQuiz}>Retry Quiz</button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Question {currentQuestion + 1}</h1>
          <p>{questions[currentQuestion]?.question}</p>
          <p>Time Left: {timeLeft} seconds</p>
          <div className="mt-4">
            {questions[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                className={`mr-2 mb-2 px-4 py-2 rounded ${selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2" onClick={handleNextQuestion}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Test setup */}
      {questions.length === 0 && (
        <div className="max-w-md mx-auto mt-8">
          {/* Test rules */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* ... */}
          </div>
  
          {/* Name and ID inputs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Enter your information to start the test</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full"
              />
              <Input 
                type="text"
                placeholder="Your employee ID (e.g. W001)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={onBack} variant="outline" className="w-1/2">
                  Back
                </Button>
                <Button
                  onClick={startTest}
                  disabled={!userName.trim() || !employeeId.trim()}
                  className="w-1/2" 
                >
                  Start Test  
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Test active */}
      {questions.length > 0 && !testComplete && (
        <div>
          {usedFallbackQuestions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-yellow-700 text-sm">
                Note: Using backup questions due to database connection issues. Your score will still be recorded.
              </p>
            </div>
          )}

          {/* Progress bar */}
          <ProgressBar current={currentQuestion + 1} total={questions.length} />

          {/* Timer */}  
          <div className="my-4">
            <TestTimer timeLimit={TEST_CONFIG.timeLimit} onTimeUp={finishTest} /> 
          </div>

          {/* Question */}
          <Question
            question={questions[currentQuestion]} 
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion]}
          />

          {/* Next/Previous buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"  
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}  
              disabled={answers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {/* Test complete */}
      {testComplete && (
        <>
          {showReview ? (
            <QuestionReview
              questions={questions}
              answers={answers} 
              onHide={() => setShowReview(false)}
            />
          ) : (
            <TestResults
              name={userName}
              score={score}
              totalQuestions={questions.length}
              questions={questions}
              answers={answers}
              passingScore={TEST_CONFIG.passingScore}
              onBack={onBack}
              showReviewButton={true}
              onReview={() => setShowReview(true)}
            />
          )}
        </>
      )}
    </div>
  );  
};

export default RealTest;
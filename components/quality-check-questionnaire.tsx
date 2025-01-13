"use client";
import React, { useState } from "react";

const QualityCheckQuestionnaire = () => {
  const steps = [
    {
      id: 1,
      title: "Basic Requirements",
      questions: [
        {
          id: "q1_1",
          text: "Does your product have documented specifications?",
        },
        { id: "q1_2", text: "Is there a quality control process in place?" },
        {
          id: "q1_3",
          text: "Are all materials sourced from approved suppliers?",
        },
      ],
    },
    {
      id: 2,
      title: "Production Standards",
      questions: [
        { id: "q2_1", text: "Is the production environment controlled?" },
        { id: "q2_2", text: "Are calibrated measuring instruments used?" },
        { id: "q2_3", text: "Is there a batch tracking system?" },
      ],
    },
    {
      id: 3,
      title: "Quality Management",
      questions: [
        { id: "q3_1", text: "Is there a designated quality manager?" },
        { id: "q3_2", text: "Are regular quality audits conducted?" },
        {
          id: "q3_3",
          text: "Is there a documented non-conformance procedure?",
        },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stepApplicable, setStepApplicable] = useState({});

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleStepApplicable = (stepId, value) => {
    setStepApplicable((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const canProceed = () => {
    const currentQuestions = steps[currentStep].questions;
    if (!stepApplicable[steps[currentStep].id]) {
      return true;
    }
    return currentQuestions.every((q) => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Enhanced Step Header */}
        <div className="bg-blue-500 text-white p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-semibold">
              {steps[currentStep].title}
            </h1>
            <span className="text-lg">
              Step {currentStep + 1}/{steps.length}
            </span>
          </div>
          <div className="h-2 bg-blue-400 rounded-full mt-4">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Current step content */}
        <div className="p-6">
          {/* Enhanced Step applicability toggle */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-gray-50 px-6 py-4 rounded-lg shadow-sm">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stepApplicable[steps[currentStep].id] !== false}
                  onChange={(e) =>
                    handleStepApplicable(
                      steps[currentStep].id,
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  This section is applicable
                </span>
              </label>
            </div>
          </div>

          {stepApplicable[steps[currentStep].id] !== false && (
            <div className="space-y-6">
              {steps[currentStep].questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm"
                >
                  <p className="text-gray-700 mb-4 font-medium">
                    {question.text}
                  </p>
                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={() => handleAnswer(question.id, true)}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                        answers[question.id] === true
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-white border-2 border-green-500 text-green-500 hover:bg-green-50"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer(question.id, false)}
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                        answers[question.id] === false
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="p-6 bg-gray-50 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              currentStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              canProceed()
                ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityCheckQuestionnaire;

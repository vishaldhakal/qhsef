"use client";
import React, { useState, useEffect } from "react";
import ThankYouPage from "@/components/ThankYouPage";
import { Loader2 } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";

const QualityCheckQuestionnaire = () => {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<{
    [key: number]: "yes" | "no" | null;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state to track the current question index
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://cim.baliyoventures.com/api/koshi_quality_standard/requirements/"
        );
        const data = await response.json();
        setSteps(data.results);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (currentQuestionIndex < steps[currentStep].questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // 300ms delay to allow for exit animation
    } else {
      setTimeout(() => {
        handleNext();
      }, 300); // 300ms delay to allow for exit animation
    }
  };

  const handleSelection = (stepId: number, value: "yes" | "no") => {
    setSelected((prev) => ({ ...prev, [stepId]: value }));
    setCurrentQuestionIndex(0); // Reset question index when the step is changed
    if (value === "no") {
      handleNext(); // Directly proceed to the next step if "No" is selected
    }
  };

  const canProceed = () => {
    const currentQuestions = steps[currentStep]?.questions || [];
    if (selected[currentStep] === "yes") {
      const allAnswered = currentQuestions.every(
        (q: { id: number }) => answers[q.id] !== undefined
      );
      return allAnswered;
    }
    return true;
  };

  const handleNext = () => {
    if (selected[currentStep] === "yes" && !canProceed()) {
    } else {
      setError(null);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setCurrentQuestionIndex(0); // Reset the question index when moving to the next step
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCurrentQuestionIndex(0); // Reset the question index when going back
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    const payload = steps.map((step, index) => {
      const answersArray = step.questions.map(
        (question: { id: number; text: string }) => ({
          question_id: question.id,
          answer: answers[question.id] || false, // Default to false if not answered
        })
      );

      return {
        requirement_id: step.id, // Assuming each step has a unique ID
        is_relevant: selected[index] === "yes", // Set based on the user's selection
        answers: answersArray.length > 0 ? answersArray : undefined, // Include answers only if there are any
      };
    });

    try {
      const response = await fetch(
        "https://cim.baliyoventures.com/api/koshi_quality_standard/calculate-points/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTotalPoints(data.total_points);
      setEarnedPoints(data.earned_points);
      setShowThankYou(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowThankYou(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg px-4 sm:px-10">
        <div className="flex justify-between items-center mb-6 mt-5">
          <div className="flex items-center mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-blue-800 font-bold">
              {steps[currentStep]?.name}
            </h2>
            {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
          <div className="ml-4" style={{ width: "80px", height: "80px" }}>
            <CircularProgressbar
              value={progressPercentage}
              text={`${currentStep + 1}/${totalSteps}`}
              styles={buildStyles({
                pathTransition: "stroke-dashoffset 0.5s ease 0s",
                pathColor: `#3b82f6`,
                textColor: "#3b82f6",
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
              })}
            />
          </div>
        </div>
        <div className="space-y-4 mb-5">
          <div className="text-gray-500 text-lg font-medium mb-4 flex items-center">
            It is Applicable to your Business?
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handleSelection(currentStep, "yes")}
              className={`flex items-center justify-center w-full sm:w-1/2 p-4 border-2 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${
                selected[currentStep] === "yes"
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <img src="/yes.svg" alt="Yes" className="h-10 w-10 mr-2" />
                <span
                  className={`font-medium text-sm sm:text-base ${
                    selected[currentStep] === "yes"
                      ? "text-green-500"
                      : "text-gray-800"
                  }`}
                >
                  Yes, it is Applicable
                </span>
              </div>
            </button>

            <button
              onClick={() => handleSelection(currentStep, "no")}
              className={`flex items-center justify-center w-full sm:w-1/2 p-4 py-7 border-2 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${
                selected[currentStep] === "no"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <img src="/no.svg" alt="No" className="h-10 w-10 mr-2" />
                <span
                  className={`font-medium text-sm sm:text-base ${
                    selected[currentStep] === "no"
                      ? "text-red-500"
                      : "text-gray-800"
                  }`}
                >
                  No, it is not Applicable
                </span>
              </div>
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Render current question */}
        {selected[currentStep] && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-6"
            >
              {steps[currentStep]?.questions
                .slice(currentQuestionIndex, currentQuestionIndex + 1)
                .map(
                  (
                    question: { id: number; text: string; points: number },
                    index: number
                  ) => (
                    <div key={question.id} className="rounded-lg">
                      <p className="text-gray-700 mb-4 flex justify-between text-sm sm:text-base">
                        {question.text} <span>[ {question.points} ]</span>
                      </p>
                      <div className="">
                        <button
                          onClick={() =>
                            handleAnswer(question.id.toString(), true)
                          }
                          className={`mx-6 py-2 px-2 border rounded-xl transition-all text-sm w-24 ${
                            answers[question.id] === true
                              ? "bg-green-500 text-white"
                              : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-green-100"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() =>
                            handleAnswer(question.id.toString(), false)
                          }
                          className={`mx-6 py-2 px-2 border rounded-xl transition-all text-sm w-24 ${
                            answers[question.id] === false
                              ? "bg-red-500 text-white"
                              : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-red-100"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )
                )}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex justify-between mt-6">
          <div className="mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl"
              }`}
            >
              Previous
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={
                currentStep === steps.length - 1 ? handleFinish : handleNext
              }
              className={`px-6 py-2 rounded-lg ${
                canProceed()
                  ? "bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl"
              }`}
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {showThankYou && (
        <ThankYouPage
          totalPoints={totalPoints}
          earnedPoints={earnedPoints}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default QualityCheckQuestionnaire;

"use client";
import React, { useState, useEffect } from "react";
import { StepIndicator } from "@/components/ui/step-indicator";

const QualityCheckQuestionnaire = () => {
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [stepApplicable, setStepApplicable] = useState<{
    [key: number]: boolean;
  }>({});
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (selected === "yes") {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    }
  };

  const handleStepApplicable = (stepId: number, value: boolean) => {
    setStepApplicable((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const canProceed = () => {
    const currentQuestions = steps[currentStep]?.questions || [];
    if (selected === "yes") {
      const allAnswered = currentQuestions.every(
        (q: { id: number }) => answers[q.id] !== undefined
      );
      return allAnswered;
    }
    return true;
  };

  const handleNext = () => {
    if (selected === "yes" && !canProceed()) {
      setError("Please answer all questions before proceeding.");
    } else {
      setError(null);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      })),
    };

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
      console.log("Data submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Left Sidebar with StepIndicator */}
      <div className="w-1/3 mx-auto rounded-xl mt-5 bg-white shadow-md p-6">
        <div className="mb-6 mt-5 ml-5">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
            Quality Check
          </h1>
          <p className="text-gray-600 mt-2">
            Please answer the following questions to check the quality of the
            product.
          </p>
        </div>
        <StepIndicator
          currentStep={currentStep + 1}
          steps={steps}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Right Content Area */}
      <div className="w-full max-w-3xl mx-auto p-6  bg-white  rounded-lg px-10">
        <div className="flex justify-between items-center mb-6 mt-5">
          <span className="text-2xl font-semibold text-blue-800">
            {steps[currentStep]?.name || "Loading..."}
          </span>

          <span className="text-gray-500">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
        <div className="space-y-4 mb-5">
          <div className="text-gray-500 text-lg font-medium mb-4">
            Is it Applicable to your Business?
          </div>
          <div className="flex space-x-4">
            {/* Yes Button */}
            <button
              onClick={() => setSelected("yes")}
              className={`flex items-center justify-center w-1/2 p-4 border-2 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${
                selected === "yes" ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center">
                {/* Yes SVG */}
                <img src="/yes.svg" alt="Yes" className="h-12 w-12 mr-2" />
                <span
                  className={`font-medium ${
                    selected === "yes" ? "text-green-500" : "text-gray-800"
                  }`}
                >
                  Yes, it is Applicable
                </span>
              </div>
            </button>

            {/* No Button */}
            <button
              onClick={() => setSelected("no")}
              className={`flex items-center justify-center w-1/2 p-4 py-7 border-2 rounded-xl shadow hover:shadow-lg transition-all duration-200 ${
                selected === "no" ? "border-red-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center">
                {/* No SVG */}
                <img src="/no.svg" alt="No" className="h-12 w-12 mr-2" />
                <span
                  className={`font-medium ${
                    selected === "no" ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  No, it is not Applicable
                </span>
              </div>
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="space-y-6">
          {steps[currentStep]?.questions.map(
            (question: { id: number; text: string }, index: number) => (
              <div key={question.id} className="p-4 rounded-lg">
                <p className="text-gray-700 mb-4">
                  {index + 1}. {question.text}
                </p>
                <div className="">
                  <button
                    onClick={() => handleAnswer(question.id.toString(), true)}
                    className={`mx-6 py-2 px-2 border rounded-xl transition-all text-sm w-24 ${
                      answers[question.id] === true
                        ? "bg-green-500 text-white"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-green-100"
                    }`}
                    disabled={selected === "no"}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(question.id.toString(), false)}
                    className={`mx-6 py-2 px-2 border rounded-xl transition-all text-sm w-24 ${
                      answers[question.id] === false
                        ? "bg-red-500 text-white"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-red-100"
                    }`}
                    disabled={selected === "no"}
                  >
                    No
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        <div className="flex justify-between mt-6">
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
  );
};

export default QualityCheckQuestionnaire;

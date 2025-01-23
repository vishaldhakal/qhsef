"use client";

import React, { useState, useEffect } from "react";
import ThankYouPage from "@/components/ThankYouPage";
import { Trophy, Award } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/ui/spinner";
import {
  Requirement,
  RequirementsResponse,
  RequirementsResponseSchema,
  FormData,
  FormDataSchema,
} from "@/types/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const QualityCheckQuestionnaire = () => {
  const [steps, setSteps] = useState<Requirement[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, "yes" | "no" | null>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [file_url, setFileUrl] = useState("");
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalSteps = steps.length;
  const progressPercentage = Math.round(
    ((currentStep +
      (currentQuestionIndex / steps[currentStep]?.questions.length || 0)) /
      totalSteps) *
      100
  );

  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://cim.baliyoventures.com/api/koshi_quality_standard/requirements/"
        );
        const data = await response.json();

        const parsedData = RequirementsResponseSchema.parse(data);
        setSteps(parsedData.results);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (questionId: number, value: boolean) => {
    if (loading) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (currentQuestionIndex < steps[currentStep]?.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setSelected((prev) => ({ ...prev, [currentStep + 1]: null }));
      setIsQuestionVisible(true);
    } else {
      handleFinish();
    }
  };

  const handleSelection = async (stepId: number, value: "yes" | "no") => {
    if (loading) return;

    setSelected((prev) => ({ ...prev, [stepId]: value }));
    setCurrentQuestionIndex(0);
    setIsQuestionVisible(false);

    if (value === "no") {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (currentStep === steps.length - 1) {
        handleFinish();
      } else {
        handleNext();
      }
    }
  };

  const canProceed = () => {
    const currentQuestions = steps[currentStep]?.questions || [];
    const allAnswered = currentQuestions.every(
      (q: { id: number }) => answers[q.id] !== undefined
    );
    return allAnswered;
  };

  const handleNext = () => {
    setIsQuestionVisible(true);
    if (selected[currentStep] === "yes" && !canProceed()) {
    } else {
      setError(null);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handlePrevious = () => {
    setIsQuestionVisible(true);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleFinish = async () => {
    setShowPopup(true);
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      ...formData,
      requirements: steps.map((step, index) => ({
        requirement_id: step.id,
        is_relevant: selected[index] === "yes",
        answers: step.questions.map((question) => ({
          question_id: question.id,
          answer: answers[question.id] || false,
        })),
      })),
    };

    try {
      const response = await fetch(
        "https://cim.baliyoventures.com/api/koshi_quality_standard/calculate-points/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setTotalPoints(data.total_points);
      setEarnedPoints(data.earned_points);
      setFileUrl(data.file_url);
      setShowThankYou(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetAllStates = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelected({});
    setError(null);
    setShowThankYou(false);
    setTotalPoints(0);
    setFileUrl("");
    setEarnedPoints(0);
    setCurrentQuestionIndex(0);
    setIsQuestionVisible(true);
    setShowPopup(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  const handleCancel = () => {
    resetAllStates();
  };

  const handleClosePopup = () => {
    resetAllStates();
  };

  const questionVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6"
      style={{ height: "100vh" }}
    >
      {loading && (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      )}

      <div className="p-5 mt-4 ml-4 font-bold">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">← Back to home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Do your Self Assessment on QHSEF
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Level {currentStep + 1}
          </p>
          <div className="flex items-center gap-2 justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}% of 100%
            </span>
          </div>
        </motion.div>

        <Card className="p-4 sm:p-8 backdrop-blur-sm bg-white/90 shadow-xl rounded-2xl border-t-4 border-t-purple-500">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="space-y-6"
          >
            {isQuestionVisible && (
              <div className="flex flex-col sm:flex-row sm:items-center items-center justify-center sm:justify-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-2 sm:mb-0">
                  Is
                  <span className="border-b-2 border-purple-500">
                    {" "}
                    {steps[currentStep]?.name}{" "}
                  </span>{" "}
                  applicable to your business?
                </h2>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {!selected[currentStep] ? (
                  <motion.div
                    key="selection-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelection(currentStep, "yes")}
                      className={`relative overflow-hidden group ${
                        selected[currentStep] === "yes"
                          ? "ring-2 ring-green-500 bg-green-50"
                          : "hover:bg-gray-50"
                      } p-4 sm:p-6 rounded-xl border-2 transition-all duration-200`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          Yes, it&apos;s applicable
                        </span>
                      </div>
                      {selected[currentStep] === "yes" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelection(currentStep, "no")}
                      className={`relative overflow-hidden group ${
                        selected[currentStep] === "no"
                          ? "ring-2 ring-red-500 bg-red-50"
                          : "hover:bg-gray-50"
                      } p-4 sm:p-6 rounded-xl border-2 transition-all duration-200`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          No, not applicable
                        </span>
                      </div>
                      {selected[currentStep] === "no" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✕</span>
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    {steps[currentStep]?.questions
                      .slice(currentQuestionIndex, currentQuestionIndex + 1)
                      .map((question) => (
                        <motion.div
                          key={question.id}
                          variants={questionVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="space-y-4"
                        >
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                            {steps[currentStep]?.name}
                          </h3>
                          <div className="flex flex-col min-h-[200px] sm:min-h-[150px] justify-between">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <p className="text-gray-800 font-medium text-sm sm:text-base flex-1">
                                {question.text} ?
                              </p>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                                {question.points} pts
                              </span>
                            </div>
                            <div className="flex gap-4 mt-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  !loading && handleAnswer(question.id, true)
                                }
                                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm font-medium transition-all ${
                                  answers[question.id] === true
                                    ? "bg-green-500 text-white"
                                    : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-green-50"
                                }`}
                                disabled={loading}
                              >
                                Yes
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  !loading && handleAnswer(question.id, false)
                                }
                                className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm font-medium transition-all ${
                                  answers[question.id] === false
                                    ? "bg-red-500 text-white"
                                    : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-red-50"
                                }`}
                                disabled={loading}
                              >
                                No
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-row sm:flex-row items-center justify-between pt-6 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                disabled={true}
                className={`w-full sm:w-auto sm:px-6 sm:py-3 px-4 py-2 rounded-xl font-medium transition-all bg-gray-100 text-gray-400 cursor-not-allowed`}
              >
                Previous
              </motion.button>

              <div className="w-16 h-16 sm:w-20 sm:h-20 sm:mt-4">
                <CircularProgressbar
                  value={progressPercentage}
                  text={`${currentStep + 1}/${totalSteps}`}
                  styles={buildStyles({
                    pathColor: `rgba(147, 51, 234, ${
                      progressPercentage / 100
                    })`,
                    textColor: "#6b21a8",
                    trailColor: "#f3e8ff",
                    textSize: "24px",
                  })}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
                disabled={
                  loading || currentStep !== steps.length - 1 || !canProceed()
                }
                className={`w-full sm:w-auto sm:px-6 sm:py-3 px-4 py-2 rounded-xl sm:font-medium font-sm transition-all ${
                  currentStep === steps.length - 1 && canProceed() && !loading
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Complete
              </motion.button>
            </div>
          </motion.div>
        </Card>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Complete Assessment
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-200/50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showThankYou && (
        <ThankYouPage
          totalPoints={totalPoints}
          earnedPoints={earnedPoints}
          file_url={file_url}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default QualityCheckQuestionnaire;

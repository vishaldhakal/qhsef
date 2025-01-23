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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, {
    message: "Please enter a valid phone number (minimum 10 digits)",
  }),
});

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
  const [file_url, setFileUrl] = useState("");
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true); // Added state for question visibility

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 0) / totalSteps) * 100;

  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  // Add new state for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showGeneratingAnimation, setShowGeneratingAnimation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

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

    // Check if this is the last question of the current step
    const isLastQuestion =
      currentQuestionIndex === steps[currentStep].questions.length - 1;
    const isLastStep = currentStep === steps.length - 1;

    if (isLastQuestion) {
      if (isLastStep) {
        // If it's the last question of the last step, show the modal after a brief delay
        setTimeout(() => {
          setShowPopup(true);
        }, 500);
      } else {
        // If it's just the last question of the current step, move to next step
        setTimeout(() => {
          handleNext();
        }, 300);
      }
    } else {
      // If it's not the last question, move to next question
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const handleSelection = (stepId: number, value: "yes" | "no") => {
    setSelected((prev) => ({ ...prev, [stepId]: value }));
    setCurrentQuestionIndex(0);
    setIsQuestionVisible(false); // Hide the question

    if (value === "no") {
      setTimeout(() => {
        if (currentStep === steps.length - 1) {
          handleFinish();
        } else {
          handleNext();
        }
      }, 300);
    }
  };

  const canProceed = () => {
    const currentQuestions = steps[currentStep]?.questions || [];
    // Check if we are on the last step
    if (currentStep === steps.length - 1) {
      // If on the last step, ensure all questions are answered
      const allAnswered = currentQuestions.every(
        (q: { id: number }) => answers[q.id] !== undefined
      );
      return allAnswered; // Only allow proceeding if all questions are answered
    }
    return true; // Allow proceeding if not on the last step
  };

  const handleNext = () => {
    setIsQuestionVisible(true); // Reset question visibility
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
    setIsQuestionVisible(true); // Reset question visibility
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCurrentQuestionIndex(0); // Reset the question index when going back
    }
  };

  const handleFinish = async () => {
    setShowPopup(true); // Show the popup when the user finishes the questionnaire
  };

  // Add reset function
  const resetQuestionnaire = () => {
    setAnswers({});
    setSelected({});
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setShowPopup(false);
    setIsQuestionVisible(true);
    form.reset();
  };

  // Update handleSubmitDetails
  const handleSubmitDetails = async (values: z.infer<typeof formSchema>) => {
    setShowGeneratingAnimation(true);
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      requirements: steps.map((step, index) => ({
        requirement_id: step.id,
        is_relevant: selected[index] === "yes",
        answers: step.questions.map(
          (question: { id: number; text: string }) => ({
            question_id: question.id,
            answer: answers[question.id] || false,
          })
        ),
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
      setTotalPoints(data.total_points);
      setEarnedPoints(data.earned_points);
      setFileUrl(data.file_url);

      // Add delay to show animation
      setTimeout(() => {
        setShowGeneratingAnimation(false);
        setShowThankYou(true);
      }, 2000);
    } catch (error) {
      console.error("Error submitting data:", error);
      setShowGeneratingAnimation(false);
    }
  };

  const handleClosePopup = () => {
    setShowThankYou(false);
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
            {isQuestionVisible && ( // Conditional render for the question
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
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                  <motion.div
                    key="question-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center p-4 sm:p-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                      {steps[currentStep]?.name}
                    </h3>
                    {steps[currentStep]?.questions
                      .slice(currentQuestionIndex, currentQuestionIndex + 1)
                      .map((question: any) => (
                        <div key={question.id} className="space-y-4">
                          <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between md:items-center sm:items-center mb-4">
                            <p
                              className="text-gray-800 font-medium text-sm sm:text-base mb-2 sm:mb-0"
                              style={{ height: "50px" }}
                            >
                              {question.text}
                            </p>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full items-center justify-center text-xs sm:text-sm">
                              {question.points} pts
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleAnswer(question.id.toString(), true)
                              }
                              className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm font-medium transition-all ${
                                answers[question.id] === true
                                  ? "bg-green-500 text-white"
                                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-green-50"
                              }`}
                            >
                              Yes
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleAnswer(question.id.toString(), false)
                              }
                              className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm font-medium transition-all ${
                                answers[question.id] === false
                                  ? "bg-red-500 text-white"
                                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-red-50"
                              }`}
                            >
                              No
                            </motion.button>
                          </div>
                        </div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                disabled={true}
                className={`w-full sm:w-auto sm:px-6 sm:py-3 px-4 py-2 rounded-xl font-medium transition-all bg-gray-100 text-gray-400 cursor-not-allowed`}
              >
                Previous
              </motion.button>

              {/* Hide on mobile, show on desktop */}
              <div className="hidden sm:block w-20 h-20">
                <CircularProgressbar
                  value={progressPercentage}
                  text={`${currentStep + 1}/${totalSteps}`}
                  styles={buildStyles({
                    pathColor: `rgba(147, 51, 234, ${
                      progressPercentage / 100
                    })`,
                    textColor: "#6b21a8",
                    trailColor: "#f3e8ff",
                    textSize: "22px",
                  })}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

            {/* Show on mobile only */}
            <div className="sm:hidden text-center mt-4">
              <span className="text-lg font-medium text-purple-800">
                {currentStep + 1}/{totalSteps}
              </span>
            </div>
          </motion.div>
        </Card>
      </div>

      {/* Popup for name, email, and phone number */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Complete
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitDetails)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email Address"
                          type="email"
                          className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          type="tel"
                          className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-200/50 text-sm sm:text-base"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </motion.button>
                </div>
              </form>
            </Form>
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

      {/* Add JSX for confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to cancel?
            </h3>
            <p className="text-gray-600 mb-6">
              All your progress will be lost and you&apos;ll need to start over.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  resetQuestionnaire();
                  setShowConfirmModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add JSX for generating animation */}
      {showGeneratingAnimation && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mb-6 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Your Report
            </h3>
            <p className="text-gray-600">
              Please wait while we analyze your responses...
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QualityCheckQuestionnaire;

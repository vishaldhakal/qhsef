"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ensure this path is correct
import confetti from "canvas-confetti";

const ThankYouPage = ({
  totalPoints,
  earnedPoints,
  onClose,
}: {
  totalPoints: number;
  earnedPoints: number;
  onClose: () => void; // Function to close the popup
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#60A5FA", "#3B82F6", "#2563EB"],
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 flex items-center justify-center p-4 ${
        !isVisible && "hidden"
      }`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Decorative elements */}
          <div className="relative">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-16 h-16 text-blue-300 opacity-50" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Thank You!
            </h2>
            <p className="text-gray-600 text-lg">
              Your submission has been received successfully.
            </p>
          </motion.div>

          {/* Results card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 w-full space-y-4 border border-blue-100"
          >
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Your Results</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Points</span>
                <span className="font-bold text-blue-600">{totalPoints}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-blue-100 to-cyan-100" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Earned Points</span>
                <span className="font-bold text-cyan-600">{earnedPoints}</span>
              </div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <Button
              variant="outline"
              className="flex-1 text-gray-600 hover:text-gray-700 border-2 hover:border-blue-200 transition-all"
              onClick={() => {
                setIsVisible(false);
                onClose(); // Call the onClose function to close the popup
              }}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all"
              onClick={() => {
                triggerConfetti();
                window.location.href = "/"; // Redirect to home
              }}
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;

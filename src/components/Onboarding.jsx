import React, { useState } from 'react';
import Button from './ui/Button';

const Onboarding = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to iVisionary",
      content: "Discover the power of AI-generated videos for your projects.",
    },
    {
      title: "Browse Our Collection",
      content: "Explore thousands of unique videos created by cutting-edge AI technology.",
    },
    {
      title: "Customize and Download",
      content: "Find the perfect video, customize it to your needs, and download in high quality.",
    },
    {
      title: "Start Creating",
      content: "Use our AI-generated videos to elevate your content and captivate your audience.",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">{steps[step].title}</h2>
        <p className="text-gray-300 mb-6">{steps[step].content}</p>
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={step === 0} variant="secondary">
            Previous
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
import Pagination from './Pagination';
import { useEffect, useState } from 'react';
import { tutorialSteps } from 'lib/constants/tutorial_steps';

const Carousel = () => {
  const [fade, setFade] = useState<boolean>(true);
  const [currentStep, setStep] = useState<number>(2);

  const handleDotClick = (index: number) => {
    setStep(index);
    setFade(true);
  };

  useEffect(() => {
    const fadeOutTimeout = setTimeout(() => {
      setFade(false);
    }, 2500);

    const stepChangeTimeout = setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setStep(currentStep + 1);
      } else {
        setStep(0);
      }

      setFade(true);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(stepChangeTimeout);
    };
  }, [currentStep]);

  return (
    <div className="flex h-72 w-72 flex-col items-center rounded-md bg-primary_yellow p-2 px-6">
      <p className="mb-4 font-extrabold uppercase tracking-tighter">
        How to play
      </p>
      <div
        key={currentStep}
        className={`flex flex-1 flex-col items-center transition-opacity duration-700 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          alt="Step Image"
          className="h-32 w-32"
          src={tutorialSteps[currentStep].image}
        />
        <p className="mt-4 font-extrabold uppercase tracking-tighter">
          {tutorialSteps[currentStep].header}
        </p>
        <p className="leading-mt-[-4px] font-base text-center leading-none">
          {tutorialSteps[currentStep].description}
        </p>
      </div>
      <div className="mb-1">
        <Pagination
          currentStep={currentStep}
          totalSteps={tutorialSteps.length}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
};

export default Carousel;

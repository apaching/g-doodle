interface Props {
  currentStep: number;
  totalSteps: number;
  onDotClick: (index: number) => void;
}

const Pagination = ({ currentStep, totalSteps, onDotClick }: Props) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 w-2 rounded-full transition-all ${
            currentStep === index ? 'scale-125 bg-black' : 'bg-primary_white'
          }`}
        />
      ))}
    </div>
  );
};

export default Pagination;

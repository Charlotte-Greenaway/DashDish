import React, { useState } from 'react';

interface Instruction {
  instructions:string[]
}
const RecipeInstructions:React.FC<Instruction> = ( {instructions} ) => {
  // State to track completed instructions
  const [completedSteps, setCompletedSteps] = useState(new Array(instructions.length).fill(false));

  // Handler for clicking a step
  const toggleStepCompletion = (index:number) => {
    const updatedSteps = [...completedSteps];
    updatedSteps[index] = !updatedSteps[index];
    setCompletedSteps(updatedSteps);
  };

  return (
<div className="max-w-[1500px] mx-auto p-6 bg-white rounded-xl shadow-xl animate-fadeIn">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Instructions</h2>
      <p className="text-sm text-gray-600 mb-4">Click on an instruction to mark it as completed.</p>
      <div className="bg-green-50 p-6 rounded-lg shadow-md">
        <ol className="list-none space-y-4">
          {instructions.map((instruction, index) => (
            <li
              key={index}
              className={`flex items-start p-2 transition-all duration-300 ease-in-out rounded-md cursor-pointer hover:bg-green-200 ${completedSteps[index] ? 'bg-green-100' : 'bg-transparent'}`}
              onClick={() => toggleStepCompletion(index)}
            >
              <span className={`flex-shrink-0 mr-4 transition-colors duration-300 ease-in-out ${completedSteps[index] ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              <p className={`flex-1 text-lg transition-colors duration-300 ease-in-out ${completedSteps[index] ? 'text-green-800' : 'text-gray-600'}`}>
                {instruction}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>


  );
};

export default RecipeInstructions;

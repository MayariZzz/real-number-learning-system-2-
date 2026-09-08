/**
 * Answer Parsing and Checking Logic
 */
const AnswerEvaluator = {
  
  evaluate(problem, userInput) {
    switch (problem.type) {
      
      case "checkbox": {
        // Compare arrays of selections
        const userSets = userInput.sort();
        const expectedSets = problem.solution.sort();
        
        if (userSets.length !== expectedSets.length) return false;
        return userSets.every((val, index) => val === expectedSets[index]);
      }

      case "numeric": {
        const parsedVal = parseFloat(userInput);
        if (isNaN(parsedVal)) return false;
        return Math.abs(parsedVal - problem.solution) < 0.01;
      }

      case "inequality_input": {
        const userOp = userInput.operator;
        const userVal = parseFloat(userInput.value);
        
        if (isNaN(userVal)) return false;
        
        const isOpMatch = userOp === problem.solution.operator;
        const isValMatch = Math.abs(userVal - problem.solution.value) < 0.01;
        return isOpMatch && isValMatch;
      }

      default:
        return false;
    }
  }
};

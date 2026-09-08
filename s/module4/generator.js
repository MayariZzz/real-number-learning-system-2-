/**
 * Problem Generation Engine for Module 4
 */
const ProblemGenerator = {
  
  // Generate a random integer between min and max inclusive
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 1. Number System Classification Problem Generator
  generateClassification(difficulty) {
    const pool = [
      { num: "5", sets: ["Natural", "Whole", "Integer", "Rational", "Real"] },
      { num: "0", sets: ["Whole", "Integer", "Rational", "Real"] },
      { num: "-7", sets: ["Integer", "Rational", "Real"] },
      { num: "\\frac{3}{4}", sets: ["Rational", "Real"] },
      { num: "\\sqrt{2}", sets: ["Irrational", "Real"] },
      { num: "\\pi", sets: ["Irrational", "Real"] },
      { num: "0.333...", sets: ["Rational", "Real"] }
    ];

    const selected = pool[Math.floor(Math.random() * pool.length)];
    return {
      category: "Classification",
      prompt: "Select ALL set classifications that apply to:",
      latex: selected.num,
      type: "checkbox",
      options: ["Natural", "Whole", "Integer", "Rational", "Irrational", "Real"],
      solution: selected.sets
    };
  },

  // 2. Distance between two points on the Number Line
  generateDistance(difficulty) {
    let p1 = this.getRandomInt(-10, 10);
    let p2 = this.getRandomInt(-10, 10);
    
    // Ensure points are not equal
    while (p1 === p2) {
      p2 = this.getRandomInt(-10, 10);
    }

    const distance = Math.abs(p1 - p2);

    return {
      category: "Distance",
      prompt: "Find the distance between points on the number line:",
      latex: `a = ${p1}, \\quad b = ${p2}`,
      type: "numeric",
      solution: distance
    };
  },

  // 3. Inequality Generator (Linear)
  generateInequality(difficulty) {
    let a = this.getRandomInt(1, 5);
    if (difficulty === "hard" && Math.random() < 0.5) a = -a; // negative coefficient flips inequality

    const b = this.getRandomInt(-10, 10);
    const c = this.getRandomInt(-15, 15);
    const operators = ["<", "\\le", ">", "\\ge"];
    const op = operators[Math.floor(Math.random() * operators.length)];

    // Solve for x: a*x + b (op) c  =>  a*x (op) c - b
    const rhs = c - b;
    let targetVal = rhs / a;
    
    // Determine target operator
    let targetOp = op;
    if (a < 0) {
      const flipMap = { "<": ">", "\\le": "\\ge", ">": "<", "\\ge": "\\le" };
      targetOp = flipMap[op];
    }

    const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    return {
      category: "Inequality",
      prompt: "Solve the linear inequality for x:",
      latex: `${a === 1 ? "" : a === -1 ? "-" : a}x ${bSign} ${op} ${c}`,
      type: "inequality_input",
      solution: {
        operator: targetOp,
        value: Number(targetVal.toFixed(2))
      }
    };
  },

  // Master fetch function
  generate(topic, difficulty) {
    if (topic === "classification") return this.generateClassification(difficulty);
    if (topic === "distance") return this.generateDistance(difficulty);
    if (topic === "inequality") return this.generateInequality(difficulty);

    // Random choice if "all" is selected
    const choices = [this.generateClassification, this.generateDistance, this.generateInequality];
    const selectedFunc = choices[Math.floor(Math.random() * choices.length)];
    return selectedFunc.call(this, difficulty);
  }
};s

interface Goal {
    id: number;
    title: string;
    description?: string; // Optional description field
    targetDate: Date;
    isCompleted: boolean;
  }
  
  const upcomingGoals: Goal[] = [
    {
      id: 1,
      title: "Run 5 kilometers",
      description: "Challenge yourself to improve your endurance.",
      targetDate: new Date(2024, 4, 15), // Target date set for April 15th, 2024
      isCompleted: false,
    },
    {
      id: 2,
      title: "Eat 5 servings of vegetables daily",
      targetDate: new Date(2024, 4, 20), // Target date set for April 20th, 2024
      isCompleted: false,
    },
    {
      id: 3,
      title: "Meditate for 10 minutes every morning",
      description: "Start your day with mindfulness and focus.",
      targetDate: new Date(2024, 4, 25), // Target date set for April 25th, 2024
      isCompleted: false,
    },
  ];
  
  const completedGoals: Goal[] = [
    {
      id: 4,
      title: "Drink 8 glasses of water daily",
      targetDate: new Date(2024, 4, 10), // Achieved on April 10th, 2024
      isCompleted: true,
    },
    {
      id: 5,
      title: "Do 20 push-ups every day",
      targetDate: new Date(2024, 4, 8), // Achieved on April 8th, 2024
      isCompleted: true,
    },
  ];
  
  export { upcomingGoals, completedGoals, Goal };
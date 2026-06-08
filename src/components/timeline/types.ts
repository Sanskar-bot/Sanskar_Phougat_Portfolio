export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sourceFile: string;
  githubUrl: string;
  wordCount: number;
}

export interface TimelineStats {
  totalLearningDays: number;
  totalTopics: number;
  totalTags: number;
  totalTechnologies: number;
  totalWordsWritten: number;
  difficultyBreakdown: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
}

export interface ReportAnswer {
  question: string;
  answer: string;
  points: number;
}

export interface ReportRequirement {
  requirement_name: string;
  answers: ReportAnswer[];
}

export interface Report {
  id: number;
  name: string;
  email: string;
  phone: string;
  earned_points: number;
  category: string;
  percentage: number;
  file_url: string;
  created_at: string;
  requirements: ReportRequirement[];
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface AnalysisResult {
  roomType: string;
  problems: string[];
  organizationSuggestions: Suggestion[];
  declutteringTips: string[];
  rearrangementPlan: string;
  imageAlt: string;
}

export interface AppState {
  isAnalyzing: boolean;
  isRearranging: boolean;
  image: string | null;
  result: AnalysisResult | null;
  rearrangedImage: string | null;
}

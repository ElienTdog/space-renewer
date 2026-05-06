import { AnalysisResult } from "../types";

export async function analyzeRoom(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Image, mimeType })
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
  }

  return await response.json() as AnalysisResult;
}

export async function generateOrganizedImage(originalImage: string, result: AnalysisResult): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalImage, problems: result.problems })
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server Error: ${response.status}`);
  }

  const data = await response.json();
  return data.image;
}

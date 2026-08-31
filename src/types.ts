export type Label = "safe" | "unsafe";

export interface ClassificationRequest {
  text: string;
}

export interface ClassificationResult {
  label: Label;
}

export interface ClassifyResponse extends ClassificationResult {
  policyAction: "allow" | "block";
}

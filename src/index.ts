import express, { Request, Response } from "express";
import { classify } from "./classifier";
import { ClassificationRequest, ClassifyResponse, Label } from "./types";
import policyConfig from "./policies/default.json";

interface PolicyRule {
  name: string;
  when: { label: string };
  action: "allow" | "block";
}

function applyPolicy(label: Label): "allow" | "block" {
  const rules = policyConfig.policies as PolicyRule[];
  const match = rules.find((rule) => rule.when.label === label);
  return match ? match.action : (policyConfig.defaultAction as "allow" | "block");
}

const app = express();
app.use(express.json());

app.post("/classify", (req: Request, res: Response) => {
  const body = req.body as ClassificationRequest;

  if (!body || typeof body.text !== "string") {
    res.status(400).json({ error: "Request body must include a 'text' string field." });
    return;
  }

  const result = classify(body.text);
  const response: ClassifyResponse = {
    label: result.label,
    policyAction: applyPolicy(result.label),
  };

  res.json(response);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`guardrail-api listening on port ${PORT}`);
  });
}

export default app;

export const projects = [
  {
    id: "agent-pipeline",
    image: "/projects/agent-pipeline.svg",
    imageLabel: "Concept illustration",
    imageAlt:
      "Concept illustration of coordinated retrieval, planning, tools, and verification agents.",
    title: "Multi-agent pipeline",
    subtitle: "Agents with a plan. And a fallback.",
    stack: "Python · LangGraph · Structured outputs",
    description:
      "A state-driven workflow for retrieval, planning, tool selection, static analysis, and verification.",
    points: [
      "Explicit error states and retries.",
      "Human-in-the-loop checkpoints.",
      "Structured output validation.",
    ],
  },
  {
    id: "rag-platform",
    image: "/projects/rag-platform.svg",
    imageLabel: "Concept illustration",
    imageAlt:
      "Concept illustration of documents being matched through vector and keyword retrieval.",
    title: "RAG platform",
    subtitle: "Knowledge, within reach.",
    stack: "PGVector · BM25 · Cohere · Python",
    description:
      "An end-to-end retrieval platform combining vector similarity, lexical search, and reranking.",
    points: [
      "Tuned chunking and embeddings.",
      "Hybrid BM25 + embedding search.",
      "Cohere reranking and metadata routing.",
    ],
  },
  {
    id: "model-evals",
    image: "/projects/model-evals.svg",
    imageLabel: "Concept illustration",
    imageAlt:
      "Concept illustration of comparing model outputs through an evaluation lens.",
    title: "Fine-tuning & evals",
    subtitle: "Better models. Measured.",
    stack: "Python · OpenAI · Gemini · Evals",
    description:
      "Domain-specific classification and summarization, paired with model evaluation.",
    points: [
      "Supervised fine-tuning.",
      "Accuracy and hallucination comparisons.",
      "Cost trade-offs across models.",
    ],
  },
  {
    id: "analysis-agent",
    image: "/projects/analysis-agent.svg",
    imageLabel: "Concept illustration",
    imageAlt:
      "Concept illustration of code review with performance and compatibility checkpoints.",
    title: "Static analysis agent",
    subtitle: "A second set of engineering eyes.",
    stack: "LLM agents · API contracts · Static analysis",
    description:
      "An engineering review agent for performance, concurrency, and compatibility risks.",
    points: [
      "N+1 queries and caching inefficiencies.",
      "Schema drift and unsafe API contracts.",
      "Missing idempotency and concurrency risks.",
    ],
  },
  {
    id: "pricing-engine",
    image: "/projects/pricing-engine.svg",
    imageLabel: "Concept illustration",
    imageAlt:
      "Concept illustration of pricing inference, caching, and request processing.",
    title: "ML pricing engine",
    subtitle: "Real-time decisions, at scale.",
    stack: "Python · Redis · DynamoDB · Autoscaling",
    description:
      "A high-throughput pricing system processing 500,000+ requests each day.",
    points: [
      "Python-based ML inference.",
      "Redis caching and DynamoDB state.",
      "Autoscaling for changing demand.",
    ],
  },
];

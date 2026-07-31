export type AcquisitionFormat =
    | "carousel"
    | "reel"
    | "static"
    | "stories";

export type ExperimentStatus =
    | "setup"
    | "active"
    | "complete"
    | "paused";

export type RecommendationConfidence =
    | "low"
    | "medium"
    | "high";

export type SalesPageChapter =
    | "chapter-1"
    | "chapter-2"
    | "chapter-3"
    | "chapter-4"
    | "chapter-5"
    | "chapter-6"
    | "chapter-7"
    | "chapter-8"
    | "chapter-9";

export type DiscoveryTheme = {
    id: string;
    title: string;
    description: string;

    currentBelief: string;
    desiredBelief: string;

    purpose: string;
    salesPageChapters: SalesPageChapter[];

    supportedFormats: AcquisitionFormat[];
    preferredFormat: AcquisitionFormat;

    priority: number;
    experimentTags: string[];
};

export type AcquisitionExperiment = {
    id: string;
    title: string;
    question: string;
    hypothesis: string;

    status: ExperimentStatus;

    targetPostCount: number;
    publishedPostCount: number;

    primaryPlatformSignal: string;
    primaryBusinessSignal: string;

    relevantThemeTags: string[];
};

export type AcquisitionRecommendation = {
    id: string;

    theme: DiscoveryTheme;
    experiment: AcquisitionExperiment;

    format: AcquisitionFormat;
    openingIdea: string;

    whyToday: string;
    estimatedMinutes: number;
    confidence: RecommendationConfidence;

    score: number;
    scoreReasons: string[];
};
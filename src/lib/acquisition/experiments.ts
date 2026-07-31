import type {
    AcquisitionExperiment,
} from "./types";

export const acquisitionExperiments: AcquisitionExperiment[] =
    [
        {
            id: "identity-first-vs-educational",
            title:
                "Identity-first versus educational carousels",

            question:
                "Do identity-first carousels create more qualified FSE readers than educational carousels?",

            hypothesis:
                "Recognition-led posts will produce more profile visits and deeper sales-page progression than tactical advice.",

            status: "active",

            targetPostCount: 6,
            publishedPostCount: 0,

            primaryPlatformSignal:
                "Profile visits per 100 non-follower accounts reached.",

            primaryBusinessSignal:
                "Percentage of Instagram visitors reaching Chapter 5 or later.",

            relevantThemeTags: [
                "identity-first",
                "education",
            ],
        },
    ];

export function getActiveExperiment() {
    return (
        acquisitionExperiments.find(
            (experiment) =>
                experiment.status === "active"
        ) ?? null
    );
}
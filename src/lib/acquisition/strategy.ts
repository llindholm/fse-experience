import {
    discoveryThemes,
} from "./discoveryThemes";
import {
    getActiveExperiment,
} from "./experiments";

import type {
    AcquisitionRecommendation,
    DiscoveryTheme,
} from "./types";

type RecommendationContext = {
    recentlyUsedThemeIds?: string[];
};

function getExperimentMatchScore(
    theme: DiscoveryTheme,
    experimentTags: string[]
) {
    return theme.experimentTags.filter(
        (tag) =>
            experimentTags.includes(tag)
    ).length;
}

function scoreTheme(
    theme: DiscoveryTheme,
    context: RecommendationContext,
    experimentTags: string[]
) {
    let score = theme.priority;
    const reasons: string[] = [
        `Base strategic priority: ${theme.priority}.`,
    ];

    const experimentMatchCount =
        getExperimentMatchScore(
            theme,
            experimentTags
        );

    if (experimentMatchCount > 0) {
        const experimentScore =
            experimentMatchCount * 4;

        score += experimentScore;

        reasons.push(
            `Adds ${experimentScore} points because it supports the active experiment.`
        );
    }

    const wasRecentlyUsed =
        context.recentlyUsedThemeIds?.includes(
            theme.id
        ) ?? false;

    if (wasRecentlyUsed) {
        score -= 8;

        reasons.push(
            "Removes 8 points because this theme was used recently."
        );
    } else {
        score += 2;

        reasons.push(
            "Adds 2 points because this theme has not been used recently."
        );
    }

    if (
        theme.salesPageChapters.includes(
            "chapter-1"
        ) ||
        theme.salesPageChapters.includes(
            "chapter-2"
        ) ||
        theme.salesPageChapters.includes(
            "chapter-3"
        )
    ) {
        score += 2;

        reasons.push(
            "Adds 2 points because it prepares a new audience for the opening sales-page chapters."
        );
    }

    return {
        score,
        reasons,
    };
}

function buildOpeningIdea(
    themeId: string
) {
    const openingIdeas: Record<
        string,
        string
    > = {
        "myth-of-consistency":
            "Maybe you are not inconsistent. Maybe your business only knows how to work when you do.",

        "invisible-ceiling":
            "You can have extraordinary work and still be building beneath an invisible ceiling.",

        "architecture-over-hustle":
            "You do not need to become better at carrying every sale.",

        "authority-vs-attention":
            "Being seen is not the same as being the only choice.",

        "business-only-works-when-you-do":
            "If your business stops selling when you stop showing up, it has not created freedom yet.",

        "quiet-demand":
            "Demand does not have to be loud to be powerful.",

        "evergreen-can-feel-personal":
            "A pressured launch is not automatically more personal than an evergreen journey.",

        "praise-versus-purchases":
            "Some content collects praise. Other content creates movement.",
    };

    return (
        openingIdeas[themeId] ??
        "There may be another way to understand what is happening in your business."
    );
}

export function getTodaysRecommendation(
    context: RecommendationContext = {}
): AcquisitionRecommendation {
    const experiment =
        getActiveExperiment();

    if (!experiment) {
        throw new Error(
            "Acquisition Lab requires an active experiment before it can create a recommendation."
        );
    }

    const scoredThemes =
        discoveryThemes.map((theme) => {
            const result = scoreTheme(
                theme,
                context,
                experiment.relevantThemeTags
            );

            return {
                theme,
                score: result.score,
                reasons: result.reasons,
            };
        });

    scoredThemes.sort(
        (first, second) =>
            second.score - first.score
    );

    const selected = scoredThemes[0];

    if (!selected) {
        throw new Error(
            "No discovery themes are available."
        );
    }

    return {
        id: `recommendation-${selected.theme.id}`,

        theme: selected.theme,
        experiment,

        format:
            selected.theme.preferredFormat,

        openingIdea: buildOpeningIdea(
            selected.theme.id
        ),

        whyToday:
            `${selected.theme.title} is a high-priority discovery theme that supports the current ${experiment.title.toLowerCase()} experiment. It also prepares new visitors for ${selected.theme.salesPageChapters
                .map((chapter) =>
                    chapter.replace(
                        "chapter-",
                        "Chapter "
                    )
                )
                .join(", ")} of the FSE experience.`,

        estimatedMinutes:
            selected.theme.preferredFormat ===
            "reel"
                ? 45
                : 30,

        confidence: "medium",

        score: selected.score,
        scoreReasons: selected.reasons,
    };
}
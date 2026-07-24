export type Lesson = {
    id: string;
    slug: string;
    title: string;
    description?: string;
    duration?: string;
    opening?: string;
    videoUrl?: string;
    audioUrl?: string;
    pdfUrl?: string;
};

export type CourseSection = {
    id: string;
    title: string;
    lessons: Lesson[];
};

export type CourseContentItem =
    | {
        type: "lesson";
        lesson: Lesson;
    }
    | {
        type: "section";
        section: CourseSection;
    };

export type Course = {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    content: CourseContentItem[];
};

export const courses: Course[] = [
    {
        id: "million-dollar-authority",
        slug: "million-dollar-authority",
        title: "Million Dollar Authority",
        subtitle:
            "Command premium prices and daily signups with messaging that sells for you.",
        description:
            "A four-part body of work designed to strengthen your identity, authority, positioning, message, and strategic visibility.",
        content: [
            {
                type: "lesson",
                lesson: {
                    id: "module-1",
                    slug: "module-1",
                    title: "Module 1",
                    description: "Million Dollar Identity & Authority",
                    duration: "1 hr 11 min",
                    opening:
                        "The woman who commands premium prices is not speaking differently simply because she knows more. She is speaking differently because she sees herself differently.",
                    videoUrl:
                        "https://player.vimeo.com/video/1065291347?h=755bf11cb2",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/million_dollar_authority_module_1.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/Mod%201%20-%20Million%20Dollar%20Authority%20(1).pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-2",
                    slug: "module-2",
                    title: "Module 2",
                    description:
                        "High Value Problem Positioning",
                    duration: "59 min",
                    opening: "Your message becomes more valuable when it speaks directly to the problem your most aligned client is already ready to solve.",
                    videoUrl:
                        "https://player.vimeo.com/video/1067490750?h=d449579a87",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/million_dollar_authority_module_2.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/Day%202%20-%20Million%20Dollar%20Authority%20(1).pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-3",
                    slug: "module-3",
                    title: "Module 3",
                    description:
                        "Million Dollar Message Framework",
                    duration: "54 min",
                    opening: "A powerful message does not explain everything. It makes the right person recognize herself, her desire, and the decision in front of her.",
                    videoUrl:
                        "https://player.vimeo.com/video/1070152453?h=9324a6e056",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/million_dollar_authority_module_3.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/Day%203%20-%20Million%20Dollar%20Authority%20(1).pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-4",
                    slug: "module-4",
                    title: "Module 4",
                    description:
                        "Strategic Authority Sequences",
                    duration: "54 min",
                    opening: "Authority grows when your message becomes consistent enough to be remembered and alive enough to keep creating movement.",
                    videoUrl:
                        "https://player.vimeo.com/video/1071957511?h=0a9eead00a",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/million_dollar_authority_module_4.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/Day%204%20-%20Million%20Dollar%20Authority%20(1).pdf",
                },
            },
            {
                type: "section",
                section: {
                    id: "bonus-content",
                    title: "Bonus Content",
                    lessons: [
                        {
                            id: "ai-authority-call",
                            slug: "ai-authority-call",
                            title: "AI Authority Call",
                            description:
                                "A focused bonus training on using AI to support your authority work.",
                            duration: "85 min",
                            videoUrl: "https://player.vimeo.com/video/1074091778?h=bd6891a150",
                            audioUrl:
                                "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/million_dollar_authority_-_ai_authority_v2%20(240p)%20(1).mp3"

                        },
                        {
                            id: "million-dollar-message-assessment",
                            slug: "million-dollar-message-assessment",
                            title: "Million Dollar Message Assessment",
                            description: "Million Dollar Message Assessment",
                            pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Million%20Dollar%20Message_%20The%20Assessment.pdf",

                        },
                        {
                            id: "mdm-markers-ai-prompts",
                            slug: "mdm-markers-ai-prompts",
                            title: "MDM: The Markers & AI Prompts",
                            description: "MDM: The Markers & AI Prompts",
                            pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Million%20Dollar%20Message%20-%20Markers%20&%20Prompts.pdf",

                        },
                    ],
                },
            },
        ],
    },
    {
        id: "effortless-sales-system",
        slug: "effortless-sales-system",
        title: "Effortless Sales System",
        subtitle:
            "Create a sales process that feels natural, clear, and consistently effective.",
        description:
            "A complete sales system designed to help you lead aligned clients from interest to decision without pressure, overexplaining, or complicated strategy.",
        content: [
            {
                type: "lesson",
                lesson: {
                    id: "module-1",
                    slug: "module-1",
                    title: "Module 1",
                    description: "The Daily Sales Engine",
                    duration: "72 min",
                    opening:
                        "Selling feels hard when it becomes something you do to earn a yes. It becomes effortless when it becomes a conversation you know how to lead.",
                    videoUrl:
                        "https://player.vimeo.com/video/1084806397?h=f22d44728a",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/effortless_sales_system_module_1.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/Mod%201%20-%20Effortless%20Sales%20System.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-2",
                    slug: "module-2",
                    title: "Module 2",
                    description: "Million Dollar Hooks",
                    duration: "76 min",
                    opening:
                        "The strongest sales process doesn't create certainty. It creates the space for someone to discover what they already know is true.",
                    videoUrl:
                        "https://player.vimeo.com/video/1088219813?h=ff15137d20",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/effortless_sales_system_module_2.mp3",
                    pdfUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/Mod%202%20-%20Effortless%20Sales%20System.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-3",
                    slug: "module-3",
                    title: "Module 3",
                    description: "Plug-and-Play Content Architecture",
                    duration: "65 min",
                    opening:
                        "Resistance rarely means someone isn't interested. More often, it means they haven't yet seen themselves clearly enough to make a decision.",
                    videoUrl:
                        "https://player.vimeo.com/video/1092615558?h=9d937ad1a4",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/effortless_sales_system_module_3.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/Mod%203%20-%20Effortless%20Sales%20System.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "module-4",
                    slug: "module-4",
                    title: "Module 4",
                    description: "Build Your Body of Work",
                    duration: "90 min",
                    opening:
                        "An extraordinary close isn't about having the perfect response. It's about holding enough clarity that the next step becomes the obvious one.",
                    videoUrl:
                        "https://player.vimeo.com/video/1096400855?h=f073cb8d2f",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/effortless_sales_system_module_4.mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/Mod%204%20-%20Effortless%20Sales%20System.pdf",
                },
            },
            {
                type: "section",
                section: {
                    id: "bonus-content",
                    title: "Bonus Content",
                    lessons: [
                        {
                            id: "ai-content-call",
                            slug: "ai-content-call",
                            title: "AI Content Bonus Training",
                            description:
                                "AI Content Bonus Training",
                            duration: "65 min",
                            videoUrl: "https://player.vimeo.com/video/1094513621?h=44b18a0b38",
                            audioUrl:
                                "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/effortless_sales_system_-_ai_content_bonus_v2%20(240p).mp3"

                        },
                        {
                            id: "ess-ai-prompts",
                            slug: "ess-ai-prompts",
                            title: "AI Prompts Bonus PDF",
                            description: "AI Prompts Bonus PDF",
                            pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/ESS/ESS_%20Prompt%20Sheet%20+%20Plug-and-Play%20Templates.pdf",

                        },
                    ],
                },
            },
        ],
    },
    {
        id: "signature-close",
        slug: "signature-close",
        title: "The Signature Close",
        subtitle:
            "SUBTITLE HERE",
        description:
            "DESCRIPTION HERE",
        content: [
            {
                type: "lesson",
                lesson: {
                    id: "full-funnel-overview",
                    slug: "full-funnel-overview",
                    title: "Your Full Funnel Overview",
                    description: "description",
                    duration: "93 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/the_feminine_sales_system_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "choosing-your-micro-offer",
                    slug: "choosing-your-micro-offer",
                    title: "Choosing Your Micro Offer",
                    description: "description",
                    duration: "24 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/choosing_your_micro_offer_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "structure-your-micro-offer",
                    slug: "structure-your-micro-offer",
                    title: "Structure Your Micro Offer",
                    description: "description",
                    duration: "24 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/structure_your_micro_offer_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "micro-offer-sales-page",
                    slug: "micro-offer-sales-page",
                    title: "Micro Offer Sales Page",
                    description: "description",
                    duration: "26 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/create_a_sales_page_that_converts_cold_traffic_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "cart-optimization",
                    slug: "cart-optimization",
                    title: "Cart Optimization: Bumps + OTOs",
                    description: "description",
                    duration: "25 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/cart_optimization_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-delivery-email",
                    slug: "soft-elevation-delivery-email",
                    title: "Soft Elevation™ Delivery Email",
                    description: "description",
                    duration: "23 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_delivery_email_training_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-check-in-email",
                    slug: "soft-elevation-check-in-email",
                    title: "Soft Elevation™ Check In Email",
                    description: "description",
                    duration: "93 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_check_in_email_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-nurture",
                    slug: "soft-elevation-nurture",
                    title: "Soft Elevation™ Nurture Email",
                    description: "description",
                    duration: "34 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_nurture_email_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "your-signature-methodology",
                    slug: "your-signature-methodolgy",
                    title: "Your Signature Methodology",
                    description: "description",
                    duration: "28 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/your_signature_methodology%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "signature-offer-positioning",
                    slug: "signature-offer-positioning",
                    title: "Signature Offer Positioning",
                    description: "description",
                    duration: "25 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/signature_offer_positioning_v2%20(240p).mp3",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "signature-offer-sales-page",
                    slug: "signature-offer-sales-page",
                    title: "Signature Offer Sales Page",
                    description: "description",
                    duration: "26 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "quiet-close-promo-sequence",
                    slug: "quiet-close-promo-sequence",
                    title: "Quiet Close™ Promo Sequence",
                    description: "description",
                    duration: "31 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "",
                    pdfUrl: "",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "quiet-close-plug-and-play-emails",
                    slug: "quiet-close-plug-and-play-emails",
                    title: "Quiet Close™ Plug-and-Play Emails",
                    description: "description",
                    duration: "34 min",
                    opening:
                        "opening.",
                    videoUrl:
                        "",
                    audioUrl:
                        "",
                    pdfUrl: "",
                },
            },
        ]
    },
];

export function getCourse(courseSlug: string) {
    return courses.find(
        (course) => course.slug === courseSlug
    );
}

export type ResolvedLesson = {
    lesson: Lesson;
    sectionTitle?: string;
};

export function getCourseLessons(
    course: Course
): ResolvedLesson[] {
    return course.content.flatMap((item) => {
        if (item.type === "lesson") {
            return [
                {
                    lesson: item.lesson,
                },
            ];
        }

        return item.section.lessons.map((lesson) => ({
            lesson,
            sectionTitle: item.section.title,
        }));
    });
}

export function getLesson(
    courseSlug: string,
    lessonSlug: string
) {
    const course = getCourse(courseSlug);

    if (!course) {
        return null;
    }

    const lessons = getCourseLessons(course);

    const lessonIndex = lessons.findIndex(
        (item) => item.lesson.slug === lessonSlug
    );

    if (lessonIndex === -1) {
        return null;
    }

    return {
        course,
        lesson: lessons[lessonIndex],
        previousLesson:
            lessonIndex > 0 ? lessons[lessonIndex - 1] : null,
        nextLesson:
            lessonIndex < lessons.length - 1
                ? lessons[lessonIndex + 1]
                : null,
    };
}
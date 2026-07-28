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
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/million_dollar_authority_module_1.mp3",
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
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/million_dollar_authority_module_2.mp3",
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
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/million_dollar_authority_module_3.mp3",
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
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/MDA/million_dollar_authority_module_4.mp3",
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
            "Create a content sequence that feels natural, clear, and consistently effective.",
        description:
            "A complete content system designed to help you lead aligned clients from interest to decision without pressure so sales compound for you.",
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
            "Build the sales system that quietly grows your business.",
        description:
            "Create the offers, emails, and customer journey that consistently turns interest into premium clients—without launches or pressure.",
        content: [
            {
                type: "lesson",
                lesson: {
                    id: "full-funnel-overview",
                    slug: "full-funnel-overview",
                    title: "Your Full Funnel Overview",
                    description: "Your Full Funnel Overview",
                    duration: "93 min",
                    opening:
                        "See how every piece of the Feminine Sales Engine fits together into a complete client journey—from first interaction to premium sale—before you begin building your own.",
                    videoUrl:
                        "https://player.vimeo.com/video/1107908294?h=e93a073f2c",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/the_feminine_sales_system_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Mod%201%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "choosing-your-micro-offer",
                    slug: "choosing-your-micro-offer",
                    title: "Choosing Your Micro Offer",
                    description: "Choosing Your Micro Offer",
                    duration: "24 min",
                    opening:
                        "Choose the one small, high-value offer that creates immediate trust, attracts ideal buyers, and naturally leads into your signature offer.",
                    videoUrl:
                        "https://player.vimeo.com/video/1109736361?h=630236225d",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/choosing_your_micro_offer_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Pick%20Your%20Micro%20Offer%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "structure-your-micro-offer",
                    slug: "structure-your-micro-offer",
                    title: "Structure Your Micro Offer",
                    description: "Structure Your Micro Offer",
                    duration: "24 min",
                    opening:
                        "Design a micro offer that’s simple to consume, quick to implement, and intentionally built to create momentum toward your premium work.",
                    videoUrl:
                        "https://player.vimeo.com/video/1109753238?h=5feb902aca",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/structure_your_micro_offer_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Structure%20Your%20Micro%20Offer%20for%20Maximum%20Conversion%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "micro-offer-sales-page",
                    slug: "micro-offer-sales-page",
                    title: "Micro Offer Sales Page",
                    description: "Micro Offer Sales Page",
                    duration: "26 min",
                    opening:
                        "Build a simple sales page that answers the right questions, creates confidence, and converts buyers without relying on sales calls or launches.",
                    videoUrl:
                        "https://player.vimeo.com/video/1109797543?h=c9003c3989",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/create_a_sales_page_that_converts_cold_traffic_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Create%20a%20Sales%20Page%20That%20Converts%20Cold%20Traffic%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "cart-optimization",
                    slug: "cart-optimization",
                    title: "Cart Optimization: Bumps + OTOs",
                    description: "Cart Optimization: Bumps + OTOs",
                    duration: "25 min",
                    opening:
                        "Refine the buying experience with small improvements that increase conversions and remove unnecessary friction throughout your funnel.",
                    videoUrl:
                        "https://player.vimeo.com/video/1115916207?h=878a125134",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/cart_optimization_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Cart%20Optimization%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-delivery-email",
                    slug: "soft-elevation-delivery-email",
                    title: "Soft Elevation™ Delivery Email",
                    description: "Soft Elevation™ Delivery Email",
                    duration: "23 min",
                    opening:
                        "Write the delivery email that welcomes new buyers while naturally introducing the next step in your customer journey.",
                    videoUrl:
                        "https://player.vimeo.com/video/1110601870?h=b6cd352490",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_delivery_email_training_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Soft%20Elevation%20Delivery%20Email%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-check-in-email",
                    slug: "soft-elevation-check-in-email",
                    title: "Soft Elevation™ Check In Email",
                    description: "Soft Elevation™ Check In Email",
                    duration: "17 min",
                    opening:
                        "Create a simple follow-up email that strengthens trust, improves engagement, and quietly increases future conversions.",
                    videoUrl:
                        "https://player.vimeo.com/video/1114056984?h=7b1b0694d3",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_check_in_email_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Soft%20Elevation%20Check%20In%20Email%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "soft-elevation-nurture",
                    slug: "soft-elevation-nurture",
                    title: "Soft Elevation™ Nurture Email",
                    description: "Soft Elevation™ Nurture Email",
                    duration: "34 min",
                    opening:
                        "Continue the relationship after purchase with an email that deepens connection and prepares buyers for your signature offer—without pressure or hard selling.",
                    videoUrl:
                        "https://player.vimeo.com/video/1114531939?h=9e614da8ed",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/soft_elevation_nurture_email_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Soft%20Elevation%20Nurture%20Email%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "your-signature-methodology",
                    slug: "your-signature-methodolgy",
                    title: "Your Signature Methodology",
                    description: "Your Signature Methodology",
                    duration: "28 min",
                    opening:
                        "Turn your expertise into a clear, branded framework that elevates your perceived value and makes your work unforgettable.",
                    videoUrl:
                        "https://player.vimeo.com/video/1117198717?h=a82a7d6a6d",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/your_signature_methodology%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Your%20Signature%20Methodology%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "signature-offer-positioning",
                    slug: "signature-offer-positioning",
                    title: "Signature Offer Positioning",
                    description: "Signature Offer Positioning",
                    duration: "25 min",
                    opening:
                        "Position your signature offer so it becomes the obvious next step for ideal clients instead of another option in a crowded market.",
                    videoUrl:
                        "https://player.vimeo.com/video/1119166260?h=3b161f3dad",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/signature_offer_positioning_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Signature%20Offer%20Positioning%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "signature-offer-sales-page",
                    slug: "signature-offer-sales-page",
                    title: "Signature Offer Sales Page",
                    description: "Signature Offer Sales Page",
                    duration: "26 min",
                    opening:
                        "Build the premium sales page that communicates your methodology, positions your offer, and quietly does the closing for you.",
                    videoUrl:
                        "https://player.vimeo.com/video/1120589475?h=cae2f84f1f",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/signature_sales_page_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Signature%20Sales%20Page%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "quiet-close-promo-sequence",
                    slug: "quiet-close-promo-sequence",
                    title: "Quiet Close™ Promo Sequence",
                    description: "Quiet Close™ Promo Sequence",
                    duration: "31 min",
                    opening:
                        "Learn the evergreen five-email sequence that sells premium offers without launches, webinars, or constant promotion.",
                    videoUrl:
                        "https://player.vimeo.com/video/1124920877?h=508af14e37",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/quiet_close_promo_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Quiet%20Close%20Promo%20-%20Signature%20Close.pdf",
                },
            },
            {
                type: "lesson",
                lesson: {
                    id: "quiet-close-plug-and-play-emails",
                    slug: "quiet-close-plug-and-play-emails",
                    title: "Quiet Close™ Plug-and-Play Emails",
                    description: "Quiet Close™ Plug-and-Play Emails",
                    duration: "34 min",
                    opening:
                        "Use AI prompts and proven templates to write your complete Quiet Close sequence and turn it into a long-term business asset.",
                    videoUrl:
                        "https://player.vimeo.com/video/1128041862?h=a109443114",
                    audioUrl:
                        "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/quiet_close_plug-and-play_emails_v2%20(240p).mp3",
                    pdfUrl: "https://eukfckzwqkybebeyxwvs.supabase.co/storage/v1/object/public/audio/Signature%20Close/Quiet%20Close%20Plug-and-play%20Emails%20-%20Signature%20Close.pdf",
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
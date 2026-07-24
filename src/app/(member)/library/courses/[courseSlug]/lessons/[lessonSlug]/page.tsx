import Link from "next/link";
import { notFound } from "next/navigation";

import { requireCourseAccess } from "@/lib/auth/requireCourseAccess";

import {
    getLesson,
    courses,
} from "@/data/courses";

import "./lesson.css";

type LessonPageProps = {
    params: Promise<{
        courseSlug: string;
        lessonSlug: string;
    }>;
};



export function generateStaticParams() {
    return courses.flatMap((course) =>
        course.content.flatMap((item) => {
            if (item.type === "lesson") {
                return [
                    {
                        courseSlug: course.slug,
                        lessonSlug: item.lesson.slug,
                    },
                ];
            }

            return item.section.lessons.map((lesson) => ({
                courseSlug: course.slug,
                lessonSlug: lesson.slug,
            }));
        })
    );
}

export default async function LessonPage({
    params,
}: LessonPageProps) {
    const { courseSlug, lessonSlug } = await params;

    const result = getLesson(
        courseSlug,
        lessonSlug
    );

    if (!result) {
        notFound();
    }

    const {
        course,
        lesson: resolvedLesson,
        previousLesson,
        nextLesson,
    } = result;

    await requireCourseAccess(
        course.slug,
        `/library/courses/${course.slug}/lessons/${resolvedLesson.lesson.slug}`
    );

    const { lesson, sectionTitle } = resolvedLesson;


    return (
        <main className="lesson-page">
            <header className="lesson-header">
                <Link
                    className="lesson-header__brand"
                    href="/library"
                >
                    <span className="lesson-header__eyebrow">
                        To Living Free
                    </span>

                    <span className="lesson-header__title">
                        Library
                    </span>
                </Link>

                <Link
                    className="lesson-header__back"
                    href={`/library/courses/${course.slug}`}
                >
                    ← {course.title}
                </Link>
            </header>

            <article className="lesson">
                <section className="lesson-hero">
                    <p className="lesson-hero__eyebrow">
                        {sectionTitle ?? lesson.title}
                    </p>

                    <h1 className="lesson-hero__title">
                        {lesson.description}
                    </h1>

                    {lesson.duration && (
                        <p className="lesson-hero__meta">
                            {lesson.duration}
                        </p>
                    )}
                </section>

                {lesson.opening && (
                    <section className="lesson-opening">
                        <p>{lesson.opening}</p>
                    </section>
                )}

                {lesson.videoUrl && (
                    <section className="lesson-media">
                        <div className="lesson-section-heading">
                            <p className="lesson-section-heading__eyebrow">
                                Watch
                            </p>

                            <p className="lesson-section-heading__note">
                                Full lesson
                            </p>
                        </div>

                        <div className="lesson-video">
                            <iframe
                                src={lesson.videoUrl}
                                title={`${course.title} — ${lesson.title}`}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </section>
                )}

                {lesson.audioUrl && (
                    <section className="lesson-audio">
                        <div className="lesson-audio__content">
                            <div>
                                <p className="lesson-audio__eyebrow">
                                    Audio Version
                                </p>

                                <p className="lesson-audio__text">
                                    Prefer to listen instead?
                                </p>
                            </div>

                            <audio
                                className="lesson-audio__player"
                                controls
                                preload="metadata"
                                src={lesson.audioUrl}
                            />
                        </div>
                    </section>
                )}

                {lesson.pdfUrl && (
                    <section className="lesson-resource">
                        <div className="lesson-resource__content">
                            <div>
                                <p className="lesson-resource__eyebrow">
                                    Resource
                                </p>

                                <h2 className="lesson-resource__title">
                                    Download the PDF
                                </h2>

                                <p className="lesson-resource__copy">
                                    Open the accompanying resource and work through it at your own pace.
                                </p>
                            </div>

                            <a
                                className="lesson-resource__button"
                                href={lesson.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open PDF
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </section>
                )}


                <nav
                    className="lesson-navigation"
                    aria-label="Lesson navigation"
                >
                    <div className="lesson-navigation__item">
                        {previousLesson ? (
                            <Link
                                href={`/library/courses/${course.slug}/lessons/${previousLesson.lesson.slug}`}
                            >
                                <span className="lesson-navigation__direction">
                                    ← Previous
                                </span>

                                <span className="lesson-navigation__title">
                                    {
                                        previousLesson.lesson
                                            .description
                                    }
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={`/library/courses/${course.slug}`}
                            >
                                <span className="lesson-navigation__direction">
                                    ← Course
                                </span>

                                <span className="lesson-navigation__title">
                                    {course.title}
                                </span>
                            </Link>
                        )}
                    </div>

                    <div className="lesson-navigation__item lesson-navigation__item--next">
                        {nextLesson ? (
                            <Link
                                href={`/library/courses/${course.slug}/lessons/${nextLesson.lesson.slug}`}
                            >
                                <span className="lesson-navigation__direction">
                                    Next →
                                </span>

                                <span className="lesson-navigation__title">
                                    {
                                        nextLesson.lesson
                                            .description
                                    }
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href={`/library/courses/${course.slug}`}
                            >
                                <span className="lesson-navigation__direction">
                                    Complete
                                </span>

                                <span className="lesson-navigation__title">
                                    Return to the course
                                </span>
                            </Link>
                        )}
                    </div>
                </nav>
            </article>
        </main>
    );
}
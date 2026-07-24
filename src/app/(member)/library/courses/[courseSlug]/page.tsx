import Link from "next/link";

import { notFound } from "next/navigation";

import { requireCourseAccess } from "@/lib/auth/requireCourseAccess";

import {
    getCourse,
    courses,
    type Lesson,
} from "@/data/courses";

import "./course.css";



type CoursePageProps = {
    params: Promise<{
        courseSlug: string;
    }>;
};

function LessonRow({
    courseSlug,
    lesson,
    index,
}: {
    courseSlug: string;
    lesson: Lesson;
    index?: number;
}) {
    return (
        <Link
            className="course-lesson"
            href={`/library/courses/${courseSlug}/lessons/${lesson.slug}`}
        >
            <span className="course-lesson__number">
                {typeof index === "number"
                    ? String(index + 1).padStart(2, "0")
                    : "—"}
            </span>

            <span className="course-lesson__content">
                <span className="course-lesson__title">
                    {lesson.title}
                </span>

                <span className="course-lesson__description">
                    {lesson.description}
                </span>
            </span>

            <span className="course-lesson__duration">
                {lesson.duration}
            </span>

            <span
                className="course-lesson__arrow"
                aria-hidden="true"
            >
                →
            </span>
        </Link>
    );
}

export function generateStaticParams() {
    return courses.map((course) => ({
        courseSlug: course.slug,
    }));
}

export default async function CoursePage({
    params,
}: CoursePageProps) {
    const { courseSlug } = await params;

    const course = getCourse(courseSlug);

    if (!course) {
        notFound();
    }

    await requireCourseAccess(
        course.slug,
        `/library/courses/${course.slug}`
    );

    const primaryLessons = course.content.filter(
        (item) => item.type === "lesson"
    );

    const sections = course.content.filter(
        (item) => item.type === "section"
    );

    const nextLesson =
        primaryLessons[0]?.type === "lesson"
            ? primaryLessons[0].lesson
            : null;

    return (
        <main className="course-page">
            <header className="course-header">
                <Link
                    className="course-header__brand"
                    href="/library"
                >
                    <span className="course-header__eyebrow">
                        To Living Free
                    </span>

                    <span className="course-header__title">
                        Library
                    </span>
                </Link>

                <Link
                    className="course-header__back"
                    href="/library"
                >
                    ← Private Collection
                </Link>
            </header>

            <section className="course-hero">
                <p className="course-hero__eyebrow">
                    Course
                </p>

                <h1 className="course-hero__title">
                    {course.title}
                </h1>

                <p className="course-hero__subtitle">
                    {course.subtitle}
                </p>

                <p className="course-hero__description">
                    {course.description}
                </p>
            </section>

            {nextLesson && (
                <section className="course-continue">
                    <div className="course-continue__label">
                        Begin here
                    </div>

                    <div className="course-continue__content">
                        <div>
                            <p className="course-continue__module">
                                {nextLesson.title}
                            </p>

                            <h2 className="course-continue__title">
                                {nextLesson.description}
                            </h2>

                            <p className="course-continue__duration">
                                {nextLesson.duration}
                            </p>
                        </div>

                        <Link
                            className="course-continue__link"
                            href={`/library/courses/${course.slug}/lessons/${nextLesson.slug}`}
                        >
                            Begin
                            <span aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </div>
                </section>
            )}

            <section className="course-curriculum">
                <div className="course-section-heading">
                    <p className="course-section-heading__eyebrow">
                        Curriculum
                    </p>

                    <p className="course-section-heading__count">
                        {primaryLessons.length} core modules
                    </p>
                </div>

                <div className="course-lesson-list">
                    {primaryLessons.map(
                        (item, index) => {
                            if (
                                item.type !== "lesson"
                            ) {
                                return null;
                            }

                            return (
                                <LessonRow
                                    key={item.lesson.id}
                                    courseSlug={
                                        course.slug
                                    }
                                    lesson={
                                        item.lesson
                                    }
                                    index={index}
                                />
                            );
                        }
                    )}
                </div>
            </section>

            {sections.map((item) => {
                if (item.type !== "section") {
                    return null;
                }

                return (
                    <section
                        className="course-curriculum course-curriculum--secondary"
                        key={item.section.id}
                    >
                        <div className="course-section-heading">
                            <p className="course-section-heading__eyebrow">
                                {item.section.title}
                            </p>

                            <p className="course-section-heading__count">
                                {
                                    item.section.lessons
                                        .length
                                }{" "}
                                resources
                            </p>
                        </div>

                        <div className="course-lesson-list">
                            {item.section.lessons.map(
                                (lesson) => (
                                    <LessonRow
                                        key={lesson.id}
                                        courseSlug={
                                            course.slug
                                        }
                                        lesson={lesson}
                                    />
                                )
                            )}
                        </div>
                    </section>
                );
            })}
        </main>
    );
}
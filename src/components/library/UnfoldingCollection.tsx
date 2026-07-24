import Link from "next/link";

import type { Course } from "@/data/courses";

type UnfoldingCollectionProps = {
    courses: Course[];
};

export default function UnfoldingCollection({
    courses,
}: UnfoldingCollectionProps) {
    return (
        <div className="collection-list">
            {courses.map((course, courseIndex) => (
                <article
                    className="collection-course"
                    key={course.id}
                    style={{
                        animationDelay: `${courseIndex * 70}ms`,
                    }}
                >
                    <Link
                        className="collection-course__link"
                        href={`/library/courses/${course.slug}`}
                    >
                        <div className="collection-course__content">
                            <p className="collection-course__subtitle">
                                {course.subtitle}
                            </p>

                            <h2 className="collection-course__title">
                                {course.title}
                            </h2>

                            <p className="collection-course__description">
                                {course.description}
                            </p>
                        </div>

                        <div className="collection-course__action">
                            <span>Open course</span>

                            <span
                                className="collection-course__arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
}
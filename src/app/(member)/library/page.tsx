import { redirect } from "next/navigation";

import LibraryHeader from "@/components/library/LibraryHeader";
import UnfoldingCollection from "@/components/library/UnfoldingCollection";

import { courses } from "@/data/courses";
import { getMemberAccess } from "@/lib/auth/memberAccess";

import "./library.css";

export default async function LibraryPage() {
    const access = await getMemberAccess();

    if (!access) {
        redirect("/login?next=/library");
    }

    const accessibleCourses =
        access.role === "admin"
            ? courses
            : courses.filter((course) =>
                access.courseSlugs.includes(course.slug)
            );

    return (
        <main className="library-page">
            <LibraryHeader memberName="Welcome back, Luke" />

            <section className="library-intro">
                <h1 className="library-intro__title">
                    Private Collection
                </h1>
            </section>

            <section className="continue-section">
                <div className="continue-panel">
                    <div className="continue-section__label">
                        Begin here
                    </div>

                    <div className="continue-section__content">
                        <div>
                            <p className="continue-section__course">
                                Your private collection
                            </p>

                            <h2 className="continue-section__lesson">
                                Explore the work available to you
                            </h2>

                            <p className="continue-section__module">
                                Choose a course below to begin.
                            </p>
                        </div>

                        <a
                            className="continue-section__link"
                            href="#courses"
                        >
                            Browse courses
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </section>

            <section
                className="collection-section"
                id="courses"
            >
                {accessibleCourses.length > 0 ? (
                    <UnfoldingCollection
                        courses={accessibleCourses}
                    />
                ) : (
                    <div className="library-empty">
                        <h2>Your collection is being prepared.</h2>

                        <p>
                            You do not currently have access to any
                            courses.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
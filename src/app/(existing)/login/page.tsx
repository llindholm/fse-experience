import AdminLoginForm from "@/components/admin/AdminLoginForm";
import "./login.css";

type LoginPageProps = {
    searchParams: Promise<{
        next?: string;
    }>;
};

export default async function LoginPage({
    searchParams,
}: LoginPageProps) {
    const params = await searchParams;

    const nextPath =
        params.next?.startsWith("/") &&
            !params.next.startsWith("//")
            ? params.next
            : "/library";

    const isAdminLogin =
        nextPath === "/admin" ||
        nextPath.startsWith("/admin/");

    return (
        <main className="admin-login-page">
            <section className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-mark">TLF</div>

                    <p>To Living Free</p>
                </div>

                <div className="admin-login-intro">
                    <p className="admin-login-eyebrow">
                        {isAdminLogin
                            ? "Private workspace"
                            : "Private Collection"}
                    </p>

                    <h1>
                        {isAdminLogin
                            ? "Insights"
                            : "Enter the Library"}
                    </h1>

                    <p>
                        {isAdminLogin
                            ? "Your private view of performance, visitor journeys, and growth."
                            : "Return to your courses, resources, and body of work."}
                    </p>
                </div>

                <AdminLoginForm nextPath={nextPath} />
            </section>
        </main>
    );
}
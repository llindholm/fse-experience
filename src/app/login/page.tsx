import AdminLoginForm from "@/components/dashboard/AdminLoginForm";
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
            : "/admin";

    return (
        <main className="admin-login-page">
            <section className="admin-login-card">
                <div className="admin-login-brand">
                    <div className="admin-login-mark">TLF</div>

                    <p>To Living Free</p>
                </div>

                <div className="admin-login-intro">
                    <p className="admin-login-eyebrow">
                        Private workspace
                    </p>

                    <h1>Insights</h1>

                    <p>
                        Your private view of performance, visitor
                        journeys, and growth.
                    </p>
                </div>

                <AdminLoginForm nextPath={nextPath} />
            </section>
        </main>
    );
}
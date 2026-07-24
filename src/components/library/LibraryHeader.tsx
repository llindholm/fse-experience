import Link from "next/link";

type LibraryHeaderProps = {
    memberName?: string;
};

export default function LibraryHeader({
    memberName = "Welcome back",
}: LibraryHeaderProps) {
    return (
        <header className="library-header">
            <Link className="library-brand" href="/library">
                <span className="library-brand__eyebrow">
                    To Living Free
                </span>

                <span className="library-brand__title">
                    Library
                </span>
            </Link>

            <div className="library-header__actions">
                <span className="library-header__welcome">
                    {memberName}
                </span>

                <Link
                    className="library-header__account"
                    href="/library/account"
                >
                    Account
                </Link>
            </div>
        </header>
    );
}
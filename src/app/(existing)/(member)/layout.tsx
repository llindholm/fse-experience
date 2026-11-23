export default function MemberLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="member-shell">{children}</div>;
}
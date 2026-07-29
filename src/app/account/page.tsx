import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AccountExperience from "./AccountExperience";
import "./account.css";

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/account");
    }

    return (
        <AccountExperience
            email={user.email ?? ""}
        />
    );
}
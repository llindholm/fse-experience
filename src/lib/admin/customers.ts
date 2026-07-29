import { createAdminClient } from "@/lib/supabase/admin";

export type AdminCustomer = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: "member" | "admin";
    createdAt: string;
    lastSignInAt: string | null;
    emailConfirmedAt: string | null;
    courseSlugs: string[];
};

type ProfileRow = {
    id: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    role: "member" | "admin";
};

type EntitlementRow = {
    user_id: string;
    course_slug: string;
    revoked_at: string | null;
};

export async function getCustomers(): Promise<
    AdminCustomer[]
> {
    const supabase = createAdminClient();

    const {
        data: usersData,
        error: usersError,
    } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (usersError) {
        throw new Error(
            `Unable to load Auth users: ${usersError.message}`
        );
    }

    const { data: profiles, error: profilesError } =
        await supabase
            .from("profiles")
            .select(
                "id, email, first_name, last_name, role"
            );

    if (profilesError) {
        throw new Error(
            `Unable to load profiles: ${profilesError.message}`
        );
    }

    const { data: entitlements, error: entitlementsError } =
        await supabase
            .from("course_entitlements")
            .select(
                "user_id, course_slug, revoked_at"
            )
            .is("revoked_at", null);

    if (entitlementsError) {
        throw new Error(
            `Unable to load entitlements: ${entitlementsError.message}`
        );
    }

    const profilesByUserId = new Map(
        ((profiles ?? []) as ProfileRow[]).map(
            (profile) => [profile.id, profile]
        )
    );

    const courseSlugsByUserId = new Map<
        string,
        string[]
    >();

    for (const entitlement of (
        entitlements ?? []
    ) as EntitlementRow[]) {
        const existing =
            courseSlugsByUserId.get(
                entitlement.user_id
            ) ?? [];

        existing.push(entitlement.course_slug);

        courseSlugsByUserId.set(
            entitlement.user_id,
            existing
        );
    }

    return usersData.users
        .map((user) => {
            const profile =
                profilesByUserId.get(user.id);

            return {
                id: user.id,
                email:
                    user.email ??
                    profile?.email ??
                    "No email",
                firstName:
                    profile?.first_name ?? null,
                lastName:
                    profile?.last_name ?? null,
                role: profile?.role ?? "member",
                createdAt: user.created_at,
                lastSignInAt:
                    user.last_sign_in_at ?? null,
                emailConfirmedAt:
                    user.email_confirmed_at ?? null,
                courseSlugs:
                    courseSlugsByUserId.get(
                        user.id
                    ) ?? [],
            };
        })
        .sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
        );
}

export async function getCustomerById(
    customerId: string
): Promise<AdminCustomer | null> {
    const customers = await getCustomers();

    return (
        customers.find(
            (customer) => customer.id === customerId
        ) ?? null
    );
}
import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { createOrInviteCustomer } from "@/lib/admin/customer-management";
import { getProductCourseSlugs } from "@/lib/products/product-access";

type KeapPurchasePayload = {
    email?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    product?: unknown;
};

function readString(
    value: unknown
): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();

    return trimmed || undefined;
}

function secretsMatch(
    providedSecret: string,
    expectedSecret: string
): boolean {
    const providedBuffer =
        Buffer.from(providedSecret);
    const expectedBuffer =
        Buffer.from(expectedSecret);

    if (
        providedBuffer.length !==
        expectedBuffer.length
    ) {
        return false;
    }

    return timingSafeEqual(
        providedBuffer,
        expectedBuffer
    );
}

export async function POST(request: Request) {
    try {
        const expectedSecret =
            process.env.KEAP_WEBHOOK_SECRET;

        if (!expectedSecret) {
            console.error(
                "Missing KEAP_WEBHOOK_SECRET"
            );

            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Webhook configuration is missing.",
                },
                {
                    status: 500,
                }
            );
        }

        const providedSecret =
            request.headers.get(
                "x-keap-webhook-secret"
            );

        if (
            !providedSecret ||
            !secretsMatch(
                providedSecret,
                expectedSecret
            )
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        let payload: KeapPurchasePayload;

        try {
            payload =
                (await request.json()) as
                KeapPurchasePayload;
        } catch {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "Request body must be valid JSON.",
                },
                {
                    status: 400,
                }
            );
        }

        const email = readString(payload.email);
        const firstName = readString(
            payload.firstName
        );
        const lastName = readString(
            payload.lastName
        );
        const product = readString(
            payload.product
        );

        if (!email) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Email is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!product) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Product is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const courseSlugs =
            getProductCourseSlugs(product);

        if (!courseSlugs) {
            return NextResponse.json(
                {
                    ok: false,
                    error: `Unknown product: ${product}`,
                },
                {
                    status: 400,
                }
            );
        }

        const customer =
            await createOrInviteCustomer({
                email,
                firstName,
                lastName,
                courseSlugs,
                sendInvitation: false,
                generateWelcomeLink: true,
            });

        if (!customer.welcomeUrl) {
            throw new Error(
                "Customer was created without a welcome URL."
            );
        }

        console.info("Keap purchase processed", {
            userId: customer.userId,
            product,
            created: customer.created,
            coursesGranted:
                courseSlugs.length,
            welcomeLinkCreated: true,
        });

        return NextResponse.json({
            ok: true,
            customer: {
                userId: customer.userId,
                email: customer.email,
                created: customer.created,
                invited: customer.invited,
            },
            product,
            courseSlugs,
            welcomeUrl: customer.welcomeUrl,
            welcomeExpiresAt:
                customer.welcomeExpiresAt,
        });
    } catch (error) {
        console.error(
            "Unable to process Keap purchase",
            error
        );

        return NextResponse.json(
            {
                ok: false,
                error:
                    "Unable to process purchase.",
            },
            {
                status: 500,
            }
        );
    }
}
import "server-only";

const KEAP_API_BASE_URL =
    "https://api.infusionsoft.com/crm/rest/v1";

type UpdateKeapWelcomeUrlInput = {
    contactId: string;
    welcomeUrl: string;
};

type KeapCustomField = {
    id?: number | string;
    label?: string;
    field_name?: string;
    database_name?: string;
    name?: string;
};

type KeapContactModelResponse = {
    custom_fields?: KeapCustomField[];
};

let cachedWelcomeFieldId:
    | number
    | null = null;

function getKeapApiKey(): string {
    const apiKey =
        process.env.KEAP_SERVICE_ACCOUNT_KEY;

    if (!apiKey) {
        throw new Error(
            "Missing KEAP_SERVICE_ACCOUNT_KEY."
        );
    }

    return apiKey;
}

function getWelcomeFieldName(): string {
    const fieldName =
        process.env
            .KEAP_WELCOME_URL_FIELD_NAME;

    if (!fieldName) {
        throw new Error(
            "Missing KEAP_WELCOME_URL_FIELD_NAME."
        );
    }

    return fieldName;
}

async function readKeapError(
    response: Response
): Promise<string> {
    const body = await response.text();

    if (!body) {
        return `${response.status} ${response.statusText}`;
    }

    try {
        const parsed = JSON.parse(body) as {
            message?: unknown;
            error?: unknown;
            details?: unknown;
        };

        if (
            typeof parsed.message === "string"
        ) {
            return parsed.message;
        }

        if (
            typeof parsed.error === "string"
        ) {
            return parsed.error;
        }

        return body;
    } catch {
        return body;
    }
}

async function keapFetch(
    path: string,
    init?: RequestInit
): Promise<Response> {
    const apiKey = getKeapApiKey();

    return fetch(
        `${KEAP_API_BASE_URL}${path}`,
        {
            ...init,
            headers: {
                Accept: "application/json",
                "Content-Type":
                    "application/json",
                "X-Keap-API-Key": apiKey,
                ...init?.headers,
            },
            cache: "no-store",
        }
    );
}

function normalizeFieldName(
    value: string | undefined
): string {
    return (value ?? "")
        .replace(/^_/, "")
        .replace(/[\s_-]/g, "")
        .toLowerCase();
}

async function getWelcomeFieldId(): Promise<number> {
    if (cachedWelcomeFieldId !== null) {
        return cachedWelcomeFieldId;
    }

    const expectedFieldName =
        getWelcomeFieldName();

    const response = await keapFetch(
        "/contacts/model",
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        const details =
            await readKeapError(response);

        throw new Error(
            `Unable to retrieve Keap contact fields: ${details}`
        );
    }

    const model =
        (await response.json()) as
        KeapContactModelResponse;

    const customFields =
        model.custom_fields ?? [];

    const normalizedExpected =
        normalizeFieldName(
            expectedFieldName
        );

    const matchingField =
        customFields.find((field) => {
            const possibleNames = [
                field.field_name,
                field.database_name,
                field.name,
                field.label,
            ];

            return possibleNames.some(
                (name) =>
                    normalizeFieldName(
                        name
                    ) ===
                    normalizedExpected
            );
        });

    if (!matchingField?.id) {
        throw new Error(
            `Unable to find Keap contact custom field "${expectedFieldName}".`
        );
    }

    const fieldId = Number(
        matchingField.id
    );

    if (
        !Number.isInteger(fieldId) ||
        fieldId <= 0
    ) {
        throw new Error(
            `Keap custom field "${expectedFieldName}" returned an invalid ID.`
        );
    }

    cachedWelcomeFieldId = fieldId;

    return fieldId;
}

export async function updateKeapWelcomeUrl({
    contactId,
    welcomeUrl,
}: UpdateKeapWelcomeUrlInput): Promise<void> {
    const numericContactId =
        Number(contactId);

    if (
        !Number.isInteger(
            numericContactId
        ) ||
        numericContactId <= 0
    ) {
        throw new Error(
            "A valid Keap contact ID is required."
        );
    }

    if (!welcomeUrl.trim()) {
        throw new Error(
            "A welcome URL is required."
        );
    }

    const fieldId =
        await getWelcomeFieldId();

    const response = await keapFetch(
        `/contacts/${numericContactId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                custom_fields: [
                    {
                        id: fieldId,
                        content:
                            welcomeUrl,
                    },
                ],
            }),
        }
    );

    if (!response.ok) {
        const details =
            await readKeapError(response);

        throw new Error(
            `Unable to update Keap welcome URL: ${details}`
        );
    }
}
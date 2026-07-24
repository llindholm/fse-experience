import "server-only";

export const PRODUCT_ACCESS = {
    "feminine-sales-engine": [
        "million-dollar-authority",
        "effortless-sales-system",
        "the-signature-close",
    ],

    "million-dollar-authority": [
        "million-dollar-authority",
    ],

    "effortless-sales-system": [
        "effortless-sales-system",
    ],

    "the-signature-close": [
        "the-signature-close",
    ],
} as const;

export type ProductSlug =
    keyof typeof PRODUCT_ACCESS;

export function getProductCourseSlugs(
    productSlug: string
): string[] | null {
    const product =
        PRODUCT_ACCESS[
        productSlug as ProductSlug
        ];

    return product ? [...product] : null;
}
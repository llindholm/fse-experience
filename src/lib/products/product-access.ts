import "server-only";

export const PRODUCT_ACCESS = {

    "complete-library": [
    "million-dollar-authority",
    "effortless-sales-system",
    "signature-close",
    "underrated",
    "the-catalyst",
],

    "feminine-sales-engine": [
        "million-dollar-authority",
        "effortless-sales-system",
        "signature-close",
    ],

    "million-dollar-authority": [
        "million-dollar-authority",
    ],

    "effortless-sales-system": [
        "effortless-sales-system",
    ],

    "signature-close": [
        "signature-close",
    ],

    "underrated": [
        "underrated",
    ],
    "the-catalyst": [
        "the-catalyst"
    ]
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
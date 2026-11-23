import type { ReactNode } from "react";
import { fse } from "@/content/feminine-sales-engine";

// Native links work without hydration and leave payment selection to the hosted form.
export function EnrollmentButton({children}: {children: ReactNode}) {
  return <a className="cta" href={fse.links.signup} data-fse-enrollment>{children}</a>;
}

export function SalesFooter() {
  return <footer className="footer"><strong>To Living Free</strong><br/><em>Jessica Caver Lindholm</em><nav aria-label="Legal"><a href={fse.links.terms}>Terms and conditions</a><span aria-hidden="true"> · </span><a href={fse.links.privacy}>Privacy policy</a></nav></footer>;
}

import AcquisitionCarouselCreator from "@/components/admin/AcquisitionCarouselCreator";

import "../acquisition.css";



export default function CreateAcquisitionAssetPage() {
    return (
        <main className="acquisition-page">
            <header className="acquisition-create-header">
                <div>
                    <p className="acquisition-eyebrow">
                        Guided creation
                    </p>

                    <h1>
                        Create today&apos;s
                        <span> discovery asset.</span>
                    </h1>

                    <p>
                        The strategy is already decided.
                        Review the thinking, shape the
                        structure, and leave with a finished
                        carousel.
                    </p>
                </div>
            </header>

            <AcquisitionCarouselCreator />
        </main>
    );
}
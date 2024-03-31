


export default function EditGallery(): JSX.Element {
    return (
        <div className="grid grid-cols-2 place-items-center py-8 px-4 text-gray-300 gap-6">

            <div className="gallery-edit-btn">
                <span className="material-symbols-outlined text-3xl leading-none">brush</span>
                Draw
            </div>

            <div className="gallery-edit-btn">
                <span className="material-symbols-outlined text-3xl leading-none">title</span>
                Title
            </div>

            <div className="gallery-edit-btn">
                <span className="material-symbols-outlined text-3xl leading-none">crop</span>
                Crop
            </div>

            <div className="gallery-edit-btn">
            <span className="material-symbols-outlined text-3xl leading-none">tune</span>
                Adjust
            </div>

            <div className="gallery-edit-btn">
            <span className="material-symbols-outlined text-3xl leading-none">contrast</span>
                Effect
            </div>

            <div className="gallery-edit-btn">
            <span className="material-symbols-outlined text-3xl leading-none">grain</span>
                Filter
            </div>
        </div>
    )
}


import { AnimalPreview } from "./animal-preview"



export function AnimalList({ animals }) {
    console.log(animals)
    return (
        <section className="animal-list">
            <h1 className="title">Rare Animals</h1>
            <table className="animal-table">
                    {
                        animals.map(animal => <tbody key={animal._id}><AnimalPreview animal={animal} /></tbody>)
                    }
            </table>
        </section>
    )
}
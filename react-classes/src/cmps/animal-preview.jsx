


export function AnimalPreview({animal}) {
    return (
        <tr className="animal-preview">
            <td>{animal.type}</td>
            <td>{animal.count}</td>
            <td><a href={`https://www.google.com/search?q=${animal.type}`} target="_blank">Search</a></td>
        </tr>
    )
}
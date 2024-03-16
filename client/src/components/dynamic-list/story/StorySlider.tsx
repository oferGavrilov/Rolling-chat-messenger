
const stories = [
    {
        id: 1,
        name: 'John Doe',
        image: 'https://res.cloudinary.com/dqkstk6dw/image/upload/v1707860304/hkjm05gwymesj6qngk27.jpg',
    },
    {
        id: 2,
        name: 'Ofer',
        image: 'https://res.cloudinary.com/dqkstk6dw/image/upload/v1705865825/wgpkdmpym4taq2gbzmd5.png',
    },
    {
        id: 3,
        name: 'Third',
        image: 'https://res.cloudinary.com/dqkstk6dw/image/upload/v1698765743/rugvoaqguk75ulrmynik.jpg',
    },
    {
        id: 4,
        name: 'forth',
        image: 'https://res.cloudinary.com/dqkstk6dw/image/upload/v1693498489/n2ue3tzuqgct3jkyomwd.jpg',
    },
]

const onSelectStory = () => {
    console.log('Story selected')
}

function StorySlider() {
    return (
        <div>
            <div className='flex p-6 gap-x-6 overflow-x-auto scroll-hide'>
                {stories.map((story) => (
                    <div key={story.id} className='min-w-20 rounded-full text-center' onClick={onSelectStory}>
                        <img src={story.image} alt={story.name} className='rounded-full size-20 object-cover object-center outline-dashed outline-2 outline-primary outline-offset-4' />
                        <p className="text-sm mt-2 text-gray-900 dark:text-gray-300"
                        >{story.name}</p>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default StorySlider

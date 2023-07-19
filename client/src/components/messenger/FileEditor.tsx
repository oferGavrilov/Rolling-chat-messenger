import React from 'react'

interface Props {
      file: File | null
      setFile: React.Dispatch<React.SetStateAction<File | null>>
}

export default function FileEditor ({ file, setFile }: Props){
      console.log(file)
      return (
            <div>FileEditor
                  <button onClick={() => setFile(null)}>close</button>
            </div>
      )
}

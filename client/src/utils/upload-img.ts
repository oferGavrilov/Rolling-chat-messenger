
export async function uploadImg(file:File) {
      try {
            const CLOUD_NAME = 'dqkstk6dw'
            const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`
            const UPLOAD_PRESET = 'chat-app'

            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', UPLOAD_PRESET)
            formData.append('cloud_name', CLOUD_NAME)
            
            const res = await fetch(UPLOAD_URL, {
                  method: 'POST',
                  body: formData
            })
            const data = await res.json()
            return data
      } catch (err) {
            console.log(err)
      }
}

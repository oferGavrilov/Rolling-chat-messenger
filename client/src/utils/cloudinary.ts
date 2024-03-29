
export async function uploadImg(file: File, isThumbnail = false, filename: string = '') {
      try {
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
            const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`
            const UPLOAD_PRESET = 'chat-app'

            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', UPLOAD_PRESET)
            formData.append('cloud_name', CLOUD_NAME)

            console.log('isThumbnail', isThumbnail)
            if (isThumbnail) {
                  const publicId = `TN_${filename}`;
                  formData.append('public_id', publicId);
            }

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

export async function uploadAudio(audioBlob: Blob) {
      try {
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
            const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload/`
            const UPLOAD_PRESET = 'chat-app'

            const formData = new FormData()
            formData.append('file', audioBlob)
            formData.append('upload_preset', UPLOAD_PRESET)
            formData.append('cloud_name', CLOUD_NAME)

            const res = await fetch(UPLOAD_URL, {
                  method: 'POST',
                  body: formData,
            })

            const data = await res.json()
            return data.secure_url
      } catch (err) {
            console.log(err)
            return null
      }
}

export async function uploadToCloudinary(blob: Blob) {
      try {
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
            const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload/`
            const UPLOAD_PRESET = 'chat-app'

            const formData = new FormData()
            formData.append('file', blob)
            formData.append('upload_preset', UPLOAD_PRESET)
            formData.append('cloud_name', CLOUD_NAME)

            const res = await fetch(UPLOAD_URL, {
                  method: 'POST',
                  body: formData,
            })

            const data = await res.json()
            console.log(data)
            return data.secure_url
      } catch (err) {
            console.log(err)
            return null
      }
}
import { useCallback, useState } from 'react'
import axios from 'axios'

// function getServerUrl() {
//   if(process.env.NODE_ENV === 'production') {

//   }
// }


function App () {
  const [data, setData] = useState([])
  const [log, setLog] = useState("")


  const getDataFromServer = useCallback(async () => {
    const url = 'http://localhost:5000/api/time'
    try {
      const response = await axios.get(url , {withCredentials: true})
      setData(await response.data)
      console.log(response.data)
    } catch (err) {
      console.log(err)
    }
  }, [])

  async function onSendLog () {
    const url = 'http://localhost:5000/api/log'
    try {
      const post = await axios.post(url, { message: 'Hello from client' })
      // setLog(await post.data)
      console.log(post)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div>
      <button onClick={getDataFromServer}>Get Time from server</button>
      <p>Time from server : {data}</p>
      <button onClick={onSendLog}>Send log</button>
      {/* {log && <p>Logs:{log}</p>} */}
    </div>
  )
}

export default App

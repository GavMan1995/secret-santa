import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import styles from '../styles/Home.module.css'

export default function Home() {
  const supabase = createClient('https://hafbfqhcafolhrfqnefa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk0MTgxNiwiZXhwIjoxOTU0NTE3ODE2fQ._6pAo1ovILPQbiwYI7-65irVke3m_u2dQzkgDxUGcpc')
  const [ cousins, setCousins ] = useState(null)
  const [ currentCousin, setCurrentCousin ] = useState('')
  const [ match, setMatch ] = useState(null)

  const current = currentCousin ? cousins.find((cousin) => Number(cousin.id) === Number(currentCousin)) : null

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('cousins')
        .select()
      
      if (error) {
        console.log('error')
      } else {
        setCousins(data)
      }
    }

    fetchData()
  }, [])

  const chooseMatch =  () => {  
    supabase.from('cousins').select().then(async (res) => {
      console.log('data', res)
      const isMatched = res?.data?.map((cousin) => cousin.match)
      let canMatch = res?.data?.filter((cousin) => !isMatched.includes(cousin.name)).map((cousin) => cousin.name)

      if (canMatch.includes(current.name)) {
        canMatch.splice(canMatch.indexOf(current.name), 1)
      }
      
      if (canMatch.includes(current.exception)) {
        canMatch.splice(canMatch.indexOf(current.exception), 1)
      }
  
      console.log('canMatch', canMatch)
  
      const randIndex = Math.floor(Math.random() * canMatch.length)
      setMatch(canMatch[randIndex])
  
      const { data, error } = await supabase
        .from('cousins')
        .update({ match: canMatch[randIndex] })
        .match({ name: current.name })
    })
  }
  
  return (
    <div className={styles.container}>
      <select onChange={(e) => setCurrentCousin(e.target.value)} value={currentCousin}>
        <option value=''>Choose your name</option>
        {cousins?.map((cousin) => (
          <option key={cousin.name + cousin.id} value={cousin.id}>{cousin.name}</option>
        ))}
      </select>

      <button disabled={currentCousin === '' || current.match || match} onClick={chooseMatch}>Pull Name</button>

     {match || current?.match && <h1 style={{width: '100%'}}>Match: {match || current?.match}</h1>}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

import nakedSanta from '../assets/nakedsanta.png'
import santaDance from '../assets/santa.gif'

export default function Home() {
  const supabase = createClient('https://hafbfqhcafolhrfqnefa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk0MTgxNiwiZXhwIjoxOTU0NTE3ODE2fQ._6pAo1ovILPQbiwYI7-65irVke3m_u2dQzkgDxUGcpc')
  const [ cousins, setCousins ] = useState(null)
  const [ currentCousin, setCurrentCousin ] = useState('')
  const [ match, setMatch ] = useState(null)
  const [safari, setSafari] = useState(null)

  console.log(safari)

  const current = currentCousin ? cousins?.find((cousin) => Number(cousin.id) === Number(currentCousin)) : null

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

    const obj = window.localStorage.getItem('secret-santa-obj')
    if (obj) {
      setCurrentCousin(JSON.parse(obj).id)
    }
    let chromeAgent = window.navigator.userAgent.indexOf("Chrome") > -1;
    let safariAgent = window.navigator.userAgent.indexOf("Safari") > -1
    if ((chromeAgent) && (safariAgent)) safariAgent = false;
    setSafari(safariAgent)
    setTimeout(fetchData, 2000)
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
      
      window.localStorage.setItem('secret-santa-obj', JSON.stringify(data[0]))
    })
  }
  
  return cousins ? (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src={nakedSanta} alt='naked-santa'/>
      </div>
      
      {typeof safari === 'boolean' && !safari ? (
        <>
          <div className={match || current?.match ? styles.message : ''} />
          <h1 className={match || current?.match ? styles.secretName : ''}>{match || current?.match || ''}</h1>
        </>
      ) : (
        <h1 style={match || current?.match ? {} : {display: 'non'}}>{match || current?.match || ''}</h1>
      )}
      
      <div className={styles.selectContainer}>
        <select
        disabled={Boolean(current)}
        onChange={(e) => {
          window.localStorage.setItem('secret-santa-obj', JSON.stringify(cousins?.find((cousin) => Number(cousin.id) === Number(e.target.value))))
          setCurrentCousin(e.target.value)
        }}
        value={currentCousin}>
          <option value=''>Who are you?</option>
          {cousins?.map((cousin) => (
            <option key={cousin.name + cousin.id} value={cousin.id}>{cousin.name}</option>
          ))}
        </select>
      </div>

      <button disabled={currentCousin === '' || current?.match || match} onClick={chooseMatch}>Pull Name</button>

    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src={santaDance} alt='naked-santa'/>
      </div>
      <h3>Loading...</h3>
    </div>
  )
}

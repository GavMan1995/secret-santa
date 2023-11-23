import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

import wreath from '../assets/wreath.png';
import santaDance from '../assets/santa.gif';
import peepingSanta from '../assets/peeping-santa.png';
import elf from '../assets/elf.png';
import present from '../assets/present.png';

export default function Home() {
  const supabase = createClient(
    'https://hafbfqhcafolhrfqnefa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk0MTgxNiwiZXhwIjoxOTU0NTE3ODE2fQ._6pAo1ovILPQbiwYI7-65irVke3m_u2dQzkgDxUGcpc'
  );
  const [member, setMember] = useState(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [skipped, setSkipped] = useState(false);
  const [presentOpen, setPresentOpen] = useState(false);
  const [presentClickCounter, setPresentClickCounter] = useState(0);
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    if (presentClickCounter === 6) {
      setTimeout(() => {
        setAppear(true);
      }, 6000);
    }
  }, [presentClickCounter]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const login = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('lerohl').select().eq('code', enteredCode);

    if (error) {
      alert(
        'Sorry that code is not valid. Please try again! If this continues to happen you may have to bring Gavyn a gift to get it sorted!'
      );
    } else {
      if (data.length === 0) {
        alert(
          'Sorry that code is not valid. Please try again! If this continues to happen you may have to bring Gavyn a gift to get it sorted!'
        );
      } else {
        setMember(data[0]);
      }
    }
  };

  return !loading ? (
    <form onSubmit={(e) => login(e)}>
      <div className={styles.container}>
        <div className={`${styles.peepingSanta}`}>
          <Image src={peepingSanta} alt="peeping-santa" />
        </div>

        <div className={`${styles.elf}`}>
          <Image src={elf} alt="elf" />
        </div>

        <div className={styles.animatedWreathGlitch}>
          <Image src={wreath} alt="wreath" />
        </div>

        <h1 className={styles.title}>
          Merry Christmas{member ? ' ' : ''}
          {member?.name}!
        </h1>

        {member && skipped && !presentOpen && (
          <h3>
            {presentClickCounter === 0 && 'Click the present to get started!'}
            {presentClickCounter === 1 && 'Oops! Sorry about that! Click the present again!'}
            {presentClickCounter === 2 && 'Oh no! Try again!'}
            {presentClickCounter === 3 && 'Uh oh! Now its under the wreath! Click carefully!'}
            {presentClickCounter === 4 && 'I bet you will get it this time!'}
            {presentClickCounter === 5 && 'You are so close!'}
            {presentClickCounter === 6 &&
              (appear
                ? 'Just kidding! This time it will actually work I promise!'
                : 'Uh oh! I think you clicked too many times!')}
            {presentClickCounter === 7 && 'Yay! You did it!'}
          </h3>
        )}

        {member && skipped && !presentOpen && (
          <div
            onClick={() => {
              if (presentClickCounter === 6) {
                setPresentOpen(true)
              } else {
                setPresentClickCounter(presentClickCounter + 1);
              }
            }}
            className={`${styles.present} ${!appear && styles[`presentPosition${presentClickCounter}`]}`}
          >
            <Image src={present} alt="present" />
          </div>
        )}

        {!member && (
          <>
            <input placeholder="Enter your code" onChange={(e) => setEnteredCode(e.target.value)} value={enteredCode} />
            {enteredCode.length === 5 && enteredCode !== '' && enteredCode !== 'd86c3' && enteredCode !== '5d5b0' && (
              <p className={styles.terms}>
                By continuing, you agree to let me sell all of your personal data to data to brokers so that I can afford a
                corvette. <i>I will take you on rides when I get it though!</i>
              </p>
            )}
            {enteredCode.length === 5 && <button type="submit">Continue</button>}
          </>
        )}

        {member && skipped && presentOpen && (
          <>
            <div className={styles.message} />
            <h1 className={styles.secretName}>{member.match}</h1>
          </>
        )}

        {member && !skipped && (
          <button
            onClick={() => setSkipped(true)}
            style={{
              position: 'absolute',
              zIndex: 100,
              bottom: 10,
              right: 10,
              fontSize: 12,
              padding: '5px 10px',
            }}
          >
            SKIP
          </button>
        )}

        {member && !skipped && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
          >
            <iframe
              src="https://neal.fun/password-game/"
              allowFullScreen
              style={{
                width: '100%',
                height: '120vh',
                marginTop: '-160px',
              }}
            ></iframe>
          </div>
        )}
      </div>
    </form>
  ) : (
    <div className={styles.container}>
      <div className={`${styles.imageContainer}`}>
        <Image src={santaDance} alt="dancing santa" />
      </div>
      <h3>Loading...</h3>
    </div>
  );
}

import { useState, FC, useRef } from 'react'
import { Button } from 'react-bootstrap'
import useListTransitionDiy from '@/useListTransitionDiy'
import { useListTransition } from '@/useListTransition'
const List: FC = () => {
  const [list, setList] = useState<number[]>([1])
  const keyRef = useRef<number>(0)
  const timeoutRef = useRef(300)
  const transition = useListTransitionDiy({list, keyRef, time: 300})
  const transition2 = useListTransition(list, 300)
  return (
    <div style={{ display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'column', marginTop: '50px', position: 'relative'}}>
      <section style={{ display: 'flex', justifyContent: 'center'}}>
      <Button 
        onClick={() => setList(pre => pre.concat(pre.length + 1))}
        style={{margin: '10px'}}
      >Add</Button>
       <Button 
        onClick={() => setList([])}
        style={{margin: '10px'}}
      >DeleteAll</Button>
      </section>
     
      {
        transition2((item, stage) => {
          return <p
          style={{
            transition: '.3s',
            // ...(stage === 'leave' && { transitionDelay: item * 50 + 'ms' }),
            // opacity: stage === 'enter' ? 1 : 0,
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            // gap: 20,
            // transformOrigin: 'center right',
            transform: {
              from: 'translateX(-100%) rotate(90deg)',
              enter: 'translateX(0%)',
              leave: 'translateX(100%) rotate(-90deg)',
            }[stage],
          }}
                >
              Item:{item}  
              <Button 
                onClick={() => setList(pre => pre.filter(preItem => preItem !== item ))}
                style={{margin: '10px'}}
              >Delete</Button>
          </p>
        })
      }
    </div>
  )
}

export default List
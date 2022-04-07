import { useState, FC, useRef } from 'react'
import { Button } from 'react-bootstrap'
import useListTransitionDiy from '@/useListTransitionDiy'
const List: FC = () => {
  const [list, setList] = useState<number[]>([])
  const keyRef = useRef<number>(0)
  const transition = useListTransitionDiy({list, keyRef})
  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={() => setList(pre => pre.concat([keyRef.current++]))}>Add</Button>
      {
        transition((state, stage) => {
          return <p
                  style={{
                    transform: {
                      'from': 'translateX(-100%) rotate(90deg)',
                      'enter': 'translateX(0%)',
                      'leave': 'translateX(-100%) rotate(90deg)'
                    }[stage]
                  }}
                >
              Item:{state}
          </p>
        })
      }
    </div>
  )
}

export default List
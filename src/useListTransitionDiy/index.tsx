import { useEffect, useState, useRef } from 'react'
import { setAnimationFrameTimeout, clearAnimationFrameTimeout, Canceller } from '@/helpers/setAnimationFrameTimeout'
interface Props<S = any> {
  list: Array<S>,
  time: number,
  keyRef: React.MutableRefObject<number>
}

interface ListItem<S = any> {
  state: S
  stage: string
  key: number
}

type RenderCallback = (state: any, stage: string) => React.ReactNode

const useListTransitionDiy = (props: Props) => {

  const { list, keyRef, time } = props
  const [initList, setInitList] = useState<ListItem[]>(list.map(item => item))
  const timerRef = useRef<Canceller>({})
  const isEqual =  (a: ListItem[], b:  any[]) => {
    if (a.length != b.length) return false
    return a.filter(item => b.includes(item.state)).length === a.length
  }
  const getAddItem = (a: ListItem[], b:  any[]) => {
    return b.filter(bItem => !a.some(aItem => aItem.state === bItem))
  }
  const getDeleteItem = (a: ListItem[], b:  any[]) => {
    return a.filter(aItem => !b.includes(aItem.state) && aItem.stage === 'enter')
  }
  const hasUpdate = (list: ListItem[]) => {
    return list.some(item => item.stage === 'from')
  }
  useEffect(() => {
    // initList 跟 List比较 state，计算出新增的和需要删除的，每一次操作应该只有新增 or 删除，不会出现两者都存在的情况
    // 通过新增 or 删除的数据更新 initList
    // 如果没有新增 or 删除，就要更新上次操作的数据状态
    // 新增是立刻添加，删除先要改变状态

    // 如果两个列表相等，就更新状态为 from的数据 --> enter
    // 如果不相等，新增--> 加入状态 from， 删除--> 定时移除

    if (!isEqual(initList, list) && hasUpdate(initList)) {
      console.log('1')
      setAnimationFrameTimeout(() => {
        setInitList(preList => {
          return preList.map(item => item.stage === 'from' ? {...item, stage: 'enter'}: item)
        })
      })
    } else {
      const addItem = getAddItem(initList, list)
      const deleteItem = getDeleteItem(initList, list)
      if (addItem.length > 0) {
        console.log('2')
        setInitList(preList => [...preList, { stage: 'from', state: addItem[0], key: ++keyRef.current}])
      } else if(deleteItem.length > 0) {
        console.log('3')
        // 如果全部移除，需要按时间顺序消失
        setInitList(preList => preList.map(item =>  
          item.state === deleteItem[0].state ? 
          {...item, stage: 'leave'} : item
        ))
        clearAnimationFrameTimeout(timerRef.current)
        timerRef.current = setAnimationFrameTimeout(() => {
          setInitList(preList => preList.filter(item => item.stage !== 'leave'))
        }, time)
      }
    }
  }, [list, keyRef, initList])

  const transition = (renderCallback: RenderCallback) => {
    return initList.map(item => {
      return renderCallback(item.state, item.stage)
    })
  }
  return transition
}

export default useListTransitionDiy
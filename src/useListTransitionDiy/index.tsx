import { useEffect, useState } from 'react'
import { setAnimationFrameTimeout, clearAnimationFrameTimeout } from '@/helpers/setAnimationFrameTimeout'
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

  const { list, keyRef } = props
  const [initList, setInitList] = useState<ListItem[]>(list.map(item => item))
  useEffect(() => {
    // initList 跟 List比较 state，计算出新增的和需要删除的，每一次操作应该只有新增 or 删除，不会出现两者都存在的情况
    // 通过新增 or 删除的数据更新 initList
    // 如果没有新增 or 删除，就要更新上次操作的数据状态
    // 新增是立刻添加，删除先要改变状态

    // 如果两个列表相等，就更新状态为 from的数据 --> enter
    // 如果不相等，新增--> 加入状态 from， 删除--> 定时移除

    const adds = list.map(item => {
      if (initList.findIndex(initItem => initItem.state === item) === -1) {
        return item
      }
    }) || []

    const deletes = initList.map(initItem => {
      if (list.findIndex(item => item === initItem.state) === -1) {
        return initItem.state
      }
    }) || []

    if (adds.length > 0) {
        adds.forEach(newItem => {
           keyRef.current++
          setInitList(preList => [...preList, { key:keyRef.current, stage: 'from', state: newItem }])
        })
        // setAnimationFrameTimeout(() => {
        //   setInitList(preList => {
        //    return preList.map(item => {
        //       if (item.stage === 'from') return {...item, stage: 'enter'}
        //       return item
        //     })
        //   })
        // })
    } else if (deletes.length > 0) {
      setInitList(preList => {
        return preList.map(preItem => {
          if (deletes.some(deleteItem => deleteItem === preItem.state)) {
            if (preItem.stage === 'enter')
              return {...preItem, stage: 'leave'}
          }
          return preItem
        })
      })
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
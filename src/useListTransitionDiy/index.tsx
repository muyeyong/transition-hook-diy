import { useState, useEffect } from 'react'
interface Props<S = any> {
  list: Array<S>,
  time: number
}

interface ListItem<S = any> {
  stage: string
  key: number
}

interface ItemKey {
  key: number
}

type RenderCallback = (state: any, stage: string) => React.ReactNode

const useListTransitionDiy = (props: Props) => {

  const { list, time } = props
  const [initList, setInitList] = useState<ListItem[]>(list.map(item => item))
  useEffect(() => {
   
    // 需要知道更新了什么 删除了什么
    const addItems: Array<number | undefined> = list.map(item => {
      const index = initList.findIndex(init => init.key === item.key)
      if (index === -1)  return item.key
    })
    const deleteItems: Array<number | undefined> = initList.map(init => {
      const index = list.findIndex(item => item.key === init.key)
      if (index === -1) return init.key
    })

    if (addItems.length > 0) {}
    if (deleteItems.length > 0) {}
  }, [list, time])

  const transition = (renderCallback: RenderCallback) => {
    return initList.map(item => {
      return renderCallback(item.key, item.stage)
    })
  }
  return transition
}

export default useListTransitionDiy
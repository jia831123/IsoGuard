
import { useCapData } from '@/server/api/useCapData'
import { Response, useCapDataInfo } from '@/server/api/useCapDataInfo'
import { asyncForEach } from '@/utils/asyncForEach'
export const useCapRoad = async(): Promise<Response[]> => {
  let result:Response[]=[]
  let capIds:string[]= []
  const capData = await useCapData().catch(e=>{
    console.error(e)
    return undefined
  })
  if(capData){
    capIds = capData.result.map(item=>item.capid)
    await asyncForEach(capIds,async (capId)=>{
      const data = await useCapDataInfo(capId).catch(e=>{
        console.error(e)
        return undefined
      })
      if(data){
        result.push(data)
      }
    })
  }
  return result
}
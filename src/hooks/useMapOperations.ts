import { useRef, MutableRefObject } from 'react'
import L from 'leaflet'
import { iconConfig } from '../config/iconConfig'
import { ButtonKeys } from '../enums/ButtonKeys'
import { isAsync } from '@/utils'

export const useMapOperations = (mapRef: MutableRefObject<L.Map | null>) => {
  const activeLayersRef = useRef<{ [key: string]: L.Layer }>({})

  const handleSubButtonClick = async(buttonKey: ButtonKeys, index: number) => {
    if (!mapRef.current) return
    console.log(activeLayersRef)
    const key = `${buttonKey}-${index}`
    const category = buttonKey as keyof typeof iconConfig
    const action = iconConfig[category][index].action

    if (activeLayersRef.current[key]) {
      mapRef.current.removeLayer(activeLayersRef.current[key])
      delete activeLayersRef.current[key]
    } else {
      let layer
      if(isAsync(action)){
        layer = await action()
      }else{
        layer = action()
      }
      if (layer !== null) {
        activeLayersRef.current[key] = layer as L.Layer
        mapRef.current.addLayer(layer as L.Layer)
      }
    }
  }

  return { handleSubButtonClick }
}
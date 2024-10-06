export  type Response = {
  identifier: string
  sender: string
  sent: string
  status: string
  msgType: string
  scope: string
  references: any
  info: Array<{
    sections: any
    description: string
    language: string
    category: string
    event: string
    responseType: any
    urgency: string
    severity: string
    certainty: string
    eventCode: {
      valueName: string
      value: string
    }
    effective: string
    expires: string
    senderName: string
    headline: string
    instruction: string
    web: string
    parameter: Array<{
      valueName: string
      value: string
    }>
    area: Array<{
      areaDesc: string
      geocode: any
      circle: string
      polygon: any
    }>
  }>
}
export const useCapDataInfo =(capId:string):Promise<Response>=>{
  const URL = `https://alerts.ncdr.nat.gov.tw/api/dump/datastore?apikey=itj7Q%2BN1z39yGHyXYHVJZLGM%2BfIcytS%2BBq1s8Vf%2FFgxO8QlmAGFcJEnV5a77kyJy&format=json&capid=${capId}`
  return fetch(URL).then(res=>res.json())
}
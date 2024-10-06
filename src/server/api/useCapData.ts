export type Response = {
  success: boolean
  result: Array<{
    capid: string
    capCode: string
    effective: string
    expires: string
    description: string
  }>}
export const useCapData =():Promise<Response>=>{
  const URL = 'https://alerts.ncdr.nat.gov.tw/api/datastore?apikey=itj7Q%2BN1z39yGHyXYHVJZLGM%2BfIcytS%2BBq1s8Vf%2FFgxO8QlmAGFcJEnV5a77kyJy&format=json&capcode=RC'
  return fetch(URL).then(res=>res.json())
}
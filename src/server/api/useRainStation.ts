export const useRainStation = () => {
  const URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/C-B0025-001?Authorization=rdec-key-123-45678-011121314'
  return fetch(URL).then(res=>res.json())
}
export  type Responese = {
  success: string
  result: {
    resource_id: string
    fields: Array<{
      id: string
      type: string
    }>
  }
  records: {
    Station: Array<{
      StationName: string
      StationId: string
      ObsTime: {
        DateTime: string
      }
      GeoInfo: {
        Coordinates: Array<{
          CoordinateName: string
          CoordinateFormat: string
          StationLatitude: number
          StationLongitude: number
        }>
        StationAltitude: string
        CountyName: string
        TownName: string
        CountyCode: string
        TownCode: string
      }
      WeatherElement: {
        Weather: string
        Now: {
          Precipitation: number
        }
        WindDirection: number
        WindSpeed: number
        AirTemperature: number
        RelativeHumidity: number
        AirPressure: number
        GustInfo: {
          PeakGustSpeed: number
          Occurred_at: {
            WindDirection: number
            DateTime: string
          }
        }
        DailyExtreme: {
          DailyHigh: {
            TemperatureInfo: {
              AirTemperature: number
              Occurred_at: {
                DateTime: string
              }
            }
          }
          DailyLow: {
            TemperatureInfo: {
              AirTemperature: number
              Occurred_at: {
                DateTime: string
              }
            }
          }
        }
      }
    }>
  }
}

export const useRainStation = ():Promise<Responese> => {
  const URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWA-D7664167-15D4-404A-9CFD-B425D5675D8A'
  return fetch(URL).then(res=>res.json())
}
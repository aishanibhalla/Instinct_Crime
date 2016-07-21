import pandas as pd
import numpy as np

if __name__ == '__main__':
    hour = []
    month = []
    year = []
    weekday = ['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday','Wednesday']
    pdDistrict = ['BAYVIEW', 'CENTRAL', 'INGLESIDE', 'MISSION','NORTHERN', 'PARK', 'RICHMOND', 'SOUTHERN', 'TARAVAL', 'TENDERLOIN']
    for i in range(0,24):
        hour.append(i)
    #print hour
    df_hour = pd.DataFrame(0, index=range(0,1), columns=hour)
    print df_hour
    for i in range(1,13):
        month.append(i)
    df_month = pd.DataFrame(0, index=range(0,1), columns=month)
    print df_month
    for i in range(2003,2016):
        year.append(i)
    df_year = pd.DataFrame(0, index=range(0,1), columns=year)
    print df_year

    df_weekday=pd.DataFrame(0, index=range(0,1), columns=weekday)
    print df_weekday

    df_pdDistrict = pd.DataFrame(0,index=range(0,1),columns=pdDistrict)
    print df_pdDistrict
import pandas as pd
import time
import numpy as np
from sklearn.externals import joblib

def predict(days,district,hour,month,year,date):
    start_time = time.time()
    test = pd.read_csv('test.csv', parse_dates=['Dates'])
    print days,district,hour,month,year,date
    hour_1=[]
    month_1=[]
    year_1=[]
    days_1=['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday','Wednesday']
    district_1=['BAYVIEW', 'CENTRAL', 'INGLESIDE', 'MISSION','NORTHERN', 'PARK', 'RICHMOND', 'SOUTHERN', 'TARAVAL', 'TENDERLOIN']

    df_weekday = pd.DataFrame(0, index=range(0, 1), columns=days_1)
    df_weekday[days] = 1
    print df_weekday

    #district = test.PdDistrict
    df_pdDistrict = pd.DataFrame(0, index=range(0, 1), columns=district_1)
    df_pdDistrict[district] = 1
    print df_pdDistrict

    #hour = test.Dates.dt.hour
    for i in range(0, 24):
        hour_1.append(i)
    # print hour
    df_hour = pd.DataFrame(0, index=range(0, 1), columns=hour_1)
    df_hour[hour] = 1

    #hour = pd.get_dummies(hour)
    #print "hour"
    print df_hour
    #month = test.Dates.dt.month
    for i in range(1, 13):
        month_1.append(i)
    df_month = pd.DataFrame(0, index=range(0, 1), columns=month_1)
    df_month[month] = 1
    #month = pd.get_dummies(month)
    #print "month"
    #print df_month
    #year = test.Dates.dt.year
    for i in range(2003, 2016):
        year_1.append(i)
    df_year = pd.DataFrame(0, index=range(0, 1), columns=year_1)
    df_year[year] = 1
    #year = pd.get_dummies(year)
    print df_year
    date_1=[]
    #date = test.Dates.dt.day
    for i in range(1,32):
        date_1.append(i)
    df_date = pd.DataFrame(0, index=range(0, 1), columns=date_1)
    df_date[date] = 1
    print df_date
    #date = pd.get_dummies(date)

    test_data = pd.concat([df_hour, df_weekday, df_month, df_year,df_pdDistrict,df_date], axis=1)
    #test_data['crime'] = crime

    print test_data
    features = ['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday',
                'Wednesday','BAYVIEW', 'CENTRAL', 'INGLESIDE', 'MISSION',
    'NORTHERN', 'PARK', 'RICHMOND', 'SOUTHERN', 'TARAVAL', 'TENDERLOIN']
    features_time = [x for x in range(0,24)]
    features = features + features_time

    features_date = [x for x in range(1,32)]
    features = features + features_date

    features_year = [x for x in range(2003,2016)]
    features = features + features_year

    features_month = [x for x in range(1,13)]
    features = features + features_month

    model = joblib.load('nb_model.pkl')

    predicted = np.array(model.predict_proba(test_data[features]))
    print predicted
    # predicted=model.predict_proba(test[features])




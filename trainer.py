import pandas as pd
from sklearn import preprocessing
from sklearn.naive_bayes import BernoulliNB
import time
from sklearn.externals import joblib

# Load Data with pandas, and parse the first column into datetime
start_time = time.time()
train = pd.read_csv('CrimeDataV5_Subset.csv', parse_dates=['Dates'])


le_crime = preprocessing.LabelEncoder()
crime = le_crime.fit_transform(train.Category)
print (le_crime)
print crime
print len(crime)
set_crime= set()
for i in range(0,len(crime)):
    set_crime.add(crime[i])

print "set"
print set_crime
crimeLabels = le_crime.inverse_transform(list(set_crime))
print crimeLabels
#print len(crimeLabels)
# Get binarized weekdays, districts, and hours.
days = pd.get_dummies(train.DayOfWeek)
print "hello"
print days
district = pd.get_dummies(train.PdDistrict)
print district
hour = train.Dates.dt.hour
print hour
hour = pd.get_dummies(hour)
month = train.Dates.dt.month
print month
month = pd.get_dummies(month)
year = train.Dates.dt.year
print year
year = pd.get_dummies(year)
date = train.Dates.dt.day
print date
date = pd.get_dummies(date)
print "hello"
#print days,district,hour,month,year,date


# Build new array
train_data = pd.concat([hour, days, month,district,date], axis=1)
#print train_data
train_data['crime'] = crime
#print train_data['crime']

#training=train_data
#training, validation = train_test_split(train_data, train_size=1.0)

features = ['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday',
            'Wednesday',"Bayview","Bernal Heights","Castro / Upper Market","China Town","Crocker Amazon","Diamond Heights",
"Downtown","Excelsior","Financial District","Glen Park","Golden Gate Park","Haight Ashbury","Inner Richmond","Inner Sunset","Lakeshore","Marina","Mission","Nob Hill","Noe Valley",
"North Beach","Ocean View","Outer Mission","Outer Richmond","Outer Sunset","Pacific Heights","Parkside","Portero Hills","Presidio","Presidio Heights","Russian Hills",
"Sea Cliff","South Market","Treasure Island","Twin Peaks","Visitacion Valley","West Twin Peaks","Western Addition"]

features_time = [x for x in range(0,24)]
features = features + features_time

features_date = [x for x in range(1,32)]
features = features + features_date


features_month = [x for x in range(1,13)]
features = features + features_month

print features
#training, validation = train_test_split(train_data, train_size=.60)
model = BernoulliNB()
model.fit(train_data[features], train_data['crime'])
print model
joblib.dump(model, 'nb_model.pkl')

#predicted = np.array(model.predict_proba(validation[features]))
#print log_loss(validation['crime'], predicted)
#print predicted

print("--- %s seconds ---" % (time.time() - start_time))
import pandas as pd
from sklearn.cross_validation import train_test_split
from sklearn import preprocessing
from sklearn.metrics import log_loss
from sklearn.naive_bayes import BernoulliNB
import numpy as np

# Load Data with pandas, and parse the first column into datetime
train = pd.read_csv('train.csv', parse_dates=['Dates'])
#test = pd.read_csv('test.csv', parse_dates=['Dates'])

# Convert crime labels to numbers
le_crime = preprocessing.LabelEncoder()
crime = le_crime.fit_transform(train.Category)

# Get binarized weekdays, districts, and hours.
days = pd.get_dummies(train.DayOfWeek)
district = pd.get_dummies(train.PdDistrict)
hour = train.Dates.dt.hour
hour = pd.get_dummies(hour)
month = train.Dates.dt.month
month = pd.get_dummies(month)
year = train.Dates.dt.year
year = pd.get_dummies(year)
# date = train.Dates.dt.date
# date = pd.get_dummies(date)


# Build new array
train_data = pd.concat([hour, days, month, year,district], axis=1)
train_data['crime'] = crime

# Repeat for test data
# days = pd.get_dummies(test.DayOfWeek)
# district = pd.get_dummies(test.PdDistrict)
#
# hour = test.Dates.dt.hour
# hour = pd.get_dummies(hour)
# month = test.Dates.dt.month
# month = pd.get_dummies(month)
# year = test.Dates.dt.year
# year = pd.get_dummies(year)
# date = test.Dates.dt.date
# date = pd.get_dummies(date)
#
# test_data = pd.concat([hour, days, district], axis=1)

training, validation = train_test_split(train_data, train_size=.60)

features = ['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday',
            'Wednesday','BAYVIEW', 'CENTRAL', 'INGLESIDE', 'MISSION',
'NORTHERN', 'PARK', 'RICHMOND', 'SOUTHERN', 'TARAVAL', 'TENDERLOIN']
features_time = [x for x in range(0,24)]
features = features + features_time

# features_date = [x for x in range(1,31)]
# features = features + features_date

features_year = [x for x in range(2003,2018)]
features = features + features_year

features_month = [x for x in range(1,12)]
features = features + features_month


training, validation = train_test_split(train_data, train_size=.60)
model = BernoulliNB()
model.fit(training[features], training['crime'])
predicted = np.array(model.predict_proba(validation[features]))
print log_loss(validation['crime'], predicted)
print predicted


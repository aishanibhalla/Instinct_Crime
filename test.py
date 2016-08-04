import pandas as pd
from sklearn import preprocessing
from sklearn.naive_bayes import BernoulliNB
import time
from sklearn.externals import joblib

# Load Data with pandas, and parse the first column into datetime
start_time = time.time()
train = pd.read_csv('Crime07282016.csv', parse_dates=['Dates'])
print train.Category.unique()
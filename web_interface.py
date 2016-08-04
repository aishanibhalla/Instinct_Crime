from flask import Flask,make_response,request
import predictor
from datetime import datetime
import csv
app=Flask(__name__)

@app.route('/stats',methods=['GET'])
def get_prediction():
    if request.method == 'GET':
        outputFile = open('/Applications/XAMPP/xamppfiles/htdocs/output.csv', 'w')
        outputwriter = csv.writer(outputFile)
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        print "hello"
        date=request.args.get("date")
        print date
        print type(date)
        date_object = datetime.strptime(date, '%Y-%m-%d')
        dayNumber = date_object.weekday()
        print date_object
        day = days[dayNumber]
        date=date.split("-")
        year=int(date[0])
        month=int(date[1])
        week_date=int(date[2])
        print date
        print year,month,week_date
       # print time
       # print hour
        result={}
        location=["Seacliff","Haight Ashbury","Outer Mission","Russian Valley","Russian Hill","Noe Valley","Inner Sunset","Downtown/Civic Center","Diamond Heights",
"Tresure Island/YBI","Lakeshore","Outer Richmond,Croker Amazon","Excelsior","Parkside","Financial District","Ocean View","Mission","West of Twin Peaks",
"Inner Richmond","Marina","Bayview","Visitacion Valley",
"Pacific Height","Presidio","Nob Hill","Outer Sunset","Western Addition","Golden Gate Park","Presidio Heights","South of Market","Glen Park","Portero Hill","Castro/Upper Market","Twin Peaks","Chinatown","North Beach"]
        for each_location in location:
            time_list=[]
            for z in range(0,24):
                time_list.append(predictor.predict(day,each_location,z,month,year,week_date))
            outputwriter.writerow(time_list)
            result[each_location]=time_list
        print result
        if(request.args.get('callback')!=None):
            return '{0}({1})'.format(request.args.get('callback'),result)
        else:
            return "hello"
       # except:
        #    return "something went wrong"



if __name__ == '__main__':
    app.debug=True
    app.run(host='0.0.0.0',port=5009)

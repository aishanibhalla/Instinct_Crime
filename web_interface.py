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
        location=["Bayview","Bernal Heights","Castro / Upper Market","China Town","Crocker Amazon","Diamond Heights",
"Downtown","Excelsior","Financial District","Glen Park","Golden Gate Park","Haight Ashbury","Inner Richmond","Inner Sunset","Lakeshore","Marina","Mission","Nob Hill","Noe Valley",
"North Beach","Ocean View","Outer Mission","Outer Richmond","Outer Sunset","Pacific Heights","Parkside","Portero Hills","Presidio","Presidio Heights","Russian Hills",
"Sea Cliff","South Market","Treasure Island","Twin Peaks","Visitacion Valley","West Twin Peaks","Western Addition"]
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

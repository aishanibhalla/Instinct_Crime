from flask import Flask,make_response,request
import predictor
app=Flask(__name__)
@app.route('/stats',methods=['GET'])
def get_prediction():
    if request.method == 'GET':
        print "hello"
        print request.args
        #try:
        date=request.args.get("event")
        time=request.args.get("when")
        hour=int(time.split(":")[0])
        date=date.split("-")
        year=int(date[0])
        month=int(date[1])
        week_date=int(date[2])
        print date
        print year,month,week_date
        print time
        print hour
        result={}
        location=['BAYVIEW', 'CENTRAL', 'INGLESIDE', 'MISSION','NORTHERN', 'PARK', 'RICHMOND', 'SOUTHERN', 'TARAVAL', 'TENDERLOIN']
        for each_location in location:
            result[each_location]=predictor.predict("Tuesday",each_location,hour,month,year,week_date)
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

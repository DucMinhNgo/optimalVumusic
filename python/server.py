from flask import Flask
import GPUtil
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    _string = ""
    try:
        deviceID = GPUtil.getFirstAvailable(order = 'first', maxLoad=0.5, maxMemory=0.5, attempts=1, interval=900, verbose=False)
        _string = str(deviceID)
    except:
        _string = "null"
    print (_string)
    return _string

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8091, debug=True)
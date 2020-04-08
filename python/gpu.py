import GPUtil
try:
    deviceID = GPUtil.getFirstAvailable(order = 'first', maxLoad=0.5, maxMemory=0.5, attempts=1, interval=900, verbose=False)
    print (deviceID)
except:
    print ("null")
from flask import Flask, send_from_directory, request
from flask import jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import subprocess
from pathlib import Path
import json
import os
import random
from parameter_script import interface
app = Flask(__name__)
# create database
app.config['MONGO_DBNAME'] = 'music'
# app.config['MONGO_URI'] = 'mongodb://192.168.1.36:27017/vimusic'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/vimusic'
CORS(app)
mongo = PyMongo(app)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

class MODE:
	TRAIN = "train"
	GENERATE = "generate"

class ID:
	HAO = 0
	TONY = 1
	TYLER = 2

class MOOD:
	BRIGHT = "bright"
	SAD = "sad"

class GENRE:
	POP = "pop"
	ROCK = "rock"
	JAZZ = "jazz"
	CLASSICAL = "classical"
	MISCELLANEOUS = "miscellaneous"

class SPEED:
	SLOW =  "slow"
	MEDIUM = "medium"
	FAST = "fast"

class DURATION:
	pass

def random_duration(start, end):
    return random.randint (start,end)

@app.route('/mongo', methods=['GET'])
def testmongo():
	users = mongo.db.users
	for element in users.find():
		print (element)
		print ("---------")
	return 'test_mongo'

@app.route('/renamemusic', methods=['POST'])
def renamemusic():
	index = 0
	users = mongo.db.users
	for element in users.find():
		if str(element['_id']) == '5e61bf04d96b0e6e3d5dec82':
			arr = element['listMusic']
			# arr[index]['name'] = 'PU'
			arr = '[{"name": "0AuraLee2.mp3", "duration": 97}, {"name": "1.mp3", "duration": 444}, {"name": "2.mp3", "duration": 232}, {"name": "4.mp3", "duration": 789}, {"name": "6.mp3", "duration": 162}, {"name": "MT_gfm_generate_midi_06:16:19.485630_1_noteTemp:1.0_durTemp:1.0..mp3", "duration": 34}]'
			users.update(
				{'_id': element['_id']},
				{"$set":
					{
						'listMusic': arr
					}
				}

			)

		

	return ''

@app.route('/addmusic', methods=['POST'])
def addmusic():
	users = mongo.db.users
	# '5e61c648df7be317c4dd1fba'
	# ----------------update -----------
	for element in users.find():
		# print (str(element['_id']))
		if str(element['_id']) == '5e61bf04d96b0e6e3d5dec82':
			# print (element['email'])
			# element['role'] = 'pro'
			users.update(
				{'_id': element['_id']},
				{"$set":
					{
						'role' : 'pro',
						'listMusic': [{
							'name': 'dustin',
							'duration': 1
						}]
					}
				}

			)
	# -------------------------end update


			# my_query = {"_id": element['_id']}
			# new_value = {"role": "pro"}
			# element.update_one(my_query, new_value)
	return 'addmusic'

@app.route('/', methods=['GET'])
def showfirst():
	return 'show first'

@app.route('/runscript', methods=['GET'])
def runscript():
	return 'successfully'

@app.route('/api/terminal', methods=['POST','GET'])
def terminal():
	req = request.get_json() or {}
	# Hao, Tyler, Tony
	if req.get('nameWeb') is None:
		name_web = ''
	else:
		name_web = req.get('nameWeb')

	if req.get('model') is None:
		model = ''
	else:
		model = req.get('model')

	if req.get('mood') is None:
		mood = ''
	else:
		mood = req.get('mood')

	if req.get('title') is None:
		genre = ''
	else:
		genre = req.get('genre')

	if req.get('speed') is None:
		speed = ''
	else:
		speed = req.get('speed')
	# <1, 1-2, 2-3, 3-4, 4-5, >5
	if req.get('duration') is None:
		duration = ''
	else:
		duration = req.get('duration')

	if req.get('lyric') is None:
		lyric = ''
	else:
		lyric = req.get('lyric')
	_userid = 1
	USING_GPU_ID = 1
	mode = "generate"
	mood = MOOD.SAD
	genre = genre
	num_outputs = 1
	person_id = ID.TONY
	output_dir = "./sample/" + str(_userid) + "/" + "temp_midi/"
	# COMMAND = interface(mode, mood, genre, num_outputs, person_id, output_dir)
	# if person_id == 1:
		# Tony
		# COMMAND = "CUDA_VISIBLE_DEVICES=" + str(USING_GPU_ID)
	#else:
		# COMMAND += interface(mode, mood, genre, num_outputs, person_id, duration, speed, lyric)
	genre = 'classical'
	# test--------------------------------------------
	if genre == GENRE.POP:
		COMMAND = "CUDA_VISIBLE_DEVICES=3 python /home/tony/viMusic/MT_multitask/generate_mt.py --model_path /home/Projects/viMusic/tony/stable_models/Pop_Transformer.pth --output_dir ./sample/1/temp_midi/ --num_outputs 1 --n_words 600 --config default"
	if genre == GENRE.ROCK:
		COMMAND = "CUDA_VISIBLE_DEVICES=3 python /home/tony/viMusic/MT_multitask/generate_mt.py --model_path /home/Projects/viMusic/tony/stable_models/Rock_Transformer.pth --output_dir ./sample/1/temp_midi/ --num_outputs 1 --n_words 600 --config default"
	if genre == GENRE.CLASSICAL:
		COMMAND = "CUDA_VISIBLE_DEVICES=3 python /home/tony/viMusic/MT_multitask/generate_mt.py --model_path /home/Projects/viMusic/tony/stable_models/Classical_Transformer.pth --output_dir ./sample/1/temp_midi/ --num_outputs 1 --n_words 600 --config default"
	# end----------------------------------------------
	print ("COMMAND: ", COMMAND)
	users = mongo.db.users
	for element in users.find():
		if str(element['_id']) == '5e61bf04d96b0e6e3d5dec82':
			arr = element['listMusic']
			# COMMAND = str("CUDA_VISIBLE_DEVICES=" + str(USING_GPU_ID) + interface(generate, mood, genre, num_outputs, person_id))
			p = subprocess.Popen(COMMAND, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
			retval = p.wait()
			# show name list midi
			recordObject = []
			command_ls_temp_midi = "ls " + output_dir
			path_output_midi = "./sample/1/output_midi/"
			p = subprocess.Popen(command_ls_temp_midi, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

			for element in p.stdout.readlines():
				substr = str(element)

				midi_name = substr[2:len(substr)-3]
				print ("midi_name: ", midi_name)
				new_name = substr[2:len(substr)-7]+".mp3"
				command_convert_midi_to_mp3 = "timidity "
				command_convert_midi_to_mp3 += path_output_midi + midi_name
				command_convert_midi_to_mp3 += " -Ow -o - | lame - -b 64 "
				command_convert_midi_to_mp3 += path_output_midi + new_name
				subprocess.Popen(command_convert_midi_to_mp3, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
				recordJson = {
					"name" : new_name,
					"duration" : duration
				}
				arr.append(recordJson)
				recordObject.append(recordJson)
				rm_data_temp_midi = "mv ./sample/1/temp_midi/* ./sample/1/output_midi"
				print (rm_data_temp_midi)
				mv = subprocess.Popen(rm_data_temp_midi, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
		
				# print (str(element['_id']))
		
			
			users.update(
				{'_id': element['_id']},
				{"$set":
					{
						'listMusic': arr
					}
				}

			)
			return json.dumps(recordObject)
		else:
			return {
				'status':False,
				'message': 'User is not found'
			}

@app.route('/api/namelist', methods=['GET'])
def namelist():
	_userid = 1
	recordObject = []
	subprocess.Popen("rm ./sample/" + str(_userid) +"/output_midi/*.mid", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
	p = subprocess.Popen("ls ./sample/" + str(_userid) + "/output_midi", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
	# _name = "2020-02-03_085740_1.mp3"
	# duration = 'mp3info -p "%S\n" ../sample/output_midi/'+_name
	for element in p.stdout.readlines():
		substr = str(element)
		# duration = 'mp3info -p "%S\n" ../sample/output_midi/' + substr[2:len(substr)-3]
		# get tail of file
		if substr[-6:-3] == "mp3":
			# _name = "2020-02-03_085740_1.mp3"
			duration = 'mp3info -p "%S\n" ./sample/'+ str(_userid) + '/output_midi/' + substr[2:len(substr)-3]
			command_duration = subprocess.Popen(duration, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
			for duration_element in command_duration.stdout.readlines():
				_duration = str(duration_element)
				recordJson = {
					"name" : substr[2:len(substr)-3],
					"duration" : int(_duration[2:-3])
				}
			recordObject.append(recordJson)	
	return json.dumps(recordObject)

@app.route('/api/miditomp3', methods=['GET'])
def midi_to_mp3():
	p = subprocess.Popen("ls ./sample/output_midi", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
	for element in p.stdout.readlines():
		substr = str(element)
		midi_name = substr[2:len(substr)-3]
		new_name = substr[2:len(substr)-7]+".mp3"
		command_convert_midi_to_mp3 = "timidity "
		command_convert_midi_to_mp3 += "./sample/output_midi/" + midi_name
		#command_convert_midi_to_mp3 += " -Ow -o - | lame - -b 64 "
		#command_convert_midi_to_mp3 += " -Ow -o - "
		command_convert_midi_to_mp3 += " ./sample/output_midi/" + new_name
		print (command_convert_midi_to_mp3)
		subprocess.Popen(command_convert_midi_to_mp3, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
	return 'convert'

# public static music
@app.route("/api/musics/<filename>", methods=["GET"])
def responseImage(filename, _userid = 1):
    # get link save music
    target = os.path.join(APP_ROOT, './sample/'+ str(_userid) + '/output_midi/')
    return send_from_directory(target, filename)

# create string commnadline
@app.route("/api/commandai", methods=["GET"])
def command_ai():
	return "interface('generate', 'sad', 'pop', 1, 1)"

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8091, debug=True)
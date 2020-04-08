var User = require('../models/user');
var Queue = require('../models/queue');
var fs = require('fs');
const { exec } = require("child_process");
const system = require('system-commands')
var spawn = require("child_process").spawn;
const CircularJSON = require('circular-json');
var APP_ROOT = "/home/dustin/nodejs/vimusic";
var arrRequest;
var arrResponse;
var lisResponse;
var cache = require('memory-cache');
// cache.put('foo', []);
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
function sleep (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
function callName (req, res) {
    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will 
    // so, first name = Mike and last name = Will 
    var process = spawn('python',["./python/test.py"]);
    process.stdout.on('data', function(data) { 
        res.send(data.toString()); 
        })
    }
function getListFileInFolder (_midiPath) {
    exec(_midiPath, (error, stdout, stderr) => {
        if (error) {
            res.json({
                status: false,
                result: error.message
            });
        } if (stderr) {
            res.json({
                status: false,
                result: stderr
            })

        } else {
            // console.log(stdout);
            if (stdout) {
                var _string = stdout;
                const arr_music = _string.split('\n');
                const len_array_music = arr_music.length;
                let command_convert = "";
                let link = "";
                return 'arr_music'
            }
        }
    });
}

module.exports = app => {
    app.get('/createjson', (req, res) => {
        /*
        * Create .json file
        */
       var main = {
        "verse": [
            "I've been alone with you inside my mind",
            "And in my dreams I've kissed your lips a thousand times",
            "I sometimes see you pass outside my door",
            "Hello, is it me you're looking for?"
        ],
        "chorus":
        [
            "Hello from the other side",
            "I must've called a thousand times",
            "To tell you I'm sorry for everything that I've done",
            "But when I call you never seem to be home",
            "Hello from the outside",
            "At least I can say that I've tried",
            "To tell you I'm sorry for breaking your heart",
            "But it don't matter, it clearly doesn't tear you apart anymore"
        ]
    }
        // writeFile function with filename, content and callback function
        fs.writeFile(APP_ROOT + "/public/musics/5e68828e1a301f125fb94c50" + "/temp_midi/test_lyrics.json", JSON.stringify(main) , function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        /*
        * end create .json file
        */
       res.json({
           status: true
       })
    });
    app.get('/pushlist', (req, res) => {
        if (lisResponse == undefined) {
            lisResponse = [];
        }
        lisResponse.push(res);
    });
    app.get('/responsedata', (req, res) => {
        console.log(lisResponse);
        lisResponse[0].json({
            status: true
        });
        res.json({
            status: true
        })
    });
    app.get('/testqueue', function (req, res) {
        if (arrRequest == undefined) {
            arrRequest = [];
        };
        if (arrResponse == undefined) {
            arrResponse = [];
        };

        res.json({
            status: true
        })
    });
    app.get('/chooseMusic', function (req, res) {
        // var requestIp = require('request-ip');
        // var clientIp = requestIp.getClientIp(req);
        // console.log("APP_ROOT: ", __dirname);
        // var url = req.url;
        console.log(req.id);
        // url.id = url.split("/")[2];
        res.json({
            status: true,
            id: req.id
        })
    });
   
    app.get('/name', callName);
    app.post('/undefine', (req, res) => {
    const {dustin, pu} = req.body;
    console.log(dustin);
    console.log(pu);
        res.json({
            status: true,
            result: 'reqtrue'
        })
    
    });
    app.get('/removefile', (req, res) => {
        let pathMusicFolder = './public/musics/';
        var id = "5e68828e1a301f125fb94c50";
        let link_remove = "rm " + pathMusicFolder + id.toString() + '/temp_midi/*.midi';
        console.log(link_remove);
        exec(link_remove, (error, stdout, stderr) => {
            if (error) {
                res.json({
                    status : false,
                    msg : 'remove file is error'
                });
            } if (stderr) {
                res.json({
                    status : false,
                    msg : 'remove file is error'
                });
            } else {
                res.json({
                    status: true,
                    msg : 'success'
                })

            }
        });
    })
    app.get('/getduration', (req, res) =>{
        var mp3Duration = require('mp3-duration');
        mp3Duration('home/dustin/nodejs/vimusicpublic/musics/5e68828e1a301f125fb94c50/temp_midi/MT_gfm_generate_midi_03:26:31.831210_1_noteTemp:1.0_durTemp:1.0.midi', function (err, duration) {
        if (err) return console.log(err.message);
    res.json({result: 'Your file is ' + duration + ' seconds long'});
});

    });
    app.get('/indexajax', (req, res) => res.render('testajax'));
    app.get('/api/command', function(req, res) {
     var _string = "MT_gfm_generate_midi_10:18:14.818605_1_noteTemp:1.0_durTemp:1.0.midi\nMT_gfm_generate_midi_10:19:24.521069_1_noteTemp:1.0_durTemp:1.0.midi\n";
     const arr_music = _string.split('\n');
     const len_array_music = arr_music.length;
     let command_convert = "";
     for (let i = 0; i < len_array_music - 1; i++) {
         let element = arr_music[i];
         let len_element = element.length;
        //  console.log(len_element);
        //  console.log(element);
        //  console.log(element.substring(0,len_element - 5));
         let new_name = element.substring(0,len_element - 5) + ".mp3";
         let subCommand = "timidity " + APP_ROOT + "/public/musics/5e68828e1a301f125fb94c50/temp_midi/" + element + " -Ow -o - | lame - -b 64 " + APP_ROOT + "/public/musics/" + new_name;
         if (i == 0) {
             command_convert += subCommand;
         } else {
             command_convert += " && " + subCommand;
         }
    }

    exec(command_convert, (error, stdout, stderr) => {
        if (error) {
           //  res.json({error: error});
        } if (stderr) {
           
            res.send({result: command_convert});
            
           //  res.json({stderr: stderr});
        } else {
           //  res.json({stdout: stdout});
        }
       });
    });
    app.put('/api/reboot/:id', function(req, res) {
        // listMusic
        const id = req.params.id;
        arr = [{
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 1,
                title: "0AuraLee2",
                duration: 97,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "0AuraLee2.mp3"
            },
            {
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 2,
                title: "1",
                duration: 444,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "1.mp3"
            },
            {
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 3,
                title: "2",
                duration: 232,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "2.mp3"
            },
            {
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 4,
                title: "4",
                duration: 789,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "4.mp3"
            },
            {
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 5,
                title: "6",
                duration: 162,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "6.mp3"
            },
            {
                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                key: 6,
                title: "MT_gfm_generate_midi_06:16:19.485630_1_noteTemp:1.0_durTemp:1.0.",
                duration: 34,
                parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
                createDate:new Date(),
                likeStatus:'false',
                link: "MT_gfm_generate_midi_06:16:19.485630_1_noteTemp:1.0_durTemp:1.0..mp3"
        }]
        arr = [];
        User.findOne({_id: id}, function (err, doc) {
            if (doc) {
                doc.listMusic = [];
                doc.listMusic = arr;
                doc.save();
                res.json({
                    status: true,
                    result: doc.listMusic
                })
            } else {
                res.json({
                    status: false,
                    result:'id is not found'
                });
        }
        });
    });
    app.get('/api/namelist', function(req, res) {
        // listMusic
        var id = req.cookies['idUser'];
		if (id) {
			// return res.send({
			// 	token: token,
			// 	idUser: idUser
            // });
            console.log("id: ", id);
        } else {
            console.log("id not found")
        }
        id = "5e68828e1a301f125fb94c50"
        // id = "5e7d9bea2fb3ca5c43912084"
        // const id = req.params.id;
        User.findOne({_id: id}, function (err, doc) {
            if (doc) {
                res.json({
                    status: true,
                    result: doc.listMusic
                })
            } else {
                res.json({
                    status: false,
                    result:'id is not found'
                });
        }
        });
    });
    app.post('/api/music/like', function(req, res) {
        var id = req.cookies['idUser'];
		if (id) {
			// return res.send({
			// 	token: token,
			// 	idUser: idUser
            // });
            console.log("id: ", id);
		} else {
            console.log("id not found")
        }
        // id = "5e68828e1a301f125fb94c50"
        // id = "5e68828e1a301f125fb94c50";
        const {idMusic, likeStatus} = req.body;
        console.log("likeStatus: ", typeof(likeStatus));
        if (!idMusic || !likeStatus) {

        }
        // console.log(idMusic + " " + likeStatus);
        User.findOne({_id: id}, function (err, doc) {
            if (doc) {
                arr = doc.listMusic;
                lenArr = arr.length;
                // console.log(ar)
                let flat = false;
                for (let i = 0; i < lenArr; i++) {
                    // console.log("arr[i]", arr[i].idMusic);
                        if (arr[i].idMusic == idMusic) {
                            console.log("idMusic: ", idMusic);
                            if (likeStatus == 'true') {
                                arr[i].likeStatus = 'false';
                            } else {
                                arr[i].likeStatus = 'true';
                            }
                            doc.listMusic = [];
                            doc.listMusic = arr;
                            doc.save();
                            res.json({
                                status: true,
                                msg: 'done'
                            })
                            flat = true;
                            break;
                        }
                }
                
                    // res.json({
                    //     status: false,
                    //     msg: 'please check params'
                    // })
                
            } else {
                res.json({
                    status: false,
                    result:'id is not found'
                });
            }
        });
    })
    app.post('/api/music/rename', function(req, res) {
        // listMusic
        const {idMusic, newname} = req.body;
        var id = req.cookies['idUser'];
		if (id) {
			// return res.send({
			// 	token: token,
			// 	idUser: idUser
            // });
            console.log("id: ", id);
		} else {
            console.log("id not found")
        }
        // id = "5e68828e1a301f125fb94c50"
        // id = "5e68828e1a301f125fb94c50";
        // const id = req.params.id;
        User.findOne({_id: id}, function (err, doc) {
            if (doc) {
                var arr = doc.listMusic;
                lenArr = arr.length
                let flat = false;
                for (let i = 0; i < lenArr; i++) {
                    if (arr[i].idMusic == idMusic) {
                        flat = true;
                        // console.log(arr[i]);
                        arr[i].title = newname;
                        doc.listMusic = [];
                        doc.listMusic = arr;
                        doc.save();
                        res.json({
                            status:true,
                            msg: 'rename is successful'
                        })
                    }
                }
                if (flat == false) {
                    res.json({
                        status:false,
                        msg: 'idMusic is not found'
                    })
                }
            } else {
                res.json({
                    status: false,
                    result:'id is not found'
                });
        }
        });
    })
    app.get('/api/random', function(req, res) {
        res.json({random: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)})
    });
    app.post('/api/precreatemusic', function (req, res) {
        const genre = 'Classical';
        var cuda_visible_devices = 2;
        num_output = 5;
        var process = spawn('python',["./python/gpu.py"]);
        process.stdout.on('data', function(data) {
            if (data.toString() != "null\n") {
            cuda_visible_devices = Number(data.toString().substring(1,2));
            console.log("CUDA: ", cuda_visible_devices);
                let pathMusicFolder = './public/musics/' + genre;
                let link_remove ="rm -r " + pathMusicFolder + '/temp_midi/';
                exec(link_remove, (error, stdout, stderr) => {
                    if (error) {
                        res.json({
                            status : false,
                            msg : 'remove file is error'
                        });
                    } if (stderr) {
                        res.json({
                            status : false,
                            msg : 'remove file is error'
                        });
                    } else {
                    }
                });
                let genre_Transformer = "";
                console.log("GENRE: ", genre);
                if (genre == "Rock") {
                    genre_Transformer = "Rock_Transformer.pth";
                } else if (genre == "Pop") {
                    genre_Transformer = "Pop_Transformer.pth";
                } else{
                    genre_Transformer = "Classical_Transformer.pth";
                } 
                // /home/dustin/nodejs/myapp/public/musics/"+ id.toString() +"/temp_midi
                let command_model = "cd /home/dustin/tony && CUDA_VISIBLE_DEVICES=" + cuda_visible_devices.toString() + " python -m MT_multitask.generate_mt --model_path /home/Projects/viMusic/tony/stable_models/" + genre_Transformer + " --output_dir " + APP_ROOT + "/public/musics/"+ genre +"/temp_midi --num_outputs " + num_output.toString() + " --n_words 600 --config default";
                console.log ("COMMAND: ", command_model);
                    exec(command_model, (error, stdout, stderr) => {
                        if (error) {
                            res.json({
                                status: false,
                                result: error.message
                            });   
                        }
                        if (stderr) {
                            sleep(1000);
                            _midiPath = "ls " + APP_ROOT + "/public/musics/"+ genre +"/temp_midi";
                            exec(_midiPath, (error, stdout, stderr) => {
                                if (error) {
                                    res.json({
                                        status: false,
                                        result: error.message
                                    });
                                } if (stderr) {
                                    res.json({
                                        status: false,
                                        result: stderr
                                    })

                                } else {
                                    // console.log(stdout);
                                    if (stdout) {
                                        // console.log("not empty");
                                        // var _string = "MT_gfm_generate_midi_10:18:14.818605_1_noteTemp:1.0_durTemp:1.0.midi\nMT_gfm_generate_midi_10:19:24.521069_1_noteTemp:1.0_durTemp:1.0.midi\n";
                                        var _string = stdout;
                                        const arr_music = _string.split('\n');
                                        const len_array_music = arr_music.length;
                                        let command_convert = "";
                                        let link = "";
                                        for (let i = 0; i < len_array_music - 1; i++) {
                                            let element = arr_music[i];
                                            let len_element = element.length;
                                            let new_name = element.substring(0,len_element - 5) + ".mp3";
                                            link = new_name;
                                            let subCommand = "timidity " + APP_ROOT + "/public/musics/" + genre + "/temp_midi/" + element + " -Ow -o - | lame - -b 64 " + APP_ROOT + "/public/musics/" + genre + "/basic/" + new_name;
                                            console.log("subCommand: ", subCommand);
                                            if (i == 0) {
                                                command_convert += subCommand;
                                            } else {
                                                command_convert += " && " + subCommand;
                                            }
                                    }
                                    
                                    exec(command_convert, (error, stdout, stderr) => {
                                        if (error) {
                                        } if (stderr) {
                                            sleep(1000);
                                            res.json({
                                                status: true,
                                                msg: 'completed'
                                            })
                                        }
                                        });
                                    } else {
                                        res.json({
                                            status: false,
                                            msg: 'create music is failed'
                                        })
                                    }
                                }
                            })
                        }
                    })
            } else {
                res.json({
                    status: false,
                    msg: 'GPU is not found'
                });
            }
        });
    });
    app.get('/api/lyric', function(req, res) {
        if (req.query.idMusic != undefined) {
            const {idMusic} = req.query;
        var id = req.cookies['idUser'];
            if (id) {
                // return res.send({
                // 	token: token,
                // 	idUser: idUser
                // });
                console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e68828e1a301f125fb94c50";
            User.findOne({_id: id}, function (err, doc) {
                if (err) {
                    res.json({
                        status: true,
                        msg: err
                    })
                }
                if (doc) {
                    var arr = doc.listMusic;
                    lenArr = arr.length;
                    let flat = false;
                    tempData = [];
                    for (let i = 0; i < lenArr; i++) {
                        if (arr[i].idMusic == idMusic) {
                            flat = true;
                            res.json({
                                status: true,
                                msg: 'found it',
                                result: arr[i]
                            })
                        }
                    }
                    if (flat == false) {
                        res.json({
                            status: false,
                            msg: 'failed',
                            // result: tempData
                        })
                    }
                } else {
                    res.json({
                        status: false,
                        msg: 'id is not found'
                    })
                }
            });
        // res.json({
        //     status: true
        // })
        } else {
            res.json({
                status: false,
                msg: 'idMusic is undefine'
            })
        }
    });
    app.post('/api/terminal', function(req, res) {
        // console.log(req.body.music);
        // console.log(req.body.params.options);
        // console.log(req.body.params.lyric);
        var arrVerse = [];
        var arrChorus = [];
        // verse
        // console.log(req.body.params.lyricContent[1].value);
        // chorus
        // console.log(req.body.params.lyricContent[2].value);
        // arrVerse = req.body.params.lyricContent[1].value.split(",");
        // arrChorus = req.body.params.lyricContent[2].value.split(",");
        var data_lyric = {
            "verse": arrVerse,
            "chorus": arrChorus
        }
        console.log('data Lyric: ');
        console.log(data_lyric);
        //
        // var len_params_option = req.body.params.options.length;
        // for ( let i = 0; i <len_params_option; i++) {
        //     console.log(req.body.params.options[i]);
        // }
        //
        const {key, title} = req.body.music;
        const genre = req.body.params.title;
        var cuda_visible_devices = 2;
        num_output = 1;
        parameter = genre;
        likeStatus = "false";
        var listMusic = [];
        var id = req.cookies['idUser'];
            if (id) {
                // return res.send({
                // 	token: token,
                // 	idUser: idUser
                // });
                console.log("id: ", id);
            } else {
                console.log("id not found")
            }
            console.log("id: ", id);
            id = "5e68828e1a301f125fb94c50";
            /*
                    * Create .json file
                    */
                   var main = {
                    "verse": [
                        "I've been alone with you inside my mind",
                        "And in my dreams I've kissed your lips a thousand times",
                        "I sometimes see you pass outside my door",
                        "Hello, is it me you're looking for?"
                    ],
                    "chorus":
                    [
                        "Hello from the other side",
                        "I must've called a thousand times",
                        "To tell you I'm sorry for everything that I've done",
                        "But when I call you never seem to be home",
                        "Hello from the outside",
                        "At least I can say that I've tried",
                        "To tell you I'm sorry for breaking your heart",
                        "But it don't matter, it clearly doesn't tear you apart anymore"
                    ]
                    };
                    // writeFile function with filename, content and callback function
                    var link_lyric_json = APP_ROOT + "/public/musics/" + id.toString() + "/test_lyrics.json";
                    fs.writeFile(link_lyric_json, JSON.stringify(main) , function (err) {
                        if (err) throw err;
                        console.log('File is created successfully.');
                    });
                    /*
                    * end create .json file
                    */
            var process = spawn('python',["./python/gpu.py"]);
            process.stdout.on('data', function(data) {
            /*
            * When found GPU
            */
            if (data.toString() != "null\n") {
            let len = data.toString().length;
            cuda_visible_devices = Number(data.toString().substring(1,2));
            console.log("CUDA: ", cuda_visible_devices);
            // id = "5e7d9bbc2fb3ca5c43912083";
            User.findOne({_id: id}, function (err, doc) {
                if (doc) {
                let pathMusicFolder = './public/musics/';
                // Create folder music
                var dir = pathMusicFolder + id.toString();
                
                let link_remove ="rm -r " + pathMusicFolder + id.toString() + '/temp_midi/';
                exec(link_remove, (error, stdout, stderr) => {
                    if (error) {
                        res.json({
                            status : false,
                            msg : 'remove file is error'
                        });
                    } if (stderr) {
                        res.json({
                            status : false,
                            msg : 'remove file is error'
                        });
                    } else {
                    }
                });
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                var dir = pathMusicFolder + id.toString() + '/temp_midi';

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                // end create
                // Rock_Transformer.pth
                // Pop_Transformer.pth
                // Classical_Transformer.pth
                let genre_Transformer = "";
                console.log("GENRE: ", genre);
                if (genre == "Rock") {
                    genre_Transformer = "Rock_Transformer.pth";
                } else if (genre == "Pop") {
                    genre_Transformer = "Pop_Transformer.pth";
                } else{
                    genre_Transformer = "Classical_Transformer.pth";
                };
                // /home/dustin/nodejs/myapp/public/musics/"+ id.toString() +"/temp_midi;
                // let command_model = "cd /home/dustin/AIrepo && CUDA_VISIBLE_DEVICES=" + cuda_visible_devices.toString() + " python -m music_transformer.generate_server --model_path /home/Projects/viMusic/tony/stable_models/" + genre_Transformer + " --output_dir " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi --num_outputs " + num_output.toString() + " --n_words 400 --primer_path /home/Projects/viMusic/tony/unprocessed_data/maestro-v2.0.0/2018 --lyrics_path /home/dustin/AIrepo/test_lyrics.json";
                let command_model = "cd /home/dustin/tony && CUDA_VISIBLE_DEVICES=" + cuda_visible_devices.toString() + " python -m MT_multitask.generate_mt --model_path /home/Projects/viMusic/tony/stable_models/" + genre_Transformer + " --output_dir " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi --num_outputs " + num_output.toString() + " --n_words 600 --config default";
                console.log ("COMMAND: ", command_model);
                    exec(command_model, (error, stdout, stderr) => {
                        if (error) {
                            res.json({
                                status: false,
                                result: error.message
                            });   
                        }
                        if (stderr) {
                            sleep(1000);
                            _midiPath = "ls " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi";
                            exec(_midiPath, (error, stdout, stderr) => {
                                if (error) {
                                    res.json({
                                        status: false,
                                        result: error.message
                                    });
                                } if (stderr) {
                                    res.json({
                                        status: false,
                                        result: stderr
                                    })

                                } else {
                                    // console.log(stdout);
                                    if (stdout) {
                                        // console.log("not empty");
                                        // var _string = "MT_gfm_generate_midi_10:18:14.818605_1_noteTemp:1.0_durTemp:1.0.midi\nMT_gfm_generate_midi_10:19:24.521069_1_noteTemp:1.0_durTemp:1.0.midi\n";
                                        var _string = stdout;
                                        const arr_music = _string.split('\n');
                                        const len_array_music = arr_music.length;
                                        let command_convert = "";
                                        let link = "";
                                        for (let i = 0; i < len_array_music - 1; i++) {
                                            let element = arr_music[i];
                                            let len_element = element.length;
                                            let new_name = element.substring(0,len_element - 5) + ".mp3";
                                            link = new_name;
                                            let subCommand = "timidity "+ APP_ROOT + "/public/musics/" + id.toString() + "/temp_midi/" + element + " -Ow -o - | lame - -b 64 " + APP_ROOT + "/public/musics/" + new_name;
                                            console.log("subCommand: ", subCommand);
                                            if (i == 0) {
                                                command_convert += subCommand;
                                            } else {
                                                command_convert += " && " + subCommand;
                                            }
                                    }
                                    
                                    exec(command_convert, (error, stdout, stderr) => {
                                        if (error) {
                                            //  res.json({error: error});
                                        } if (stderr) {
                                            sleep(1000);
                                            /*
                                            * GET DURATION OF FILE
                                            */
                                            var _duration = 0;
                                            var mp3Duration = require('mp3-duration');
            
                                            mp3Duration(APP_ROOT + '/public/musics/' + link, function (err, duration) {
                                            if (err) return console.log(err.message);
                                            _duration = duration;
                                            console.log({result: 'Your file is ' + duration + ' seconds long'});
                                            data = {
                                                idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                                                key: key,
                                                title: title,
                                                // duration: Math.floor(Math.random() * 1000),
                                                duration: _duration,
                                                parameter: parameter,
                                                createDate: new Date(),
                                                likeStatus: "false",
                                                link: link,
                                                lyric: main
                                                };
                                                var arr = doc.listMusic;
                                                arr.push(data);
                                                doc.listMusic = [];
                                                doc.listMusic = arr;
                                                doc.save();
                                                listMusic.push(data);
                                                res.json({
                                                    status: true,
                                                    result: listMusic
                                                })
                                        });
                                            //  res.json({stderr: stderr});
                                        }
                                        });
                                    } else {
                                        res.json({
                                            status: false,
                                            msg: 'create music is failed'
                                        })
                                    }
                                }
                            })
                        }
                    })
            
                } else {
                    
                    res.json({
                        status: false,
                        result:'id is not found'
                    });
                }
            });
            } else {
                /*
                * Queue Request
                */

               /*
               * End queue request
               */
                // sleep(3000);
                var link_genre = APP_ROOT + "/public/musics/" + genre + "/basic";
                var link_destination = APP_ROOT + "/public/musics/";
                console.log(link_genre);
                exec("ls " + link_genre, (error, stdout, stderr) => {
                    if (error) {
                        res.json({
                            status: false,
                            result: error.message
                        });
                    } if (stderr) {
                        res.json({
                            status: false,
                            result: stderr
                        })
            
                    } else {
                        // console.log(stdout);
                        if (stdout) {
                            var _string = stdout;
                            const arr_music = _string.split('\n');
                            let num_music = getRandomInt(arr_music.length);
                            /*
                            * COMAND COPY FILE
                            */
                            let command_copy_file = "cp " + link_genre + "/" + arr_music[num_music] + " " + link_destination;
                            console.log (command_copy_file);
                            exec(command_copy_file, (error, stdout, stderr) => {});
                            console.log(key + " " + title + " " + parameter);
                            var link = arr_music[num_music];
                            User.findOne({_id: id}, function (err, doc) {
                                if (err) {
                                    console.log('error')
                                }
                                if (doc) {
                                    sleep(1000);
                                    /*
                                    * GET DURATION OF FILE
                                    */
                                    var _duration = 0;
                                    var mp3Duration = require('mp3-duration');
            
                                    mp3Duration(APP_ROOT + '/public/musics/' + link, function (err, duration) {
                                    if (err) return console.log(err.message);
                                    _duration = duration;
                                    console.log({result: 'Your file is ' + duration + ' seconds long'});
                                    data = {
                                        idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
                                        key: key,
                                        title: title,
                                        // duration: Math.floor(Math.random() * 1000),
                                        duration: _duration,
                                        parameter: parameter,
                                        createDate: new Date(),
                                        likeStatus: "false",
                                        link: link
                                        };
                                        var arr = doc.listMusic;
                                        arr.push(data);
                                        doc.listMusic = [];
                                        doc.listMusic = arr;
                                        doc.save();
                                        listMusic.push(data);
                                        res.json({
                                            status: true,
                                            result: listMusic
                                        });
                                   
                                })
                            }
                                else{
                                    console.log('not found')
                                }
                            });
                        }
                    }
                });
                // res.json({
                //     status: false,
                //     msg: 'GPU is not found'
                // })
            }
        });
    });
    app.delete('/api/music/delete', function(req, res) {
        // listMusic
        if (req.query.idMusic != undefined) {
            const {idMusic} = req.query;
            var id = req.cookies['idUser'];
		if (id) {
			// return res.send({
			// 	token: token,
			// 	idUser: idUser
            // });
            console.log("id: ", id);
		} else {
            console.log("id not found")
        }
        id = "5e68828e1a301f125fb94c50"
            // id = "5e68828e1a301f125fb94c50";
            // const id = req.params.id;
            User.findOne({_id: id}, function (err, doc) {
                if (err) {
                    res.json({
                        status: false,
                        msg: 'error'
                    })
                }
                if (doc) {
                    var arr = doc.listMusic;
                    lenArr = arr.length;
                    let flat = false;
                    tempData = [];
                    for (let i = 0; i < lenArr; i++) {
                        if (arr[i].idMusic == idMusic) {
                            flat = true;
                        } else {
                            tempData.push(arr[i]);
                        }
                    }
                    if (flat == true) {
                        doc.listMusic = [];
                        doc.listMusic = tempData;
                        doc.save();
                        res.json({
                            status: true,
                            msg: 'remove is successful',
                            // result: tempData
                        })
                    } else {
                        res.json({
                            status: false,
                            msg: 'please check idMusic'
                        })
                    }
                   
                } else {
                    res.json({
                        status: false,
                        result:'id is not found'
                    });
            }
            });
        } else {
            res.json({
                status: false,
                msg: 'idMusic is undefine'
            })
        }
    });
}
var User = require('../models/user');
var Queue = require('../models/queue');
var fs = require('fs');
const { exec } = require("child_process");
const system = require('system-commands')
var spawn = require("child_process").spawn;
// const CircularJSON = require('circular-json');
var APP_ROOT = "/home/dustin/nodejs/vimusic";
var arrRequest;
var arrResponse;
var lisResponse;
var listGPU;
// var cache = require('memory-cache');
var Request = require("request");
// cache.put('foo', []);
function dropElementFromArray (value, arr) {
    let array_gpu = arr.filter(item => item !== value);
    return array_gpu;
}
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
        // id = "5e68828e1a301f125fb94c50";
        id = "5e7d9bea2fb3ca5c43912084"
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
                    msg:'id is not found'
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
    });
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
        id = "5e7d9bea2fb3ca5c43912084";
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
    app.get('/api/getnumfileinfolder', function (req, res) {
        // res.json({
        //     status: true
        // })
        // const {genre, maxnum} = req.body;
        genre = 'Pop';
        const _path_genre_basic = "ls " + APP_ROOT + "/public/musics/" + genre + '/basic/';
        console.log(_path_genre_basic);
        exec(_path_genre_basic, (error, stdout, stderr) => {
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
                    let num_file_in_genre_basic = arr_music.length;
                    // console.log('')
                    res.json({
                        status: true,
                        num: num_file_in_genre_basic -1
                    });
                }
            }
        });
    });
    app.post('/api/precreatemusic', function (req, res) {
        const {genre, maxnum} = req.body;
        num_output = 1;

        /*
        * CHECK MAX NUM
        */
    //    const _path_genre_basic = "ls " + APP_ROOT + "/public/musics/" + genre + '/basic/';
    //    exec(_path_genre_basic, (error, stdout, stderr) => {
    //     if (error) {
    //         res.json({
    //             status: false,
    //             result: error.message
    //         });
    //     } if (stderr) {
    //         res.json({
    //             status: false,
    //             result: stderr
    //         })

    //     } else {
    //         if (stdout) {
    //             var _string = stdout;
    //             const arr_music = _string.split('\n');
    //             let num_file_in_genre_basic = arr_music.length;
    //             if (arr_music.length -1 <)
                
    //         }
    //     }
    // });
            /*
            * CHECK GPU
            */
           Request.get("https://viws.ddns.net/predictor/admin/api/gpu", (err, resapi, body) => {
            if (err) {
                console.log('error');
            }
                let cuda_visible_devices = -1;
                cuda_visible_devices = Number(resapi.body);
                console.log(cuda_visible_devices);
                // if gpu is not found
                if (cuda_visible_devices == -1) {
                    // add request to queue
                    // return (waiting)
                    res.json({
                        msg: 'GPU is not found'
                    });
                //if gpu is enable
                } else {
                    // execute command from first of queue
                    // cuda_visible_devices = Number(data.toString().substring(1,2));
                    console.log("CUDA: ", cuda_visible_devices);
                    let pathMusicFolder = './public/musics/' + genre;
                    let link_remove ="rm -v " + pathMusicFolder + '/temp_midi/*';
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
                                dropElementFromArray(cuda_visible_devices, listGPU);
                                res.json({
                                    status: false,
                                    result: error.message
                                });   
                            }
                            if (stderr) {
                                listGPU = dropElementFromArray(cuda_visible_devices, listGPU);
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
                                                    msg: 'completed',
                                                    genre: genre
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
            // id = "5e68828e1a301f125fb94c50";
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
    app.get('/pushlistgpu', (req, res) => {
        res.json({
            list: listGPU
        })
    });
    /*
    * return enable GPU of server
    */
    app.get('/api/gpu', function (req, res) {
        if (listGPU == undefined) {
            listGPU = [];
        }
        var num = -1;
        sleep(1000);
        var process = spawn('python',["./python/gpu.py"]);
        process.stdout.on('data', function(data) {
            
            // if gpu is not using
            if (data.toString() != 'null\n'){
                  let cuda_visible_devices = data.toString().substring(1,2);
                res.send(cuda_visible_devices);
              
                // // check gpu is using
                // let result = true;
                // result = listGPU.includes(Number(cuda_visible_devices));
                // if (result == true) {
                //     res.send(num.toString());
                // } else {
                //     // list gpu is using
                //     listGPU.push(Number(cuda_visible_devices));
                //     console.log(listGPU);
                //     res.send(cuda_visible_devices);
                // }
                // // result = listGPU.includes(gpu);
            } else {
                res.send(num.toString());
            }
        })
    });
    app.post('/api/terminal/v1', function (req, res){
        /*
        * CHECK LYRIC
        */
        var lyric = true;
        // if lyric is disable
        if (lyric == false) {
            // choose music from precreate music repository
        //if lyric is enable
        } else {
            /*
            * CHECK GPU
            */
            Request.get("https://viws.ddns.net/predictor/admin/api/gpu", (err, resapi, body) => {
                if (err) {
                    console.log('error');
                }
                    var cuda_visible_devices = Number(resapi.body);
                    console.log(cuda_visible_devices);
                    // if gpu is not found
                    if (cuda_visible_devices == -1) {
                        // add request to queue
                        // return (waiting)
                        res.json({
                            msg: 'GPU is not found'
                        });
                    //if gpu is enable
                    } else {
                        // execute command from first of queue
                        res.json({
                            msg: 'show GPU',
                            gpu: cuda_visible_devices
                        });
                    }
                });
        }
        /*
        * run check GPU each second run (automation)
        */
       /*
       * run add music to command
       */
    });
    app.post('/api/terminal', function(req, res) {
        // console.log(req.body.music);
        // console.log(req.body.params.options);
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
        let pathMusicFolder = './public/musics/';
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
            id = "5e7d9bea2fb3ca5c43912084";


        // Create folder music
        var dir = pathMusicFolder + id.toString();
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        var dir = pathMusicFolder + id.toString() + '/temp_midi';

        var {lyricContent} = req.body.params;
        if (lyricContent.length == 0) {
            console.log('not lyric')
        } else {
            console.log(req.body.params.lyricContent);
            var arrVerse = [
                        "No no",
                        "No No No No",
                        "No no",
                        "No No No No"];
            var arrChorus = [
                        "No no",
                        "No No No No",
                        "No no",
                        "No No No No"
            ];
            // verse
            // console.log(req.body.params.lyricContent[1].value);
            // chorus
            // console.log(req.body.params.lyricContent[2].value);

            // CHECK EXIST ,
            var _string_lyricContent = req.body.params.lyricContent[1].value;
            if (_string_lyricContent.includes(',')) {
                var tempVerse = req.body.params.lyricContent[1].value.split(",");
                var len_temVerse = tempVerse.length
                if (len_temVerse > 4) {
                    len_temVerse = 4;
                }
                for (let i = 0; i < len_temVerse; i++) {
                    arrVerse[i] = tempVerse[i];
                }
            } else {
                arrVerse[0] = _string_lyricContent;
            }
            _string_lyricContent = '';
            // CHECK EXIST ,
            _string_lyricContent = tempChorus = req.body.params.lyricContent[2].value;
            if (_string_lyricContent.includes(',')) {
                var tempChorus = req.body.params.lyricContent[2].value.split(",");
                var len_temChorus = tempChorus;
                if (len_temChorus > 4) {
                    len_temChorus = 4;
                }
                for (let i = 0; i < len_temChorus; i++) {
                    arrChorus[i] = tempChorus[i];
                }
            } else {
                arrChorus[0] = _string_lyricContent;
            }
            var data_lyric = {
                "verse": arrVerse,
                "chorus": arrChorus
            }
            console.log('data Lyric: ');
            console.log(data_lyric);
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
                    // var link_lyric_json = "home/dustin/nodejs/vimusic/public/musics/" + id.toString() + "/test_lyrics.json";
                    // fs.writeFile(link_lyric_json, JSON.stringify(main) , function (err) {
                    //     if (err) throw err;
                    //     console.log('File is created successfully.');
                    // });
                    /*
                    * end create .json file
                    */
            };
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
                let link_remove ="rm -v " + pathMusicFolder + id.toString() + '/temp_midi/*';
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

                let command_model = "cd /home/dustin/AIrepo && CUDA_VISIBLE_DEVICES=" + cuda_visible_devices.toString() + " python -m music_transformer.generate_server --model_path /home/Projects/viMusic/tony/stable_models/" + genre_Transformer + " --output_dir " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi --num_outputs " + num_output.toString() + " --n_words 400 --primer_path /home/Projects/viMusic/tony/unprocessed_data/maestro-v2.0.0/2018 --lyrics_path /home/dustin/AIrepo/test_lyrics.json";
                if (lyricContent.length == 0) {
                    command_model = "cd /home/dustin/tony && CUDA_VISIBLE_DEVICES=" + cuda_visible_devices.toString() + " python -m MT_multitask.generate_mt --model_path /home/Projects/viMusic/tony/stable_models/" + genre_Transformer + " --output_dir " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi --num_outputs " + num_output.toString() + " --n_words 600 --config default";
                };
                console.log ("COMMAND: ", command_model);
                    exec(command_model, (error, stdout, stderr) => {
                        if (error) {
                            res.json({
                                status: false,
                                result: error.message
                            });   
                        }
                        else if (stderr) {
                            sleep(1000);
                            _midiPath = "ls " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi";
                            exec(_midiPath, (error, stdout, stderr) => {
                                if (error) {
                                    res.json({
                                        status: false,
                                        result: error.message
                                    });
                                   
                                } if (stderr) {
                                    console.log('command stderr:');
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
                            });
                        } else {
                            // -----------------------------------------------------------------
                            console.log('USing When Create music use Lyric');
                            sleep(1000);
                            _midiPath = "ls " + APP_ROOT + "/public/musics/"+ id.toString() +"/temp_midi";
                            exec(_midiPath, (error, stdout, stderr) => {
                                if (error) {
                                    res.json({
                                        status: false,
                                        result: error.message
                                    });
                                   
                                } if (stderr) {
                                    console.log('command stderr:');
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
                            });
                            // ------------------------------------------------
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
        // id = "5e68828e1a301f125fb94c50"
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
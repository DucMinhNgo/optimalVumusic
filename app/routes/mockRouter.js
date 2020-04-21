

var User = require('../models/user');
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
        fs.writeFile(APP_ROOT + "/public/musics/5e68828e1a301f125fb94c50" + "/temp_midi/test_lyrics.json", JSON.stringify(main), function (err) {
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
    app.get('/gettimeout', (req, res) => {
        // res.json()
    });
    app.get('/indexajax', (req, res) => res.render('testajax'));
    app.get('/api/command', function (req, res) {
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
            let new_name = element.substring(0, len_element - 5) + ".mp3";
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

                res.send({ result: command_convert });

                //  res.json({stderr: stderr});
            } else {
                //  res.json({stdout: stdout});
            }
        });
    });
    app.get('/getduration', (req, res) => {
        var mp3Duration = require('mp3-duration');
        mp3Duration('home/dustin/nodejs/vimusicpublic/musics/5e68828e1a301f125fb94c50/temp_midi/MT_gfm_generate_midi_03:26:31.831210_1_noteTemp:1.0_durTemp:1.0.midi', function (err, duration) {
            if (err) return console.log(err.message);
            res.json({ result: 'Your file is ' + duration + ' seconds long' });
        });

    });
    app.get('/deleteuser/', function (req, res, next) {
        var { email } = req.query;
        User.remove({ email: email }, function (err, doc) {
            if (err) {
                res.json({
                    status: false,
                    msg: 'error'
                })
            }
            if (doc) {
                res.json({
                    status: true,
                    result: 'complete'
                })
            } else {
                res.json({
                    status: true,
                    result: 'email is not exists'
                });
            }
        });
    });
    app.put('/api/reboot/:id', function (req, res) {
        // listMusic
        const id = req.params.id;
        arr = [{
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 1,
            title: "0AuraLee2",
            duration: 97,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "0AuraLee2.mp3"
        },
        {
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 2,
            title: "1",
            duration: 444,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "1.mp3"
        },
        {
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 3,
            title: "2",
            duration: 232,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "2.mp3"
        },
        {
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 4,
            title: "4",
            duration: 789,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "4.mp3"
        },
        {
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 5,
            title: "6",
            duration: 162,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "6.mp3"
        },
        {
            idMusic: (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2),
            key: 6,
            title: "MT_gfm_generate_midi_06:16:19.485630_1_noteTemp:1.0_durTemp:1.0.",
            duration: 34,
            parameter: "Fantasy, F minor, Dragonborn Ensemble, 80 BPM, 4/4",
            createDate: new Date(),
            likeStatus: 'false',
            link: "MT_gfm_generate_midi_06:16:19.485630_1_noteTemp:1.0_durTemp:1.0..mp3"
        }]
        arr = [];
        User.findOne({ _id: id }, function (err, doc) {
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
                    result: 'id is not found'
                });
            }
        });
    });
}
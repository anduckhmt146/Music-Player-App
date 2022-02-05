/* Some tasks in my products: 
    1. Render browers
    2. Scrolling browsers
    3. Play song when click
    4. Rotate disk when playing song
    5. Allow play, pause, seek and count up time when playing song
    6. Volume change
    7. Next/Prev button
    8. Random/Repeat button
    8. Next/Repeat when ended song
    9. Active playing song
    10. Scroll active song into view
    11. LocalStorage your last use.
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const rotateCD = $('.music__cd').animate([
    {transform: 'rotate(360deg)'}
], {
    duration: 10000,
    iterations: Infinity,
});
var randomList = [];
rotateCD.pause();
const PLAYER_STORAGE_KEY = 'PLAYER_STORAGE';
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {"currentIndex":"0","isRepeat":"false","isRandom":"false"},
    songs: 
    [
        { 
            id: '1',
            name: 'Closer',
            singer: 'Halsey, The Chainsmokers',
            audio: '../assets/music/song1.mp3',
            image: '../assets/img/song1.jpg',
        },
        { 
            id: '2',
            name: 'Something Just Like This',
            singer: 'Coldplay, The Chainsmokers',
            audio: '../assets/music/song2.mp3',
            image: '../assets/img/song2.jpg',
        },
        { 
            id: '3',
            name: 'Magic',
            singer: 'Rina Aiuchi',
            audio: '../assets/music/song3.mp3',
            image: '../assets/img/song3.jpg',
        },
        { 
            id: '4',
            name: 'Catch The Moment',
            singer: 'Lisa',
            audio: '../assets/music/song4.mp3',
            image: '../assets/img/song4.jpg',
        },
        { 
            id: '5',
            name: 'So Far Away',
            singer: 'David Guetta, Martin Garrix',
            audio: '../assets/music/song5.mp3',
            image: '../assets/img/song5.jpg',
        },
        { 
            id: '6',
            name: 'Stay',
            singer: 'The Kid LAROI, Justin Bieber',
            audio: '../assets/music/song6.mp3',
            image: '../assets/img/song6.jpg',
        },
        { 
            id: '7',
            name: 'Easy On Me',
            singer: 'Adele',
            audio: '../assets/music/song7.mp3',
            image: '../assets/img/song7.jpg',
        },
        { 
            id: '8',
            name: 'Shape Of You',
            singer: 'Ed Sheeran',
            audio: '../assets/music/song8.mp3',
            image: '../assets/img/song8.jpg',
        },
        { 
            id: '9',
            name: 'The Nights',
            singer: 'Avicii',
            audio: '../assets/music/song9.mp3',
            image: '../assets/img/song9.jpg',
        },
        { 
            id: '10',
            name: 'Có hẹn với thanh xuân',
            singer: 'MONSTAR',
            audio: '../assets/music/song10.mp3',
            image: '../assets/img/song10.jpg',
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        var htmls = this.songs.map(song => {
            return `
                <div class="music__song" id="${song.id}">
                    <div class="music__body">
                        <div class="music__icon" style="background-image: url(${song.image});"></div>
                        <div class="music__info">
                            <h4>${song.name}</h4>
                            <p>${song.singer}</p>
                        </div>
                    </div>
                    <div class="option">
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
            </div>
            `
        });
        $('.music__playlist').innerHTML = htmls.join('');
        $('.music__song').classList.add('active');
        $('.music__song .fa-heart').classList.add('actived');
        $('.music__song:nth-child(2) .fa-heart').classList.add('actived');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    zoomCD: function() {
        var newScrollWidth = 200 - window.scrollY;
        var currScrollWidth = (newScrollWidth < 0) ? 0 : newScrollWidth;
        $('.music__cd').style.width = currScrollWidth + 'px';
        $('.music__cd').style.height= currScrollWidth + 'px';
        $('.music__cd').style.opacity = currScrollWidth / 200;
    },
    clickSong: function() {
        $('.music__playlist').onclick = function(e) {
            if(e.target.closest('.option')) {
                e.target.classList.toggle('actived');
            }
            else {
                const songNode = e.target.closest('.music__song');
                app.currentIndex = songNode.id - 1;
                app.loadCurrentSong();
                $('#audio').play();
            }
            app.setConfig('currentIndex', app.currentIndex);
        }
    },
    scrolling: function() {
        document.onscroll = function() {
            $$('.music__song').forEach(function(song) {
                song.style.opacity = (window.scrollY >= song.offsetTop + 300) ? 0 : 1;
            });
            app.zoomCD();
        }
    },
    controlBtn: function() {
        $('.icon-play').onclick = function() {
            if(!app.isPlaying) $('#audio').play();
            else $('#audio').pause();
            app.isPlaying = ! app.isPlaying;
        }
    },
    getRandomIndex: function() {
        var randomIndex = Math.floor(Math.random() * 10);
        while (randomIndex == app.currentIndex || randomList.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * 10);
        }
        randomList.push(randomIndex);
        if(randomList.length == 5) randomList = [];
        return randomIndex;
    },
    playingAudio: function() {
        $('#audio').onplay = function() {
            $('.icon-play').classList.remove('fa-play');
            $('.icon-play').classList.add('fa-pause');
            rotateCD.play();
        }
        $('#audio').ontimeupdate = function() {
            if($('#audio').currentTime == 0) return;
            let totalTime = Math.floor($('#audio').duration);
            let currentTime = Math.floor($('#audio').currentTime);
            let getTotalTime = app.formatTime(totalTime);
            $('.minutes').innerHTML = getTotalTime.minutes;
            $('.seconds').innerHTML = getTotalTime.seconds;
            let getCurrentTime = app.formatTime(currentTime);
            $('.counter__minutes').innerHTML =  getCurrentTime.minutes;
            $('.counter__seconds').innerHTML =  getCurrentTime.seconds;
            var newSize = `${currentTime * 100 / totalTime}`;
            $('.progress').value = isNaN(newSize) ? 0 : newSize;
        }
        $('#audio').onended = function() {
            if(app.isRandom) app.currentIndex = app.getRandomIndex();
            else if(app.isRepeat) app.currentIndex = app.currentIndex;
            else app.currentIndex++;
            app.loadCurrentSong();
            $('#audio').play();
        }
    },
    pausingAudio: function() {
        $('#audio').onpause = function() {
            $('.icon-play').classList.add('fa-play');
            $('.icon-play').classList.remove('fa-pause');
            rotateCD.pause();
        }
    },
    seekingProgress: function() {
        $('.progress').onchange = function(e) {
            let duration = Math.floor($('#audio').duration);
            $('#audio').currentTime =  e.target.value * duration / 100;
        }
    },
    changeVolume: function() {
        $('#volume').oninput = function() {
            $('#audio').volume = $('#volume').value * 1 / 100;
            if($('#volume').value > 0 && $('#volume').value < 50) {
                $('.speaker').classList.remove('fa-volume-up');
                $('.speaker').classList.remove('fa-volume-mute');
                $('.speaker').classList.add('fa-volume-down');
            }
            else if( $('#volume').value == 0) {
                $('.speaker').classList.remove('fa-volume-down');
                $('.speaker').classList.add('fa-volume-mute');
            }
            else {
                $('.speaker').classList.remove('fa-volume-down');
                $('.speaker').classList.add('fa-volume-up');
            }
        }
    },
    formatTime: function(duration) {
        var minutes = Math.floor(duration / 60);
        var seconds = duration - 60 * minutes;
        minutes = (minutes.toString().length == 1 ? "0" + minutes.toString() : minutes.toString());
        seconds = (seconds.toString().length == 1 ? "0" + seconds.toString() : seconds.toString());
        return {minutes, seconds};
    },
    loadCurrentSong : function() {
        $('.music__header h2').innerHTML = this.currentSong.name;
        $('.music__header p').innerHTML = this.currentSong.singer;
        $('.music__cd').style.backgroundImage = `url(${this.currentSong.image})`;
        $('#audio').src = this.currentSong.audio;
        $('.music__playlist .active').classList.toggle('active');
        $(`.music__song:nth-child(${app.currentIndex + 1})`).classList.toggle('active');
        app.scrollToActiveSong();
        rotateCD.cancel();
    },
    nextBtn: function() {
        $('.fa-step-forward').onclick = function() {
            if(app.isRandom) app.currentIndex = app.getRandomIndex();
            else if(app.isRepeat) app.currentIndex = app.currentIndex;
            else app.currentIndex++;
            app.currentIndex = app.currentIndex % app.songs.length;
            app.loadCurrentSong();
            $('#audio').play();
            app.setConfig('currentIndex', app.currentIndex);
        }
    },
    prevBtn: function() {
        $('.fa-step-backward').onclick = function() {
            if(app.isRandom) app.currentIndex = app.getRandomIndex();
            else if(app.isRepeat) app.currentIndex = app.currentIndex;
            else app.currentIndex--;
            app.currentIndex =  (app.currentIndex + app.songs.length) % app.songs.length;
            app.loadCurrentSong();
            $('#audio').play();
            app.setConfig('currentIndex', app.currentIndex);
        }
    },
    randomBtn: function() {
        $('.fa-random').onclick = function() {
            this.classList.toggle('active');
            app.isRandom = !app.isRandom;
            if(app.isRandom && app.isRepeat) {
                $('.fa-redo').click();
            }
            app.setConfig('isRandom', app.isRandom);
        }
    },
    replayBtn: function() {
        $('.fa-redo').onclick = function() {
            this.classList.toggle('active');
            app.isRepeat = !app.isRepeat;
            if(app.isRandom && app.isRepeat) {
                $('.fa-random').click();
            }
            app.setConfig('isRepeat', app.isRepeat);
        }
    },
    scrollToActiveSong: function() {
        $('.music__playlist .active').scrollIntoView(
            {behavior: 'smooth', block: "center"}
        );
    },
    handleEvent: function() {
        // Scrolling browsers
        this.scrolling();
        // Active play-button
        this.controlBtn();
        // Playing audio
        this.playingAudio();
        // Pausing audio
        this.pausingAudio();
        // Seeking audio
        this.seekingProgress();
        //Change Volume
        this.changeVolume();
    },
    loadConfig: function() {
        this.currentIndex = this.config.currentIndex;
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        if(this.isRandom) $('.fa-random').classList.toggle('active');
        if(this.isRepeat) $('.fa-redo').classList.toggle('active');
    },
    start: function() {
        //Load config từ localStorage
        this.loadConfig();
        // Define properties for object app
        this.defineProperties();
        // Render browser
        this.render();
        // Load current song
        this.loadCurrentSong();
        //Next button
        this.nextBtn();
        // Prev button
        this.prevBtn();
        // Click song
        this.clickSong();
        // Random button
        this.randomBtn();
        // Replay button
        this.replayBtn();
        // Handle events
        this.handleEvent();
    }
}
app.start();
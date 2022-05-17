const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const playList = $('.playlist')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Aichungtinhduocmai",
            singer: "DungHoangPham",
            path: "./assets/music/1_aichungtinhduocmai.mp3",
            image: "./assets/img/1.jpg"
        },
        {
            name: "Aino",
            singer: "Masew",
            path: "./assets/music/2_aino.mp3",
            image: "./assets/img/2.jpg"
        },
        {
            name: "Cauhencauthe",
            singer: "ThuongVo",
            path: "./assets/music/3_cauhencauthe.mp3",
            image: "./assets/img/3.jpg"
        },
        {
            name: "Changnoinenloi",
            singer: "HoangDung",
            path: "./assets/music/4_changnoinenloi.mp3",
            image: "./assets/img/4.jpg"
        },
        {
            name: "Chuyenmua",
            singer: "TrungQuan",
            path: "./assets/music/5_chuyenmua.mp3",
            image: "./assets/img/5.jpg"
        },
        {
            name: "Cogiangtinh",
            singer: "X2X",
            path: "./assets/music/6_cogiangtinh.mp3",
            image: "./assets/img/6.jpg"
        },
        {
            name: "Dedendedi",
            singer: "QuangHung",
            path: "./assets/music/7_dedendedi.mp3",
            image: "./assets/img/7.jpg"
        },
        {
            name: "Hoanokhongmau",
            singer: "DungHoangPham",
            path: "./assets/music/8_hoanokhongmau.mp3",
            image: "./assets/img/8.jpg"
        },
        {
            name: "Noaidoloixinloi",
            singer: "Bozzit",
            path: "./assets/music/9_noaidoloixinloi.mp3",
            image: "./assets/img/9.jpg"
        },
        {
            name: "tungthuong",
            singer: "DinhDung",
            path: "./assets/music/10_tungthuong.mp3",
            image: "./assets/img/10.jpg"
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= ${index}>
                <div class="thumb"
                    style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this
        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xử lý khi CD quay 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //Xử lý khi click Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi song play
        audio.onplay = function () {
            player.classList.add('playing')
            _this.isPlaying = true
            cdThumbAnimate.play()
        }
        //Khi song pause 
        audio.onpause = function () {
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // Khi next Song 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi prev Song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xử lý bật/tắt Song Random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lý repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xử lý khi ended song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //Lắng nghe click vào playList
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lí khi click vào option
            }
        }
    },
    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        if (this.currentIndex === 0) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                })
            }, 300)
        } else if (this.currentIndex === 4 || this.currentIndex === 2) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }, 300)
        } else if ((this.currentIndex <= 4 ) && this.isRandom) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }, 300)
        }
        else {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }, 300)
        }

    },
    start: function () {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe, xử lý các sự kiện
        this.handleEvent()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}
app.start()
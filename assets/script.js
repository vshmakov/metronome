function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

new class {
    soundsCount = 5
    soundSelect = document.getElementById('sound')
    playButton = document.getElementById('play')
    playId = 0
    timesSpan = document.getElementById('times')
    timesPerMinute = 90
    audios = {}

    constructor() {
        [-5, -10, 5, 10]
            .forEach((delta) => this.configureChangeButtons(delta))
        this.changeTimesPerMinute(0)

        let options = ''

        for (let i = 1; i <= this.soundsCount; i++) {
            const path = `assets/audio/${i}.mp3`
            options += `<option value="${path}">Sound #${i}</option>`
            this.audios[path] = this.downloadAudio(path)
        }

        this.soundSelect.innerHTML = options
        this.playButton.onclick = () => this.clickPlayButtonHandler()
        this.setPlayButtonName()
    }

    configureChangeButtons(delta) {
        const button = document.createElement('button')
        const sign = delta > 0 ? '+' : ''
        button.innerHTML = sign + delta
        button.onclick = () => this.changeTimesPerMinute(delta)
        const parent = this.timesSpan.parentNode;

        if (delta < 0) {
            parent.prepend(button)
        } else {
            parent.append(button)
        }
    }

    changeTimesPerMinute(delta) {
        this.timesPerMinute = this.timesPerMinute + delta
        this.timesSpan.innerHTML = this.timesPerMinute
    }

    clickPlayButtonHandler() {
        this.playId++
        this.setPlayButtonName()

        if (this.isPlaying) {
            this.runMetronome()
        }
    }

    get isPlaying() {
        return 1 === this.playId % 2
    }

    setPlayButtonName() {
        this.playButton.innerHTML = !this.isPlaying ? 'Play' : 'Pause'
    }

    async runMetronome() {
        const playId = this.playId

        while (playId === this.playId) {
            this.playSound(this.soundSelect.value)
            await sleep(60 / this.timesPerMinute * 1000)
        }
    }

    playSound(path) {
        this.audios[path].play()
    }

    downloadAudio(path) {
        const audio = document.createElement('audio')
        audio.src = path

        return audio
    }
}

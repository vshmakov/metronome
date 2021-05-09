function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

new class {
    soundsCount = 6
    soundSelect = document.getElementById('sound')
    playButton = document.getElementById('play')
    isPlaying = false
    sound
    downButton = document.getElementById('down')
    upButton = document.getElementById('up')
    timesSpan = document.getElementById('times')
    timesPerMinute = 60


    constructor() {
        [-5, -10, 5, 10]
            .forEach((delta) => this.configureChangeButtons(delta))
        this.changeTimesPerMinute(0)

        let options = ''

        for (let i = 1; i <= this.soundsCount; i++) {
            options += `<option value="audio/${i}.mp3">Sound #${i}</option>`
        }

        this.soundSelect.innerHTML = options
        this.soundSelect.onkeyup = () => this.keyupSoundSelectHandler()
        this.keyupSoundSelectHandler()
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

    keyupSoundSelectHandler() {
        this.sound = this.soundSelect.value
    }

    clickPlayButtonHandler() {
        if (this.isPlaying) {
            this.isPlaying = false
            this.setPlayButtonName()

            return
        }

        this.isPlaying = true
        this.setPlayButtonName()
        this.runMetronome()
    }

    setPlayButtonName() {
        this.playButton.innerHTML = !this.isPlaying ? 'Play' : 'Pause'
    }

    async runMetronome() {
        while (this.isPlaying) {
            this.playSound(this.sound)
            await sleep(60 / this.timesPerMinute * 1000)
        }
    }

    playSound(path) {
        const audio = document.createElement('audio')
        audio.src = path
        this.increaseVolume(audio)
        audio.play()
    }

    increaseVolume(audio) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audio);

// create a gain node
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 2; // double the volume
        source.connect(gainNode);

// connect the gain node to an output destination
        gainNode.connect(audioContext.destination);
    }
}

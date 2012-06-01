function Sound() {

    if(typeof AudioContext == "function") {
        var context_ = new AudioContext();
    } else if (typeof webkitAudioContext == "function") {
        var context_ = new webkitAudioContext();
    }

    var self_ = this;
    var source_ = null;
    var gain_ = null;
    var buffer_ = null;
    var title_ = null;
    var duration_ = null;
    var interval_ = null;
    var playing_ = false;
    var startTime_ = null;
    var currentTime_ = 0;
    var intervalLast_ = 0;
    var name_ = null;
    var volume_ = 0.5;

    this.initAudio = function(arrayBuffer) {
        if(buffer_ == null) {
            buffer_ = context_.createBuffer(arrayBuffer, false /*mixtomono*/);
            duration_ = buffer_.duration;
        }
    }

    this.play = function() {
        if(this.playing) {
            self_.stop();
        }

        gain_ = context_.createGainNode();
        gain_.gain.value = volume_;
        source_ = context_.createBufferSource();
        source_.buffer = buffer_;
        source_.connect(gain_);
        gain_.connect(context_.destination);

        startTime_ = context_.currentTime;
        intervalLast_ = startTime_;
        source_.noteGrainOn(0, currentTime_, duration_ - currentTime_);
        interval_ = setInterval(function() {
            // let's wakeup around a second-ish.
            if(context_.currentTime - intervalLast_ > 1000) {
                intervalLast_ = context_.currentTime;
                self_.onCurrentTimeChanged();
            }
        }, 50); // seriously...50 millis, get better
        playing_ = true;
    }

    this.stop = function() {
        if(playing_) {
            self_.pause();
        }
        
        currentTime_ = 0;
    }

    this.pause = function() {
        if(playing_) {
            source_.disconnect(0);
            source_.noteOff(0);
            source_ = null;
            playing_ = false;
            currentTime_ += (context_.currentTime - startTime_);
            clearInterval(interval_);
        }
    }

    this.changeVolume = function(volume) {
        if(volume >= 0.0) {
            this.volume_ = volume;
            if(gain_) {   
                gain_.gain.value = volume;
            }   
        }
    }
    this.getVolume = function() {return volume_;}

    this.onCurrentTimeChanged = function() {}
    this.getCurrentTime = function() {
        if(playing_) {
            var time = (audioContext.currentTime - this.startTime) + this.currentTime;
            if(time > duration_) {
                return duration_;
            } else {
                return time;
            }
        } else {
            return currenTime;
        }
    }
    this.getDuration = function() {return duration_;}
    this.getName = function() {return name_;}
    this.setName = function(name) {name_ = name};
}

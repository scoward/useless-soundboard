function Sound() {

    if(typeof AudioContext == "function") {
        var context_ = new AudioContext();
    } else if (typeof webkitAudioContext == "function") {
        var context_ = new webkitAudioContext();
    }

    var self_ = this;
    var source_ = null;
    var buffer_ = null;
    var title_ = null;
    var duration_ = null;
    var interval_ = null;
    var playing_ = false;
    var startTime_ = null;
    var currentTime_ = 0;
    var intervalLast_ = 0;

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

        source_ = context_.createBufferSource();
        source_.buffer = buffer_;
        source_.connect(context_.destination);
        startTime_ = context_.currentTime;
        intervalLast_ = startTime_;
        source_.noteGrainOn(0, currentTime_, duration_ - currentTime_);
        // set up an interval that calls 
        interval_ = setInterval(function() {
            if(intervalLast_ != context_.currentTime) {
                intervalLast_ = context_.currentTime;
                self_.onCurrentTimeChanged();
            }
        }, 50);
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
}

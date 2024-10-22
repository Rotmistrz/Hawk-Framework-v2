export default class Countdown {
    constructor(container, targetDate, options) {
        this.container = $(container);
        this.targetDate = targetDate;
        this.interval;
        this.finished = false;

        this.defaultOptions = {
            valueClassNames: {
                days:'hawk-countdown__days',
                hours: 'hawk-countdown__hours',
                minutes: 'hawk-countdown__minutes',
                seconds: 'hawk-countdown__seconds'
            },

            captionClassNames: {
                days:'hawk-countdown__days-caption',
                hours: 'hawk-countdown__hours-caption',
                minutes: 'hawk-countdown__minutes-caption',
                seconds: 'hawk-countdown__seconds-caption'
            },

            unitForms: {
                days: {
                    'single': "day",
                    'many': "days"
                },

                hours: {
                    'single': "hour",
                    'many': "hours"
                },
                minutes: {
                    'single': "minute",
                    'many': "minutes"
                },
                seconds: {
                    'single': "second",
                    'many': "seconds"
                }
            },

            onTargetReached: (countdown) => {}
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }

    getCurrentTime() {
        return new Date();
    }

    getTimeDifference() {
        const now = this.getCurrentTime();

        let timeDifference = this.targetDate.getTime() - now.getTime();

        if (timeDifference > 0) {

            const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
        
            timeDifference -= days * 1000 * 60 * 60 * 24;

            const hours = Math.floor(timeDifference / 1000 / 60 / 60);

            timeDifference -= hours * 1000 * 60 * 60;

            const minutes = Math.floor(timeDifference / 1000 / 60);

            timeDifference -= minutes * 1000 * 60;

            const seconds = Math.floor(timeDifference / 1000);

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        } else {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
    }

    isTargetReached(timeLeft) {
        return timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0;
    }

    update() {
        const timeLeft = this.getTimeDifference();

        this.values.days.html(Hawk.addZeros(timeLeft.days, 1));
        this.values.hours.html(Hawk.addZeros(timeLeft.hours, 2));
        this.values.minutes.html(Hawk.addZeros(timeLeft.minutes, 2));
        this.values.seconds.html(Hawk.addZeros(timeLeft.seconds, 2));

        if (timeLeft.days === 1 || timeLeft.days === 0) {
            this.captions.days.html(this.options.unitForms.days.single);
        } else {
            this.captions.days.html(this.options.unitForms.days.many);
        }

        if (timeLeft.hours == 1) {
            this.captions.hours.html(this.options.unitForms.hours.single);
        } else {
            this.captions.hours.html(this.options.unitForms.hours.many);
        }

        if (timeLeft.minutes == 1) {
            this.captions.minutes.html(this.options.unitForms.minutes.single);
        } else {
            this.captions.minutes.html(this.options.unitForms.minutes.many);
        }

        if (timeLeft.seconds == 1) {
            this.captions.seconds.html(this.options.unitForms.seconds.single);
        } else {
            this.captions.seconds.html(this.options.unitForms.seconds.many);
        }

        if (this.isTargetReached(timeLeft) && !this.finished) {
            this.finished = true;

            clearInterval(this.interval);

            this.options.onTargetReached(this);
        }
    }

    run() {
        this.values = {
            days: this.container.find('.' + this.options.valueClassNames.days),
            hours: this.container.find('.' + this.options.valueClassNames.hours),
            minutes: this.container.find('.' + this.options.valueClassNames.minutes),
            seconds: this.container.find('.' + this.options.valueClassNames.seconds)
        };

        this.captions = {
            days: this.container.find('.' + this.options.captionClassNames.days),
            hours: this.container.find('.' + this.options.captionClassNames.hours),
            minutes: this.container.find('.' + this.options.captionClassNames.minutes),
            seconds: this.container.find('.' + this.options.captionClassNames.seconds)
        };

        this.update();

        this.interval = setInterval(() => {
            this.update();
        }, 1000);
    }
}
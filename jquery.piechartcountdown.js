if( !CSSAnimation || !CSSAnimation.version || CSSAnimation.version < 0.2 ) {
    /*
     CSSAnimation v0.2
     Provides 'cssAnimationKeyframe' events for keyframe animations.
     http://www.joelambert.co.uk/cssa

     Copyright 2011, Joe Lambert. All rights reserved
     Free to use under the MIT license.
     http://www.opensource.org/licenses/mit-license.php
     */
    var CSSAnimation={version:"0.2"};CSSAnimation.find=function(a){for(var i=document.styleSheets,g=i.length-1;g>=0;g--)try{for(var d=i[g],e=d.cssRules?d.cssRules:d.rules?d.rules:[],c=e.length-1;c>=0;c--)if((e[c].type===window.CSSRule.WEBKIT_KEYFRAMES_RULE||e[c].type===window.CSSRule.MOZ_KEYFRAMES_RULE)&&e[c].name==a)return e[c]}catch(l){}return null};
    CSSAnimation.trigger=function(a,i,g,d){var e={},c={},l=null,o=0,q=0,j={base:5,easing:"linear",iterationCount:1},k=["Webkit","Moz"],h;for(h in d)j[h]=d[h];if(!a.isPlaying){l=CSSAnimation.find(i);if(!l)return false;e={};for(var b=0;b<l.cssRules.length;b++){d=l.cssRules[b];h=d.keyText;var m=0;h=="from"?m=0:h=="to"?m=1:m=h.replace("%","")/100;e[m*100+"%"]=d}o=(new Date).getTime();var p=m=roundedKey=keyframe=null,s=function(f,u){var n=document.createEvent("Event");n.initEvent("cssAnimationKeyframe",true,
        true);n.animationName=i;n.keyText=f;n.elapsedTime=u;a.dispatchEvent(n)};b=0;var r=false,t=function(f){r=false;for(b=0;b<k.length&&!r;b++)if(a.style[k[b]+"AnimationName"]!==undefined){a.style[k[b]+"AnimationDuration"]=f.duration;a.style[k[b]+"AnimationTimingFunction"]=f.timingFunction;a.style[k[b]+"AnimationIterationCount"]=f.iterationCount;a.style[k[b]+"AnimationName"]=f.name;r=true}};t({name:i,duration:g+"ms",timingFunction:j.easing,iterationCount:j.iterationCount});a.isPlaying=true;(function f(){p=
        (new Date).getTime();percent=Math.floor((p-(o+q*g))/g*100);key=percent-percent%j.base+"%";if((keyframe=e[key])&&!c[key]){c[key]=true;s(key,(p-o)/1E3)}if(percent<100)requestAnimFrame(f,a);else{c["100%"]||s("100%",(p-o)/1E3);q++;if(q<j.iterationCount||j.iterationCount=="infinite"){c={};requestAnimFrame(f,a)}else{t({name:null,duration:null,timingFunction:null,iterationCount:0});a.isPlaying=false}}})()}};
    window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();
}

/**
 * Pie Chart Count Down
 * ------------------------------------------
 * Copyright (c) 2012 Victor Jonsson (http://www.victorjonsson.se)
 * Documentation and issue tracking on Github (https://github.com/victorjonsson/Pie-Chart-Count-Down)
 *
 * @license MIT license
 * @requires jQuery version >= 1.6
 * @version 1.0
 */
(function($){

    // Make it possible to listen to animation key frames using jQuery
    if( !$.fn.cssanimation ) {
        $.fn.cssanimation=function(a,b,c){return this.each(function(e,d){CSSAnimation.trigger(d,a,b,c)})}
    }

    $.fn.pieChartCountDown = function() {

        // Default options
        var options = {
            size : 60,
            time : 10,
            background : '#FFF',
            color : '#000',
            callback : null,
            unSupportedCallback : null,
            infinite : false,
            border: 0
        };

        // Create a reference to this jQuery element
        var $spinner = this;

        // Controlling an already started spinner
        if(arguments.length == 1 && typeof arguments[0] == 'string') {
            if( Utils.isInitiated ) {

                // Fallback
                if( !Utils.supportsCSSAnimation ) {
                    SpinnerFallback.executeCommand($spinner, arguments[0]);
                }
                else {
                    if( arguments[0] == 'destroy' ) {
                        Utils.removeSpinner($spinner);
                        // todo: implement actions "pause" and "resume"
                    } else {
                        throw new Error('Unkown method '+arguments[0]);
                    }
                }
            } else {
                throw new Error('Calling an action for jQuery plugin pieChartCountDown, but now count down is initiated');
            }

            return this;
        }

        // Get the time, custom options and callback
        // from function arguments
        for(var i=0; i < arguments.length; i++) {
            var arg = arguments[i];
            var argType = typeof arg;
            if( argType == 'number' || $.isNumeric(arg) ) {
                options.time = parseInt(arg);
            }
            else if( argType == 'function' ) {
                options.callback = arg;
            }
            else if( arg !== null && arg !== false) {
                $.extend(options, arg);
            }
        }

        // Find out whether or not CSS animations is supported
        // and some other stuff we need in order for this
        // plugin to work properly
        if( !Utils.isInitiated ) {
            Utils.init(this.get(0));
        }

        // Unsupported browser!!
        if( !Utils.supportsCSSAnimation ) {
            if(typeof options.unSupportedCallback == 'function') {
                options.unSupportedCallback($spinner);
            }
            else {
                if(typeof options.unSupportedCallback == 'object' && options.unSupportedCallback !== null)
                    SpinnerFallback = options.unSupportedCallback;

                SpinnerFallback.start($spinner, options);
            }
        }
        else {

            // In case we have restarted the spinner while it's
            // ticking down we first of all have to remove it
            Utils.removeSpinner($spinner, options.background);

            // Create spinner elements
            var spinnerID = ++Utils.numSpinners,
                $spinnerElem = $('<div></div>');

            $spinnerElem.attr('id', 'spinner-'+spinnerID);

            $spinnerElem.css({
                'position': 'relative',
                'border-radius': '100%',
                'width': options.size+'px',
                'height': options.size+'px',
                'background': options.background,
                border : options.border+'px solid '+options.background
            });

            var $left = $('<div></div>');
                $left.css({
                    'width' : '50%',
                    'height' : '100%',
                    'overflow' : 'hidden',
                    'position' : 'absolute',
                    'left' : '0'
                })
                .appendTo($spinnerElem);


            var $leftFill = $('<div></div>');
            $leftFill.css({
                    'border-radius':'999px',
                    'position':'absolute',
                    'width':'100%',
                    'height':'100%',
                    'left':'100%',
                    'border-top-left-radius':'0',
                    'border-bottom-left-radius':'0',
                    'background' : options.color
                })
                .css(Utils.pfx+'animation-iteration-count', options.infinite ? 'infinite':'1')
                .css(Utils.pfx+'animation-timing-function', 'linear')
                .css(Utils.pfx+'transform-origin', '0 50%')
                .addClass('left-fill')
                .appendTo($left);


            var $right = $('<div></div>');
                $right.css({
                    'width' : '50%',
                    'height' : '100%',
                    'overflow' : 'hidden',
                    'position' : 'absolute',
                    'left' : '50%'
                })
                .appendTo($spinnerElem);

            var $rightFill = $('<div></div>');
                $rightFill.css({
                    'border-radius':'999px',
                    'position':'absolute',
                    'width':'100%',
                    'height':'100%',
                    'left':'-100%',
                    'border-top-right-radius':'0',
                    'border-bottom-right-radius':'0',
                    'background' : options.color
                })
                .css(Utils.pfx+'animation-iteration-count', options.infinite ? 'infinite':'1')
                .css(Utils.pfx+'animation-timing-function', 'linear')
                .css(Utils.pfx+'transform-origin', '100% 50%')
                .addClass('right-fill')
                .appendTo($right);


            this
                .html('')
                .append($spinnerElem)
                .attr('data-spinner-id', spinnerID)
                .addClass('pie-chart-spinner')
                .show();

            var animOpts = {
                iterationCount : options.infinite ? 'infinite':1
            };

            var countDown = (options.time * 1000) * 2;

            $rightFill.cssanimation('ui-spinner-rotate-right',countDown, animOpts);

            $leftFill
                .cssanimation('ui-spinner-rotate-left', countDown, animOpts)
                .bind('cssAnimationKeyframe', function(e) {
                    if( e.originalEvent.keyText == '50%' ) {
                        if( !options.infinite ) {
                            Utils.removeSpinner($(this).parent().parent().parent());
                            if(typeof options.callback == 'function')
                                options.callback($spinner);
                        }

                    }
                });
        }

        return this;
    };

    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Container for utility functions used by this jQuery plugin
     * @type {Object}
     */
    var Utils =  {

        numSpinners : 0,
        supportsCSSAnimation : false,
        type: null,
        pfx : null,
        CSSTransformRule : null,
        CSSAnimationRule : null,
        animationEndEvent : null,
        isInitiated : false,

        /**
         * This function will be generated by calling Utils.init
         * @param {String} frames
         */
        addAnimationKeyFrames : function(frames) {},

        /**
         * @param {HTMLElement} elm
         */
        init : function(elm) {
            this.isInitiated = true;
            var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {

                    // Setup properties
                    this.supportsCSSAnimation = true;
                    this.type = domPrefixes[ i ].toLowerCase();
                    this.pfx = '-' +this.type+ '-';
                    this.CSSTransformRule = this.pfx+'transform';
                    this.CSSAnimationRule = this.pfx+'animation';

                    switch(this.type) {
                        case 'o':
                            this.animationEndEvent = 'oAnimationEnd';
                            break;
                        case 'webkit':
                            this.animationEndEvent = 'webkitAnimationEnd';
                            break;
                        default:
                            this.animationEndEvent = 'animationend';
                            break;
                    }

                    // Create function to be used when adding new
                    // animation key frames
                    if( document.styleSheets && document.styleSheets.length ) {
                        this.addAnimationKeyFrames = function(frames) {
                            document.styleSheets[0].insertRule( frames, 0 );
                        };
                    } else {
                        this.addAnimationKeyFrames = function(frames) {
                            var s = document.createElement( 'style' );
                            s.innerHTML = frames;
                            document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );
                        };
                    }

                    break;
                }
            }

            // Add animation key frames used by all spinners
            if( this.supportsCSSAnimation ) {
                var keyFramePrefix = (this.pfx == '-moz-' || this.pfx == '-webkit-') ? this.pfx : '';
                var spinnerRightFrames = '@'+keyFramePrefix+'keyframes ui-spinner-rotate-right {'+
                    '0% {'+this.CSSTransformRule+': rotate(0deg);}' +
                    '25% {'+this.CSSTransformRule+': rotate(180deg);}' +
                    '50% {'+this.CSSTransformRule+': rotate(180deg);}' +
                    '75% {'+this.CSSTransformRule+': rotate(360deg);}' +
                    '100% {'+this.CSSTransformRule+': rotate(360deg);}' +
                    '}';

                var spinnerLeftFrames = '@'+keyFramePrefix+'keyframes ui-spinner-rotate-left {'+
                    '0% {'+this.CSSTransformRule+': rotate(0deg);}' +
                    '25% {'+this.CSSTransformRule+': rotate(0deg);}' +
                    '50% {'+this.CSSTransformRule+': rotate(180deg);}' +
                    '75% {'+this.CSSTransformRule+': rotate(180deg);}' +
                    '100% {'+this.CSSTransformRule+': rotate(360deg);}' +
                    '}';

                this.addAnimationKeyFrames(spinnerRightFrames);
                this.addAnimationKeyFrames(spinnerLeftFrames);
            }
        },


        /**
         * @param {jQuery} $element
         */
        removeSpinner : function($element)     {
            var spinnerID = $element.attr('data-spinner-id');
            if( spinnerID  ) {
                $element.children().remove();
                $element.removeAttr('data-spinner-id');
                $element.removeAttr('data-spinner-paused');
            }
        }
    };


    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Fall back used when CSS animations isn't supported
     * @type {Object}
     */
    var SpinnerFallback = {

        id : 0,

        intervals : {},

        options : {},

        start : function($spinner, options) {

            this.remove($spinner);

            var intervalID = 'spinner' + (++this.id);

            $spinner
                .text(options.time)
                .attr('data-interval-id', intervalID)
                .css({
                    fontSize : (0.8 * options.size) + 'px',
                    background: options.background,
                    color : options.color,
                    width : options.size,
                    height : options.size,
                    lineHeight: 'normal',
                    textAlign : 'center'
                });

            this.options[intervalID] = options;

            var self = this;

            this.intervals[intervalID] = setInterval(function() {
                var paused = $spinner.attr('data-spinner-paused');
                if( paused === undefined ) {
                    var count = parseInt($spinner.text()) - 1;
                    if(count > 0) {
                        $spinner.text(count);
                    }
                    else {
                        self.remove($spinner);
                    }
                }
            }, 1000);
        },

        executeCommand : function($spinner, cmd) {
            switch(cmd) {
                case 'pause':
                    this.pause($spinner);
                    break;
                case 'resume':
                    this.resume($spinner);
                    break;
                case 'stop':
                    this.remove($spinner);
                    break;
                case 'toggle':
                    if( $spinner.attr('data-spinner-paused') !== undefined ) {
                        this.resume($spinner);
                    }
                    else {
                        this.pause($spinner);
                    }
                    break;
                default:
                    throw new Error('Unknown method '+arguments[0]);
                    break;
            }
        },

        remove : function($spinner) {
            var intervalID = $spinner.attr('data-interval-id');
            if( intervalID !== undefined ) {

                var options = this.options[intervalID];

                clearInterval(SpinnerFallback.intervals[intervalID]);

                $spinner.text('');

                if(options) {
                    if(typeof options.callback == 'function')
                        options.callback($spinner);
                }

                delete SpinnerFallback.intervals[intervalID];
                delete SpinnerFallback.options[intervalID];
            }
        },

        pause : function($spinner) {
            var intervalID = $spinner.attr('data-interval-id');
            if( intervalID !== undefined ) {
                $spinner.attr('data-spinner-paused', 1);
            }
        },

        resume : function($spinner) {
            $spinner.removeAttr('data-spinner-paused');
        }
    };

})(jQuery);

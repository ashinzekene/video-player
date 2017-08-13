/*
JS Modified from a tutorial found here: 
http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/

I really wanted to learn how to skin html5 video.
*/
$(document).ready(function(){
//INITIALIZE
var video = $('#myVideo');
var input = $("#file-input");
//remove default control when JS loaded
video[0].removeAttribute("controls");
$('.control').fadeIn(500);
$('.caption').fadeIn(500);

//before everything get started
video.on('loadedmetadata', function(e) {
  //set video properties
  $('.duration').text(timeFormat(0));
  $('.video-length').text(timeFormat(video[0].duration));
  updateVolume(0, 0.7);
    
  //start to get video buffering data 
  setTimeout(startBuffer, 150);
      
    //bind video events
    $('.video-container')
    .hover(function() {
      $('.control').stop().fadeIn();
      $('.caption').stop().fadeIn();
    }, function() {
      if(!volumeDrag && !timeDrag){
      $('.control').stop().fadeOut();
      $('.caption').stop().fadeOut();
    }
  })
});

video.on('pause', function() {
  $('.btnPlay').find('.fa-pause').removeClass('fa-pause').addClass('fa-play');
})
video.on('play', function() {
  $('.btnPlay').find('.fa-play').removeClass('fa-play').addClass('fa-pause');
})
video.on('volumechange', function() {
  console.log($(this)[0].volume)
  !$(this)[0].muted ? $(".fa.mute").removeClass("fa-volume-up").addClass("fa-volume-off") : $(".fa.mute").addClass("fa-volume-up").removeClass("fa-volume-off")
})
video.on('click', pausePlay)
$('.btnPlay').on('click', pausePlay)

function pausePlay() {
  $("video")[0].paused ?  $("video")[0].play() : $("video")[0].pause()
}

//display video buffering bar
var startBuffer = function() {
  var currentBuffer = video[0].buffered.end(0);
  var maxduration = video[0].duration;
  var perc = 100 * currentBuffer / maxduration;
  $('.bufferBar').css('width',perc+'%');
    
  if(currentBuffer < maxduration) {
    setTimeout(startBuffer, 500);
  }
};	

//display current video play time
video.on('timeupdate', function() {
  var currentPos = video[0].currentTime;
  var maxduration = video[0].duration;
  var perc = 100 * currentPos / maxduration;
  $('.progress-bar.time-lapse').css('width',perc+'%');	
  $('.current').text(timeFormat(currentPos));	
});



//fullscreen button clicked
$('.btnFS').on('click', function() {
  if($.isFunction(video[0].webkitRequestFullscreen)) {
    video[0].webkitRequestFullscreen()
  }	
  else if ($.isFunction(video[0].mozRequestFullScreen)) {
    video[0].mozRequestFullScreen();
  }
  else {
    alert('Your browsers doesn\'t support fullscreen');
  }
});

  //sound button clicked
  $('.sound').click(function() {
    video[0].muted = !video[0].muted;
    $(this).toggleClass('muted');
    if(video[0].muted) {
      $('.volumeBar').css('width',0);
    }
    else{
      $('.volumeBar').css('width', video[0].volume*100+'%');
    }
  });

  //VIDEO EVENTS
  //video canplay event
  video.on('canplay', function() {
    $('.loading').fadeOut(100);
  });

  //video canplaythrough event
  //solve Chrome cache issue
  var completeloaded = false;
  video.on('canplaythrough', function() {
    completeloaded = true;
  });

  //video ended event
  video.on('ended', function() {
    $('.btnPlay').removeClass('paused');
    video[0].pause();
  });

  //video seeking event
  video.on('seeking', function() {
  //if video fully loaded, ignore loading screen
    if(!completeloaded) { 
      $('.loading').fadeIn(200);
    }	
  });

  //video waiting for more data event
  video.on('waiting', function() {
  $('.loading').fadeIn(200);
  });

  //VIDEO PROGRESS BAR
  //when video timebar clicked
  var timeDrag = false;	/* check for drag event */
  $('.seek').on('mousedown', function(e) {
    timeDrag = true;
    updatebar(e.pageX);
  });
  $(document).on('mouseup', function(e) {
    if(timeDrag) {
      timeDrag = false;
      updatebar(e.pageX);
    }
  });
  $(document).on('mousemove', function(e) {
    if(timeDrag) {
      updatebar(e.pageX);
  }
  });
  var updatebar = function(x) {
    var progress = $('.seek');
    //calculate drag position
    //and update video currenttime
    //as well as progress bar
    var maxduration = video[0].duration;
    var position = x - progress.offset().left;
    var percentage = 100 * position / progress.width();
    if(percentage > 100) {
      percentage = 100;
    }
    if(percentage < 0) {
      percentage = 0;
    }
    $('.time-lapse').css('width',percentage+'%');	
    var time = maxduration * percentage / 100;
    video[0].currentTime = time;
    $(".duration").text(timeFormat(time))
  };

  //VOLUME BAR
//   //volume bar event
  var volumeDrag = false;
  $('.volume').on('mousedown', function(e) {
    volumeDrag = true;
    video[0].muted = false;
  $('.sound').removeClass('muted');
    updateVolume(e.pageX);
  });
  $(document).on('mouseup', function(e) {
    if(volumeDrag) {
      volumeDrag = false;
      updateVolume(e.pageX);
    }
  });
  $(document).on('mousemove', function(e) {
    if(volumeDrag) {
      updateVolume(e.pageX);
    }
  });
  var updateVolume = function(x, vol) {
    var volume = $('.volume');
    var percentage;
    //if only volume have specificed
    //then direct update volume
      if(vol) {
        percentage = vol * 100;
      }
      else {
        var position = x - volume.offset().left;
        percentage = 100 * position / volume.width();
      }

      if(percentage > 100) {
        percentage = 100;
      }
      if(percentage < 0) {
        percentage = 0;
      }

  //update volume bar and video volume
    $('.volume-bar').css('width',percentage+'%');	
    video[0].volume = percentage / 100;

  //change sound icon based on volume
    if(video[0].volume == 0){
      $('.sound').removeClass('sound2').addClass('muted');
    }
    else if(video[0].volume > 0.5){
      $('.sound').removeClass('muted').addClass('sound2');
    }
    else{
      $('.sound').removeClass('muted').removeClass('sound2');
    }

  };

//Time format converter - 00:00
  var timeFormat = function(seconds){
    var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
    var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
    return m+":"+s;
  };

  $(".play-vid").click(function() {
    input[0].click()
  })
  input.change(function(e) {
    $("ul.list-group").html("")
    for(let x of e.target.files) {
      if (x.type !== "video/mp4") {
        throw new Error("You should only add MP4 files");
        return;
      }
      var reader = new FileReader()
      reader.readAsDataURL(x)
      reader.onprogress = updateUploadProgress
      reader.onloadstart = function() { 
        console.log("Loading..");
        $("video")[0].src = "";
      }
      reader.onloadend = function() {
        console.log("load end triggerd")
      }
      reader.onload = function(e) {
        console.log("Loaded ", e.target.result.length)
        $("video")[0].src = e.target.result
        console.log("Finally")
        $("video")[0].play()
      }
      $(".caption").text(x.name)
      $("ul.list-group").append(`<li class="list-group-item"><a>${x.name}</a></li>`)
    }
  })

  function updateUploadProgress(evt) {
    // evt is an ProgressEvent.
    var progress = $(".upload-progress")[0]
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

});
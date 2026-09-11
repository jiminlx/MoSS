window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // --- Results: variant pills + autoplay ---------------------------------

    function playVideo(v) {
      var p = v.play();
      if (p && typeof p.catch === 'function') { p.catch(function() {}); }
    }

    // Autoplay videos while they are on screen, pause them when they scroll away.
    var taskVideos = document.querySelectorAll('.task-videos video');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            v.dataset.visible = '1';
            playVideo(v);
          } else {
            v.dataset.visible = '';
            v.pause();
          }
        });
      }, { threshold: 0.35 });
      taskVideos.forEach(function(v) { observer.observe(v); });
    } else {
      taskVideos.forEach(function(v) { v.dataset.visible = '1'; playVideo(v); });
    }

    document.querySelectorAll('.variant-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var card = btn.closest('.task-card');
        card.querySelectorAll('.variant-btn').forEach(function(b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');

        var failVideo = card.querySelector('.video-fail');
        var successVideo = card.querySelector('.video-success');
        [[failVideo, btn.dataset.fail], [successVideo, btn.dataset.success]].forEach(function(pair) {
          var v = pair[0], src = pair[1];
          if (!v || v.getAttribute('src') === src) { playVideo(v); return; }
          v.setAttribute('src', src);
          v.load();
          v.addEventListener('loadeddata', function once() {
            v.removeEventListener('loadeddata', once);
            playVideo(v);
          });
        });
      });
    });

})

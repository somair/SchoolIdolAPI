
var avatar_size = 2;
var card_size = 133;

function loadActivities() {
    var container, feed;
    var all = false;
    if ($('#hotactivities').length > 0) {
	container = $('#hotactivities');
	feed = undefined;
    } else if ($('#myactivities').length > 0) {
	container = $('#myactivities');
	feed = true;
    } else {
	container = $('#activities');
	feed = undefined;
	all = true;
    }
    container.find('.activities').html('<div class="loader">Loading...</div>');
    var followHTML = '<a href="/users/" target="_blank" class="fontx3 padding50" style="display: block">' + follow_sentence + '</a>';
    $.get('/ajax/' + (typeof feed == 'undefined' ? 'activities' : 'feed')
	  + '/?avatar_size=' + avatar_size + '&card_size=' + card_size + (all ? '&all' : ''), function(data) {
	      container.find('.activities').html(data);
	      if (container.find('.activities .alert-warning').length > 0) {
		  container.find('.activities .alert-warning').replaceWith(followHTML);
	      } else if (logged_in) {
		  var otherThandb0 = false;
		  $('.activity .avatar').parent().each(function() {
		      if ($(this).attr('href').indexOf('/user/db0/') != 0) {
			  otherThandb0 = true;
		      }
		  });
		  if (!otherThandb0) {
		      container.find('.activities').prepend(followHTML);
		  }
	      }
	      updateActivities();
	      $(window).scroll(
		  function () {
		      var button = $('a[href="#loadMoreActivities"]');
		      if (button.length > 0
			  && button.find('.loader').length == 0
			  && ($(window).scrollTop() + $(window).height())
			  >= ($(document).height() - button.height())) {
			  feed = $('#myactivities').length > 0 ? true : undefined;
			  loadMoreActivitiesOnClick(button, container, undefined, feed, avatar_size, card_size);
		      }
		  });
	  });
}

$(function() {
    if ($('#countdown').length > 0) {
	$('#countdown').countdown({
	    date: countdowndate,
	    render: countdownRender
	});
    }
});


$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    loadActivities();

    $('#activities-buttons .all').click(function() {
	$('.activities-wrapper').attr('id', 'activities');
	loadActivities();
    });
    $('#activities-buttons .hot').click(function() {
	$('.activities-wrapper').attr('id', 'hotactivities');
	loadActivities();
    });
    $('#activities-buttons .following').click(function() {
	$('.activities-wrapper').attr('id', 'myactivities');
	loadActivities();
    });
});

/*
 * Track when scratch a panel
 * Show winning or losing modal
 */
var hits = {
  winHits: 0,
  loseHits: 0,
  totalHist: 0
}

$(document).ready(function () {

  $("#game").fadeIn();

  $(".panel").scratchGame({
    revealRadius: 15,
    minPercentage: 50,
    complete: function ($elem) {
      handleScratchEnd($elem);
    }
  });

  function handleScratchEnd($panel) {

    if (!$panel.hasClass('scratching-over')) {
      hits.totalHist++;

      if ($panel.hasClass('win')) {
        hits.winHits++;
        $('#modal-content').html('You win !');
        $('#modal-end').modal();
      } else {
        hits.loseHits++;
        $('#modal-content').html('You lose ...');
        $('#modal-end').modal();
      }

      $panel.addClass('scratching-over');
    }
  }
});
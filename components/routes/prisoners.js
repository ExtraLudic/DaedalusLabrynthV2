const _ = require('underscore');

module.exports = function(webserver, controller) {

  webserver.get('/prisoners/:team', function(req, res) {
    console.log('team: ' + req.params.team);
    // Time is up for a team!
    controller.storage.teams.get(req.params.team, function(err, team) {
      console.log(err, team.id, " /n Team info");
      var bot = controller.spawn(team.bot);

      if (team.prisoner_complete) return;

      controller.prisoners_check(bot, team.id, function(users) {

        // reset prisoner times
        team.prisoner_time.complete = true;

        controller.storage.teams.save(team, function(err, saved) {

          // if game is not started, start it
          controller.trigger("prisoners_onboard", [bot, saved.id]);

        });
      });

    });
  });

}

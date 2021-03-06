module.exports = function (agenda) {
  let cron = "0 */1 * * *",
    name = "icoBench",
    options = {
      priority: "default"
    };
  agenda.define(name, async function (job, done) {
    icoCreator.fetch(agenda, done)
  });
  agenda.every(cron, name);

  sails.log.debug(name, "was init.");
};

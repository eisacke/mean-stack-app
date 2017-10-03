const Event = require('../models/event');
const nodemailer = require('nodemailer');
const path = require('path');
const async = require('async');
const EmailTemplate = require('email-templates').EmailTemplate;
const inviteTemplate = path.join(__dirname, '..', 'templates', 'invite');
const invite = new EmailTemplate(inviteTemplate);
const locals = {};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'eventplanapp@gmail.com',
    pass: process.env.PLANIT_GMAIL_PASSWORD
  }
});

function findEvent(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('createdBy')
    .exec()
    .then(event => {
      if(!event) return res.notFound();
      locals.event = event;

      sendInvites();
      return res.end();
    })
    .catch(next);
}

function sendInvites() {
  async.each(locals.event.invitees, sendInvite, handleError);
}

function sendInvite(invitee, next) {
  if(invitee.invited) return false;

  locals.invitee = invitee;
  invite.render(locals, (err, result) => {
    if (err) return next(err);

    transporter.sendMail({
      from: '"P L A N I T 🚀" <eventplanapp@gmail.com>',
      to: locals.invitee.email,
      subject: `${locals.invitee.name}, you're invited!`,
      html: result.html,
      text: result.text
    }, (err) => {
      if (err) return handleError(err);
      console.log(`Email sent to ${invitee.name}`);
      updateUser(invitee);
    });

  });
}

function updateUser(invitee) {
  Event
    .findById(locals.event.id)
    .exec()
    .then(event => {
      if(!event) return false;

      const inviteeToUpdate = event.invitees.id(invitee.id);
      inviteeToUpdate.invited = true;
      return event.save();
    });
}

function handleError(err) {
  console.log('err:', err);
}

module.exports = {
  send: findEvent
};

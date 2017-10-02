const Event = require('../models/event');
const nodemailer = require('nodemailer');
const path = require('path');
const async = require('async');
const EmailTemplate = require('email-templates').EmailTemplate;
const templateDir = path.join(__dirname, '..', 'templates', 'invite');
const invite = new EmailTemplate(templateDir);
const locals = {};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'eventplanapp@gmail.com',
    pass: process.env.PLANIT_GMAIL_PASSWORD
  }
});

function sendInvites(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('createdBy')
    .exec()
    .then(event => {
      if(!event) return res.notFound();
      locals.event = event;

      loopInvitees(event);
      return res.end();
    })
    .catch(next);
}

function loopInvitees(event) {
  async.each(event.invitees, sendInvite, handleError);
}

function sendInvite(user, next) {
  locals.user = user;
  invite.render(locals, (err, result) => {
    if (err) return next(err);

    transporter.sendMail({
      from: '"P L A N I T 🚀" <eventplanapp@gmail.com>',
      to: locals.user.email,
      subject: `${locals.user.name}, you're invited!`,
      html: result.html,
      text: result.text
    }, (err) => {
      if (err) return handleError(err);
      console.log('Email Sent');
    });

  });
}

function handleError(err) {
  console.log('err:', err);
}

module.exports = {
  send: sendInvites
};

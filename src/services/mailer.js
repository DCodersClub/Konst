module.exports.sendMail = (to, subject, body) => {
  const send = require("gmail-send")({
    user: "null.konst@gmail.com ",
    pass: "konst007",
    to: to,
    subject: subject,
  });

  return new Promise((resolve, reject) => {
    send(
      {
        text: body,
      },
      (error, result, fullResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(to);
        }
      }
    );
  });
};

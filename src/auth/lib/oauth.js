'use strict';

import superagent from 'superagent';

import User from '../model';

// This is currently setup for Google, but we could easily swap it out
// for any other provider or even use a totally different module to
// to do this work.
//
// So long as the method is called "authorize" and we get the request,
// we should be able to roll on our own here...

const authorize = (req) => {

  let code = req.query.code;

  console.log('(1) code', code);

  // exchange the code or a token
  return superagent.post('https://graph.facebook.com/v3.2/oauth/access_token')
    //.type('form')
    .send({
      code: code-parameter,
      client_id: process.env.MyControl1.ClientID,
      client_secret: app-secret,
      redirect_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'client_credentials',
    })
    .then( response => {
      let facebookToken = response.body.access_token;
      console.log('(2) facebook token', facebookToken);
      return facebookToken;
    })
  // use the token to get a user
    .then ( token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then (response => {
          let user = response.body;
          console.log('(3) Facebook User', user);
          return user;
        });
    })

    .then(facebookUser => {
      console.log('(4) Creating Account')
      return User.createFromOAuth(facebookUser);

    })
    .then (user => {
      console.log('(5) Created User, generating token');
      return user.generateToken();
    })
    .catch(error=>error);
};



export default {authorize};

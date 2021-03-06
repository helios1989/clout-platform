/**
 * SocialController
 *
 * @description :: Server-side logic for managing socials
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const slug = require('slug');

module.exports = {

  facebookUrl: function (req, res) {
    /***
     * return facebook auth url, need add redirect_uri
     */
    res.json(200, {"url": Facebook.authUrl()})
  },

  facebookMobileAuth: async (req, res) => {
    let accessToken = req.param("accessToken");
    let email = req.param("email");

    if (!accessToken) {
      return res.json(400, Errors.build({
        "accessToken": {
          "rule": "required",
          "message": "\"required\" validation rule failed for input: null\nSpecifically, it threw an error.  Details:\n undefined"
        }
      }, Errors.ERROR_VALIDATION));
    }
    let profileData = null;
    try {
      profileData = await Facebook.profile(accessToken);
    } catch (e) {
      return res.json(400, Errors.build(e, Errors.ERROR_VALIDATION));
    }

    email = profileData.email || email;

    let user = await User.updateOrCreate({email: email}, {
      email: email,
      avatar: profileData.picture.data.url,
      username: slug(profileData.name),
      password: response.access_token.slice(3, 16)
    });

    await SocialNetwork.updateOrCreate({socialId: profileData.id, user: user.id}, {
      socialId: profileData.id,
      user: user.id,
      socialData: profileData,
      type: "facebook",
      token: response.access_token
    });

    user = await User.findOne({email: email, isActive: true}).populate("roles");

    let updatedUser, token;
    [updatedUser, token] = await Token.generate(user, req);

    return res.json({
      user: updatedUser,
      token: token
    });

  },

  facebookAuth: async (req, res) => {
    /***
     * code - facebook code for request a access_token
     * email - set custom email if facebook don't provide it
     * redirectUri - same as in authUrl
     * return user info and token
     */
    let code = req.param("code");
    let redirectUri = req.param("redirectUri");
    let email = req.param("email");


    if (!redirectUri) {
      return res.json(400, Errors.build({
        "redirectUri": {
          "rule": "required",
          "message": "\"required\" validation rule failed for input: null\nSpecifically, it threw an error.  Details:\n undefined"
        }
      }, Errors.ERROR_VALIDATION));
    }

    let response = null;

    try {
      response = await Facebook.confirm(code, redirectUri);
    } catch (e) {
      return res.json(400, Errors.build(e, Errors.ERROR_VALIDATION));
    }
    let profileData;
    try {
      profileData = await Facebook.profile(response.access_token);
    } catch (e) {
      return res.json(400, Errors.build(e, Errors.ERROR_VALIDATION));
    }
    email = profileData.email || email;

    let existsUser = await User.findOne({email: email});

    let userData = {
      email: email,
      avatar: profileData.picture.data.url,
      firstName: profileData.first_name,
      lastName: profileData.last_name
    };

    if (!existsUser) {
      userData.username = profileData.id;
      userData.password = response.access_token.slice(3, 16);
    }

    let user = await User.updateOrCreate({email: email}, userData);

    try {
      await SocialNetwork.updateOrCreate({socialId: profileData.id, user: user.id}, {
        socialId: profileData.id,
        user: user.id,
        socialData: profileData,
        type: "facebook",
        token: response.access_token
      });
    } catch (e) {
      return res.json(400, Errors.build({"message": "This social network connected to other account."}, Errors.ERROR_VALIDATION))
    }

    let updatedUser, token;
    [updatedUser, token] = await Token.generate(user, req);

    return res.json({
      user: updatedUser,
      token: token
    });
  }

};


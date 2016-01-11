The OpenUI5 OData model has a lot of nice features that are not available for use with a standard REST server.

Standard REST servers do not expoe metadata.
Therefor, OPENUI5 users have to stick with the JSON model for plain REST.

But the JSON model is a pure client side model, lacking many features.

Presented here is a (hack) of the OData model, that should work with normal REST servers.
Some hacks are ugly, some hacks are nice.

I have choosen to inherit from the OData model, and not to write a new REST model from scratch.
This way, the users will benefit from the OData features and future updates of this model.

The model itself is located inside localService.

A demo is included that will show Github users with their repos !!
The demo should run out-of-the-box.
But remember, Gihub has a rate-limit of 60 requests per hours ...

Enjoy ... feedback welcome.



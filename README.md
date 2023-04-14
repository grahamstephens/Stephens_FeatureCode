# Stephens_FeatureCode

This is the feature code for my feature - backend overhaul, improved functionality, and an improved authentication system. I tried to focus on just the files related to the feature, but the back-end code is very interconnected. Hence, one file often requires another to be legible, and my work was scattered across multiple files. My value judgement effectively boils down to relevance, and I purposefully excluded some code that I made that wasn't directly related to the feature, or whose purpose is easy to ascertain from its function call.

## Auth Stuff

This code can primarily be found in the src/controller files. The schema for the user model used in the database can be found in the src/models.

This part was subject to a code review that required an extensive overhaul of the auth system on my part. This is due to the changes found in src/controllers/user.service. I opted for different approaches to storing the user schema in the database. First by appending a random integer to the user's email, then by hashing the user's email. The latter change is preserved, for form's sake and for the fact that potentially storing someone's uky.edu email in unhashed form in a third-party database seems like poor practice.
The code review was related to the lack of authentication that this actually provided. This led to the src/controllers/auth.controller that you see now with the login and signup endpoints. Now, hashing is used to generate a secret token for the user upon login. I could not think of a way to make hashing user data in the database extremely relevant to security and authentication, so I went with this instead.

## Socket Server

This is found in src/ServerApplication. The socket server was not my contribution, that lied under Samyak and anonymous chat. I included it here for the queuing system. It is bare bones and tangential to my main epic, but I included it here since it was a feature that I discussed in the presentation. Currently, it simply adds the first available listener/venter. Which will probably be sufficient for real life purposes. There is a back-end prototype for dynamic queuing, but I didn't include it here since it's functionality hadn't been properly coordinated with the front-end team and data field delivery from their end. Even though this repo is in a vacuum and unrelated to the front-end code, I didn't want to include a feature that hadn't been properly stress-tested and coordinated with the other repos.

## Tests

These are also present in the tests submission, but I also included them here for context.

-- Graham

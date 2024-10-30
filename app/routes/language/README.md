# Purpose

The purpose of this route is to enable users to select a language preference for the app.

## Description

This route will accomplish this by presenting the user with a form that allows them to select between the following languages:

- English
- Spanish

When the user submits the form, the route will redirect to the `/onboarding' route.

## Auth Handling

The route will check the user's authentication state.

- If the user is not authenticated, they will be redirected to the `/sign-in` or `/sign-up` route.
- If the user is authenticated they will remain on the `/language` route.
- If the user is registered they will remain on the `/language` route.

## Data Fetching

The route will attempt to fetch the user's language preference from the database. If the user has not set their language preference, the route will default to English.

## Data Mutations

The route will attempt to update the user's language preference on the user's profile in the database tied to their userId. If the user does not have a profile document in the database, the route will create one.

If the user does have a profile in the database, the route will update the user's language preference. If the user is registered the route will have a button to redirect to home reserved route homepage. If the user is not registered the route will have a button to redirect to the onboarding route.

## Form Handling

The route will handle the form submission by calling the `updateLanguage` mutation. The mutation will update the user's language preference in the database tied to their userId.

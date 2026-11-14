@p0 @guest @bootstrap @ios
Feature: Cold start as guest
  The app is guest-first. A fresh install must reach Main without forcing Auth.

  Background:
    Given the production or TestFlight build is installed
    And no auth token is stored on the device

  Scenario: Guest lands on Main after splash
    Given a fresh install with no stored session
    When the app finishes SplashScreen
    Then I see the Main tabs "Practice", "Learn", "Exam", "Progress", and "Settings"
    And I am not forced into the Auth modal

  Scenario: Guest can open every tab without signing in
    Given I am on Main as a guest
    When I open each tab "Practice", "Learn", "Exam", "Progress", and "Settings"
    Then each tab renders without crashing
    And Progress shows a sign-in call to action
    And Settings shows a guest / not-signed-in profile state

  Scenario: Splash does not block Main indefinitely
    Given a fresh install with no stored session
    When SplashScreen has been visible for at least 5 seconds and loadUser completes
    Then Main is visible
    And SplashScreen is no longer the active route

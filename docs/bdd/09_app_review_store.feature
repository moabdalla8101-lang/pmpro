@p0 @app-review @ios @store
Feature: App Store Review readiness
  Scenarios Apple reviewers commonly exercise: guest use, account deletion, IAP, legal URLs.

  Background:
    Given the production TestFlight or App Store binary
    And the production API is reachable
    And Privacy Policy and Terms URLs are live on https://www.pmproapp.com

  Scenario: Reviewer can browse as guest without account
    Given a fresh install
    When Splash completes
    Then Main is usable as a guest
    And Practice, Learn, and Exam tabs are reachable without forced registration

  Scenario: Account creation and deletion (Guideline 5.1.1)
    Given I am a guest
    When I register a new account
    And I open Settings
    And I delete the account with confirmation
    Then the account is removed or the session is cleared
    And copy notes that App Store billing is managed separately by Apple

  Scenario: Subscription purchase disclosure
    Given I am a Registered Free user on Paywall
    When I view plan cards
    Then prices and periods are clear
    And trial disclosure is visible where trials apply (e.g. 3-day free trial on monthly / longer plans)
    And Privacy, Terms, and Apple EULA links are present before purchase

  Scenario: Restore purchases available
    Given I am on Paywall
    Then a Restore Purchases control is visible and tappable

  Scenario: Support and privacy metadata URLs
    Given I am in Settings
    When I open Privacy Policy, Terms of Use, Support, and Apple EULA
    Then each URL opens successfully
    # privacy → https://www.pmproapp.com/privacy
    # terms → https://www.pmproapp.com/terms
    # support → https://www.pmproapp.com/support
    # EULA → Apple standard EULA

  Scenario: Premium gates do not soft-lock the app
    Given I am a Registered Free user
    When I tap Mock Exam, Bookmarks, Missed Questions, Domain practice, and Progress upgrade
    Then each path shows Auth or Paywall as appropriate
    And I can dismiss and continue using free features

  Scenario: Sign-in required features explain why
    Given I am a guest
    When Auth opens from Progress, Exams, Bookmarks, or practice results
    Then reason-specific copy explains why sign-in is needed
    And "Continue browsing as guest" remains available when dismiss is allowed

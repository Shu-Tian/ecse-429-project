Feature: Create new Todo
    As a user, I want to create a new todo

Background:
    Given the server is running
    And the database contains the default todo objects

Scenario Outline: Create a new todo with specified title (Normal Flow)
    When a new todo is created with title <title>
    Then status code 201 will be received
    And a new todo exists in the database with title <title>

    Examples:
        | title             |
        | "print paperwork" |
        | "sign contract"   |

Scenario Outline: Create a new todo with specified title and description (Alternative Flow)
    When a new todo is created with title <title> and <description>
    Then status code 201 will be received
    And a new todo exists in the database with title <title> and <description>

    Examples:
        | title             | description                  |
        | "print paperwork" | "print 3 copies"             |
        | "sign contract"   | "requires manager signature" |

Scenario Outline: Create a new todo with empty title (Error Flow)
    When a new todo is created with title <emptytitle>
    Then status code 400 will be received
    And the user is informed of the operation failure with message <errorMsg>

    Examples:
        | emptytitle    | errorMsg                                      |
        | ""            | "Failed Validation: title : can not be empty" |
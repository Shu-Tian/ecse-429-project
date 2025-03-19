Feature: View categories related to a todo task
    As a user, I want to view the category a todo belongs to

Background:
    Given the server is running
    And the database contains the default todo objects

Scenario Outline: View categories related to a todo (Normal Flow)
    Given todo with id <todoId> is part of category with id <cid>
    When user queries category of a todo with id <todoId>
    Then status code 200 will be received
    And the related category with id <cid> is shown

    Examples:
        | todoId | cid |
        | 1      | "1" |

Scenario Outline: View categories related to a todo that is not part of any categories (Alternate Flow)
    Given todo with id <todoId> is not part of any categories
    When user queries category of a todo with id <todoId>
    Then status code 200 will be received
    And no category is shown

    Examples:
        | todoId |
        | 2      |

Scenario Outline: View categories related to an inexistant todo (Error Flow)
    When user queries category of a todo with inexistant id <badId>
    Then status code 404 will be received

    Examples:
        | badId |
        | 99    |
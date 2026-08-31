sequenceDiagram
participant browser
participant server

    Note right of browser: User types a new note and clicks Save

    Note right of browser: JavaScript prevents the default form submission

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server saves the new note
    server-->>browser: HTTP 201 Created
    deactivate server

    Note right of browser: JavaScript updates the page without reloading it
    Note right of browser: The new note is added to the DOM

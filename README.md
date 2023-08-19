~ This project is a simple chat messaging interface currently being hosted on vercel

~ to run the application,
simply go to the following url: https://chat-app-azure-pi.vercel.app

~ next, a user should enter their name and message, then either click the send 
button, or press the enter key while the input message box is still selected, in order to publish their message (a selected text box will be denoted by a blue border)

~ users have the ability to reply to existing messages in the chat by selecting the message they want to reply to (blue border will depict a selected message), and then sending their desired message

~ this will then spawn a threaded view of the messages as the latest content in the 
chat log

~ the user message will display their name, message content, and timestamp

~ to deselect a message from the chat log that is currently in the selected state, either click the message again or click another message in the log

Assumptions

    ~ users will be utilizing the app on a desktop
    ~ users will enter text in both the name input field and the message input field before pressing send / enter, otherwise the message will not publish

Rationale

    ~ React was chosen due to its fast performance, seamless configuration, and effective management of components and effects through the use of hooks 

Unimplemented Features

    ~ user authentication for secure access to the chat interface
    ~ message search functionality to find specific messages in the log
    ~ enabling users to edit or delete their sent messages
    ~ optimization for mobile
    

(function(window){
  'use strict';

  var recognition;
  var commandsList = [];
  var SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition;

  if(!SpeechRecognition) {
    throw('SpeechRecognition is not available');
  }

  initCommandsList();

  recognition = new SpeechRecognition();
  //#TODO support multiple languages
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.start();

  recognition.onresult = function (event) {
    var SpeechRecognitionResult = event.results[event.resultIndex];

    var results = "";
    for (var k = 0; k<SpeechRecognitionResult.length; k++) {
      results += SpeechRecognitionResult[k].transcript;
    }

    processResult(results.trim());
  }

  recognition.onerror = function(event){
    switch (event.error) {
      case 'network':
        throw('Networks troubles');
        break;
      case 'not-allowed':
        throw('Permission denied');
      case 'service-not-allowed':
        throw('Permission denied');
    }
  }

  function commandToRegExp(command) {
    var splatParam = /\*\w+/g;
    command = command.replace(splatParam, '(.*?)');
    return new RegExp('^' + command + '$', 'i');
  };

  function initCommandsList(){
    var commands = {
      "go to *link": function(destinationLink){
        var links = Array.prototype.slice.call(document.getElementsByTagName('a'));
        links.forEach(function(link){
          if(link.text.toLowerCase() === destinationLink.toLowerCase()){
            link.click();
          }
        });
      },

      "click *buttonText": function(buttonText){
        var buttons = Array.prototype.slice.call(document.getElementsByTagName('button'));
        buttons.forEach(function(button){
          if(button.textContent.toLowerCase() === buttonText.toLowerCase()){
            button.click();
          }
        });
      }
    }

    for(var command in commands){
      commandsList.push({regex: commandToRegExp(command), callback: commands[command], origianlCommand: command});
    }
  }

  function processResult(result){
    for(var i = 0; i<commandsList.length; i++){
      var command = commandsList[i];
      var matchCommand = command.regex.exec(result)
      if(matchCommand){
        command.callback(matchCommand[1]);
      }
    };
  }
})(window);

var dialog;
var blackbg;
var button;
var input;
var dialogStatus;
var dialogHeader;
var dialogBody;
var dialogFooter;
var dialog_visible = false;

function createDialog() {
  dialog = createDiv('');

  dialogHeader = createDiv('');
  dialogStatus = createDiv('');
  dialogBody = createDiv('');
  dialogTeamStatus = createDiv('');
  input = createInput();
  dialogFooter = createDiv('');
  button = createButton('');

  dialog.child(dialogHeader);
  dialog.child(dialogStatus);
  dialog.child(dialogBody);
  dialog.child(dialogTeamStatus);
  dialog.child(dialogFooter);

  dialogBody.child(input);
  dialogFooter.child(button);

  dialog.size(300);
  dialog.position(width/2 - 150, height/2 - 150);

  setStyles();
}

function showDialog() {
  if (!dialog_visible) {
    dialog.style('display', 'block');
    button.mouseOver(function(){
      button.style('background-color', '#1f1f1f');
    });
    button.mouseOut(function(){
      button.style('background-color', '#000000');
    });
    button.mousePressed(function(){
      name = input.value();
      name = name.trim();
      name = name.replace(/\s/g,'');
      if(name.length === 0){
        name = floor(random(0, 100)) + "";
      }else if (name.length > 6) {
        name = name.substr(0, 6);
      }
      startGame();
    });
    dialog_visible = true;
  }
}

function hideDialog(){
  if (dialog_visible) {
    dialog.style('display', 'none');
    dialog_visible = false;
  }
}

function setStyles() {
  dialog.style('display', 'none');
  dialog.style('z-index', '9999');
  dialog.style('border-radius', '10px');
  dialog.style('background-color', 'rgba(255, 255, 255, 0.5)');

  dialogHeader.style('color', 'white');
  dialogHeader.style('text-align', 'center');
  dialogHeader.style('font-size', '20px');
  dialogHeader.style('padding', '10px');
  dialogHeader.style('margin', '10px 10px 0 10px');
  dialogHeader.style('font-family', 'Courier New');

  dialogStatus.style('color', 'white');
  dialogStatus.style('text-align', 'center');
  dialogStatus.style('font-size', '15px');
  dialogStatus.style('padding', '10px');
  dialogStatus.style('margin', '10px 10px 0 10px');

  dialogTeamStatus.style('color', 'white');
  dialogTeamStatus.style('text-align', 'center');
  dialogTeamStatus.style('font-size', '15px');
  dialogTeamStatus.style('padding', '10px');
  dialogTeamStatus.style('margin', '10px 10px 0 10px');

  dialogBody.style('color', 'black');
  dialogBody.style('font-size', '14px');
  dialogBody.style('padding', '10px');
  dialogBody.style('margin', '0 10px 0 10px');

  dialogFooter.style('text-align', 'right');
  dialogFooter.style('padding', '10px');
  dialogFooter.style('margin', '0 10px 10px 10px');

  button.style('background-color', '#000000');
  button.style('color', 'white');
  button.style('width', '100%');
  button.style('border-radius', '5px');
  button.style('height', '40px');
  button.style('padding', '5px');
  button.style('border', '0');

  input.style('width', '100%');
  input.style('height', '40px');
  input.style('font-size', '20px');
  input.style('box-sizing', 'border-box');
  input.style('-webkit-box-sizing', 'border-box');
  input.style('-moz-box-sizing', 'border-box');
  input.style('border', '1px solid #C2C2C2');
  input.style('border-radius', '3px');
  input.style('-webkit-border-radius', '3px');
  input.style('-moz-border-radius', '3px');
  input.style('padding', '7px');
  input.style('outline', 'none');
}

function setHeaderText(text) {
  dialogHeader.html(text);
}

function setHeaderTextSize(size) {
  dialogHeader.style('font-size', size);
}

function setStatusText(text) {
  dialogStatus.html(text);
}

function setButtonText(text) {
  button.html(text);
}

function setButtonDisabled(value) {
  button.attribute('disabled', value);
}

function setTeamStatusText(text) {
  dialogTeamStatus.html(text);
}

function remakeDialog() {
  dialog.position(width/2 - 150, height/2 - 150);
}

function buttonDisabled() {
  return button.attribute('disabled');
}

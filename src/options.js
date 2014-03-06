function save_options() {
    var windows = [];
    var sites = document.getElementsByTagName('input');
    for (var i=0; i<sites.length; i++) {
        windows.push(sites[i].value);
    }
    localStorage.windows = JSON.stringify(windows);

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "URLs Saved";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

function restore_options() {
    if (typeof(localStorage.windows) === 'undefined') {
        return;
    }
    var windows = JSON.parse(localStorage.windows);
    for (var i=0; i<windows.length; i++) {
        addField(windows[i]);
    }
}

function addField(value) {
    var fields = document.getElementById("fields");
    var container = document.createElement("div");
    var input = document.createElement("input");
    var button = document.createElement("button");
    input.type = "text";
    input.value = value;
    container.appendChild(input);
    button.innerHTML = "Remove";
    container.appendChild(button);
    button.addEventListener('click', function(){removeField(button)});
    fields.appendChild(container); 
}

function removeField(btn) {
    var container = btn.parentNode;
    container.parentNode.removeChild(container);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#add').addEventListener('click', function(){addField("")});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.onload = function() {
    document.getElementById("feed").value = getUrlParameter("feed");
    document.getElementById("password").value = getUrlParameter("password");

    let locationButton = document.getElementById("detectLocation");
    locationButton.onclick = function(event){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                let value = `${position.coords.longitude}° N, ${position.coords.latitude}° E`;
                document.getElementById("location").value = value;
            });
        }
        event.preventDefault();
    };

    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('time').value = now.toISOString().slice(0, 16);

    let options = document.getElementsByClassName("sightingTypeOption");
    for(let i=0; i<options.length; ++i)
    {
        let option = options[i];
        let input = option.children[0];
        input.onchange = function(element){
            let existing = document.getElementsByClassName("inputCount");
            for(let j=0; j<existing.length; ++j)
            {
                existing[j].remove();
            }

            let inputCount = document.createElement("DIV");
            inputCount.className = "inputCount";
            inputCount.innerHTML = "<input id='count' name='count' type='number' placeholder='How many? (Optional)' />"
            option.parentNode.insertBefore(inputCount, option.nextSibling);
        };
    }

    let package = document.getElementById("package");
    package.onclick = function(event){
        let location = document.getElementById("location").value;
        let now = new Date();
        let time = new Date(document.getElementById("time").value);
        time.setMinutes(time.getMinutes() + now.getTimezoneOffset());
        var selected = document.querySelector('input[name="sightingType"]:checked').id;
        let sightingType = document.getElementById(selected).value;
        let count = document.getElementById("count").value;
        let description = document.getElementById("description");

        document.getElementById("info").value = JSON.stringify({
            "location": JSON.stringify(location),
            "time": time.toISOString(),
            "sightingType": sightingType,
            "count": count,
            "description": JSON.stringify(description)
        });
    }
}
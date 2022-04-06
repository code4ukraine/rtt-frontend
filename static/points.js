const TIME_COLORS = [
    "#FEC876",
    "#FCB25D",
    "#FB9B4A",
    "#FA833A",
    "#F9682E",
    "#F84C27",
    "#FB461E"
]

const TIME_TEXT = [
    "7 days ago",
    "6 days ago",
    "5 days ago",
    "4 days ago",
    "3 days ago",
    "2 days ago",
    "1 day ago"
]


const sighting_template = (id, title, days, location, lat, lon, notes) => `
<div id="sighting${id}" class="sighting">
<table>
<tr>
    <td class="id">${id}</td>
    <td class="title">${title}</td>
</tr>
<tr>
    <td class="label">Time</td>
    <td class="value">
        <span class="dot days-${7 - days}"></span>
        ${TIME_TEXT[days]}
    </td>
</tr>
<tr>
    <td class="label">Location</td>
    <td class="value">
        ${location} <br>
        ${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E</td>
    </td>
</tr>
<tr>
    <td class="label">Notes</td>
    <td class="value">${notes}</td>
</tr>
<tr>
    <td class="button" colspan="2"><a href="#">Back to top</a></td>
</tr>
</table>
</div>
`


function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                inp.dispatchEvent(new Event("input"));
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });

    inp.addEventListener("click", function(e) {
        closeAllLists();
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            b = document.createElement("DIV");
            b.innerHTML = arr[i];
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                inp.dispatchEvent(new Event("input"));
                closeAllLists();
            });
            a.appendChild(b);
        }        
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) { //enter
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }


let newXHR = null;   
function sendXHR(type, url, data, callback) {
  newXHR = new XMLHttpRequest() || new window.ActiveXObject("Microsoft.XMLHTTP");
  newXHR.open(type, url, true);
  newXHR.send(data);
  newXHR.onreadystatechange = function() {
    if (this.status === 200 && this.readyState === 4) {
      callback(this.response);
    }
  };
}

let canvas = null;
let dataFilter = "";
let data = []
let hitboxes = [];
let lastWidth = 0;

const PIN_WIDTH = 24;
const PIN_HEIGHT = 32;
const MAP_WIDTH = 960;
const MAP_HEIGHT = 550;

const ROMANIA = {
    "left": 17.557,
    "top": 43.468,
    "right": 28.103,
    "bottom": 47.694
};

const UKRAINE = {
    "left": 20.73,
    "top": 41.92,
    "right": 41.92,
    "bottom": 53.03
};

function drawPin(ctx, bounds)
{
    let color = TIME_COLORS[bounds.days];
    ctx.save();
    ctx.translate(bounds.left, bounds.top);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    ctx.beginPath();
    ctx.moveTo(17.9159,20.0632);
    ctx.bezierCurveTo(20.3926,18.243,22,15.3092,22,12);
    ctx.bezierCurveTo(22,6.47715,17.5228,2,12,2);
    ctx.bezierCurveTo(6.47715,2,2,6.47715,2,12);
    ctx.bezierCurveTo(2,15.3092,3.60742,18.243,6.08406,20.0632);
    ctx.bezierCurveTo(7.96608,21.4813,10.619,23.7185,11.2288,27.3195);
    ctx.bezierCurveTo(11.2934,27.701,11.6131,27.997,12,27.997);
    ctx.bezierCurveTo(12.3869,27.997,12.7066,27.701,12.7712,27.3195);
    ctx.bezierCurveTo(13.381,23.7185,16.0339,21.4813,17.9159,20.0632);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    let font_family = "Neue Montreal,arial,sans-serif";
    let font_size = 8;
    if(bounds.id > 99){
        font_size = 6;
    }

    id = bounds.id.toString();
    let width = ctx.measureText(id).width;
    x = (PIN_WIDTH - width) * 0.5;
    y = (PIN_WIDTH + font_size) * 0.5;
    ctx.font = `bold ${font_size} ${font_family}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(id, x, y);
    ctx.restore();
}

function drawCurrentLocation(ctx, x, y)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#6393F2";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.globalAlpha = 1.0;
    ctx.fill();    

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.restore();
}


function unionOf(rect0, rect1)
{
    return {
        "left": Math.min(rect0.left, rect1.left),
        "right": Math.max(rect0.right, rect1.right),
        "top": Math.min(rect0.top, rect1.top),
        "bottom": Math.max(rect0.bottom, rect1.bottom),
        "count": rect0.count + rect1.count
    };
}


function pinRect(point)
{
    return {
        "left": point.x - 0.5 * PIN_WIDTH,
        "right": point.x + 0.5 * PIN_WIDTH,
        "top": point.y - PIN_HEIGHT,
        "bottom": point.y,
        "count": 1,
        "days": point.days,
        "id": point.id,
        "href": "#sighting" + point.id
    };
}


function intersects(rect0, rect1)
{
    return !(rect0.right <= rect1.left ||
             rect0.left >= rect1.right ||
             rect0.bottom <= rect1.top ||
             rect0.top >= rect1.bottom);
}


function drawCluster(ctx, cluster)
{
    let x = 0.5 * (cluster.left + cluster.right);
    let y = 0.5 * (cluster.top + cluster.bottom);

    ctx.save();
    ctx.translate(x, y);
    
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#0944F7";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.globalAlpha = 1.0;
    ctx.fill();

    let font_family = "Neue Montreal,arial,sans-serif";
    let font_size = 8;
    if(cluster.count > 99){
        font_size = 6;
    }

    count = cluster.count.toString();
    let width = ctx.measureText(count).width;
    x = - width * 0.5;
    y = font_size * 0.5;
    ctx.font = `bold ${font_size} ${font_family}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(count, x, y);
    ctx.restore();
}

function getSelectedMap(callback)
{
    let select = document.getElementById("map");
    let imageWidth = 960;
    if(select.clientWidth <= 480)
    {
        imageWidth = 480;
    }
    let opt = select.options[select.selectedIndex];
    let name = opt.value;
    let bounds = opt.getAttribute("data-bounds");
    let parts = bounds.split(',');
    let info = {
        "left": parseFloat(parts[0]),
        "top": parseFloat(parts[1]),
        "right": parseFloat(parts[2]),
        "bottom": parseFloat(parts[3]),
        "name": opt.innerHTML
    }
    if(name === "tile"){
        let size = opt.getAttribute("data-size");
        parts = size.split(',');
        let cellWidth = parseFloat(parts[0]);
        let cellHeight = parseFloat(parts[1]);
        let grid = opt.getAttribute("data-grid");
        parts = grid.split(',');        
        let rows = parseFloat(parts[0]);
        let columns = parseFloat(parts[1]);
        let dx = (info.right - info.left) / (columns - 1);
        let dy = (info.bottom - info.top) / (rows - 1);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                info.lng = position.coords.longitude;
                info.lat = position.coords.latitude;
                if(!contains(UKRAINE, info.lng, info.lat) ||
                    contains(ROMANIA, info.lng, info.lat))
                {
                    info.left = info.lng - 0.5 * cellWidth;
                    info.right = info.left + cellWidth;
                    info.top = info.lat - 0.5 * cellHeight;
                    info.bottom = info.top + cellHeight;
                    info.x = (info.lng - info.left) / (info.right - info.left);
                    info.y = (info.lat - info.bottom) / (info.top - info.bottom);
                    info.image = `images/${imageWidth}/tiles/outside.jpg`;
                    callback(info);
                }
                else
                {
                    let col = Math.round(((info.lng - info.left) / dx));
                    let row = Math.round(((info.lat - info.top) / dy));
                    row = Math.max(0, Math.min(row, rows - 1));
                    col = Math.max(0, Math.min(col, columns - 1));
                    info.left = info.left + col * dx - 0.5 * cellWidth;
                    info.right = info.left + cellWidth;
                    info.top = info.top + row * dy - 0.5 * cellHeight;
                    info.bottom = info.top + cellHeight;
                    info.x = (info.lng - info.left) / (info.right - info.left);
                    info.y = (info.lat - info.bottom) / (info.top - info.bottom);
                    info.image = `images/${imageWidth}/tiles/tile_${row}_${col}.jpg`;
                    callback(info);
                }
            });
        }else{
            info.image = `images/${imageWidth}/tiles/outside.jpg`;
            callback(info);
        }
    }else{
        info.image = `images/${imageWidth}/${name}_${bounds}.jpg`;
        callback(info);
    }
}


const MSEC_PER_DAY = 24 * 3600 * 1000;


function getNumDays(timestamp)
{
    let now = new Date();
    timestamp = timestamp.replace(/ /g,"T");
    let then = Date.parse(timestamp);
    let elapsed = now - then;
    let days = Math.round(elapsed / MSEC_PER_DAY);
    days = Math.max(7 - days, 0);
    return days;
}


function drawMap(image, map)
{
    hitboxes = [];
    let canvas = document.getElementById("mapCanvas");    
    let ctx = canvas.getContext("2d");
    let xScale = canvas.width / (map.right - map.left);
    // we are reversing the denominator because we want -scale
    let yScale = canvas.height / (map.top - map.bottom);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if("x" in map)
    {
        drawCurrentLocation(ctx, map.x * canvas.width, map.y * canvas.height);
    }

    let newSightings = [];
    let id = 0;
    let clusters = [];
    for(let i=0; i<data.length; ++i)
    {
        let sighting = data[i];

        if(!contains(map, sighting.lng, sighting.lat))
        {
            continue;
        }

        if(dataFilter.length > 0)
        {
            let desc_lc = sighting.description.toLowerCase();
            if(desc_lc.indexOf(dataFilter) == -1)
            {
                continue;
            }
        }

        id += 1;
        let div = document.createElement("div");
        let length = Math.round(canvas.width / 10) - 7;
        let title = sighting.description.substring(0, length) + "...";
        let days = getNumDays(sighting.timestamp);
        div.innerHTML = sighting_template(id,
                                          title,
                                          days,
                                          sighting.region,
                                          sighting.lat, sighting.lng,
                                          sighting.description);
        newSightings.push(div);

        let x = (sighting.lng - map.left) * xScale;
        let y = (sighting.lat - map.bottom) * yScale;
        let bounds = pinRect({"id": id, "days": days, "x": x, "y": y});
        let inCluster = false;
        for(let j=0; j<clusters.length; ++j)
        {
            if(intersects(bounds, clusters[j]))
            {
                clusters[j] = unionOf(clusters[j], bounds);
                inCluster = true;
                break;
            }
        }

        if(!inCluster)
        {
            clusters.push(bounds);
        }
    }


    for(let i=0; i<clusters.length; ++i)
    {
        if(clusters[i].count == 1)
        {
            drawPin(ctx, clusters[i]);
            hitboxes.push(clusters[i]);
        }
        else
        {
            drawCluster(ctx, clusters[i]);
        }
    }

    let sightings = document.getElementById("sightings");
    sightings.replaceChildren(...newSightings);
}


function contains(rect, x, y)
{
    return !(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
}


function updateSelectedMap()
{
    getSelectedMap(function(map){
        document.getElementById("selection").innerHTML = map.name;
        let img = document.createElement("img");
        img.onload = function(){
            drawMap(img, map);
        }
        img.src = map.image;
    });
}

window.onload = function() {
    let map = document.getElementById("map");
    let canvas = document.getElementById("mapCanvas");
    let width = map.clientWidth;
    lastWidth = width;
    canvas.width = width;
    canvas.height = Math.round(width * MAP_HEIGHT / MAP_WIDTH);

    window.onresize = function(){
        width = map.clientWidth;
        if(width != lastWidth && width < MAP_WIDTH)
        {
            canvas.width = width;
            canvas.height = Math.round(width * MAP_HEIGHT / MAP_WIDTH);    
            updateSelectedMap();
        }

        lastWidth = width;
    }

    canvas.onmousedown = function(event) {
        for(let i=0; i<hitboxes.length; ++i)
        {
            if(contains(hitboxes[i], event.offsetX, event.offsetY))
            {
                window.location.href = hitboxes[i].href;
                break;
            }
        }
    }

    let select = document.getElementById("map");
    select.onchange = function(){
        updateSelectedMap();
    }

    let eventFilter = document.getElementById("event");
    eventFilter.addEventListener("input", function(event){
        dataFilter = event.target.value.toLowerCase().trim();
        updateSelectedMap();
    });
    let options = eventFilter.getAttribute("data-options").split(',');
    autocomplete(eventFilter, options);

    sendXHR("GET", "data/data.json", null, function(response) {
        data = JSON.parse(response);
        updateSelectedMap();
    });
}
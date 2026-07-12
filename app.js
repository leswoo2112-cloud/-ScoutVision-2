let scoreA = 0;
let scoreB = 0;
let quarter = 1;

let players = [];
let selectedPlayer = null;

let shotMode = "make";
let shots = [];

const video = document.getElementById("video");

const playerBox = document.getElementById("players");
const timeline = document.getElementById("timeline");

let records = [];

function updateScore(){

document.getElementById("scoreA").innerText=scoreA;
document.getElementById("scoreB").innerText=scoreB;
document.getElementById("quarter").innerText=quarter+"Q";

}

function score(team,point){

if(team=="A"){

scoreA+=point;

if(scoreA<0)scoreA=0;

}else{

scoreB+=point;

if(scoreB<0)scoreB=0;

}

updateScore();

}

function nextQuarter(){

quarter++;

if(quarter>4){

quarter=1;

}

updateScore();

}

function back5(){

video.currentTime-=5;

}

function forward5(){

video.currentTime+=5;

}

function playPause(){

if(video.paused){

video.play();

}else{

video.pause();

}

}

function setSpeed(x){

video.playbackRate=x;

}

document
.getElementById("videoInput")
.addEventListener("change",function(e){

const file=e.target.files[0];

if(!file)return;

video.src=URL.createObjectURL(file);

});

function addPlayer(){

const input=document.getElementById("playerInput");

const team=document.getElementById("teamSelect").value;

const name=input.value.trim();

if(name=="")return;

players.push({

name:name,

team:team,

point:0,

reb:0,

ast:0,

stl:0,

blk:0,

to:0,

fgm:0,

fga:0

});

input.value="";

drawPlayers();

}
function drawPlayers(){

playerBox.innerHTML="";

players.forEach(function(p,index){

const btn=document.createElement("button");

btn.className="playerBtn";

if(selectedPlayer===index){

btn.classList.add("active");

}

btn.innerHTML=p.team+" | "+p.name;

btn.onclick=function(){

selectedPlayer=index;

drawPlayers();

};

playerBox.appendChild(btn);

});

}

function record(type){

if(selectedPlayer===null){

alert("선수를 먼저 선택하세요.");

return;

}

const p=players[selectedPlayer];

const time=Math.floor(video.currentTime);

switch(type){

case "2점 성공":

p.point+=2;

p.fgm++;

p.fga++;

if(p.team=="A")scoreA+=2;

else scoreB+=2;

break;

case "2점 실패":

p.fga++;

break;

case "3점 성공":

p.point+=3;

p.fgm++;

p.fga++;

if(p.team=="A")scoreA+=3;

else scoreB+=3;

break;

case "3점 실패":

p.fga++;

break;

case "자유투 성공":

p.point++;

if(p.team=="A")scoreA++;

else scoreB++;

break;

case "자유투 실패":

break;

case "리바운드":

p.reb++;

break;

case "어시스트":

p.ast++;

break;

case "스틸":

p.stl++;

break;

case "블록":

p.blk++;

break;

case "턴오버":

p.to++;

break;

}

updateScore();

records.push({

time:time,

player:p.name,

team:p.team,

action:type

});

drawTimeline();

drawStats();

drawMVP();

drawAI();

drawReport();

saveData();

}

function drawTimeline(){

timeline.innerHTML="";

records.forEach(function(r){

const div=document.createElement("div");

div.className="timelineItem";

div.innerHTML=

"⏱ "+r.time+"초 | "

+r.team+" | "

+r.player+" | "

+r.action;

timeline.appendChild(div);

});

}
function drawStats(){

const playerStats=document.getElementById("playerStats");
const teamStats=document.getElementById("teamStats");

playerStats.innerHTML="";
teamStats.innerHTML="";

let teamA={
point:0,
reb:0,
ast:0,
stl:0,
blk:0,
to:0
};

let teamB={
point:0,
reb:0,
ast:0,
stl:0,
blk:0,
to:0
};

players.forEach(function(p){

const fg=p.fga==0?0:
Math.round(p.fgm/p.fga*100);

const card=document.createElement("div");

card.className="statCard";

card.innerHTML=

"<b>"+p.name+"</b><br>"+

"팀 : "+p.team+"<br>"+

"득점 : "+p.point+"<br>"+

"리바운드 : "+p.reb+"<br>"+

"어시스트 : "+p.ast+"<br>"+

"스틸 : "+p.stl+"<br>"+

"블록 : "+p.blk+"<br>"+

"턴오버 : "+p.to+"<br>"+

"야투율 : "+fg+"%";

playerStats.appendChild(card);

if(p.team=="A"){

teamA.point+=p.point;
teamA.reb+=p.reb;
teamA.ast+=p.ast;
teamA.stl+=p.stl;
teamA.blk+=p.blk;
teamA.to+=p.to;

}else{

teamB.point+=p.point;
teamB.reb+=p.reb;
teamB.ast+=p.ast;
teamB.stl+=p.stl;
teamB.blk+=p.blk;
teamB.to+=p.to;

}

});

teamStats.innerHTML=

"<div class='statCard'>"+

"<h3>A팀</h3>"+

"득점 : "+teamA.point+"<br>"+

"리바운드 : "+teamA.reb+"<br>"+

"어시스트 : "+teamA.ast+"<br>"+

"스틸 : "+teamA.stl+"<br>"+

"블록 : "+teamA.blk+"<br>"+

"턴오버 : "+teamA.to+

"</div>"+

"<div class='statCard'>"+

"<h3>B팀</h3>"+

"득점 : "+teamB.point+"<br>"+

"리바운드 : "+teamB.reb+"<br>"+

"어시스트 : "+teamB.ast+"<br>"+

"스틸 : "+teamB.stl+"<br>"+

"블록 : "+teamB.blk+"<br>"+

"턴오버 : "+teamB.to+

"</div>";

}

function drawMVP(){

const box=document.getElementById("mvp");

if(players.length==0){

box.innerHTML="아직 기록 없음";

return;

}

let best=players[0];

let bestScore=-999;

players.forEach(function(p){

const score=

p.point+

p.reb*1.2+

p.ast*1.5+

p.stl*2+

p.blk*2-

p.to;

if(score>bestScore){

best=p;

bestScore=score;

}

});

box.innerHTML=

"🏆<br>"+

"<h2>"+best.name+"</h2>"+

"득점 "+best.point+"<br>"+

"리바운드 "+best.reb+"<br>"+

"어시스트 "+best.ast+"<br>"+

"MVP 점수 : "+bestScore.toFixed(1);

}
function drawAI(){

const ai=document.getElementById("ai");

if(players.length==0){

ai.innerHTML="기록이 없습니다.";

return;

}

let best=players[0];

players.forEach(function(p){

if(p.point>best.point){

best=p;

}

});

const fg=best.fga==0?0:
Math.round(best.fgm/best.fga*100);

let text="";

if(best.point>=15){

text+="🔥 "+best.name+" 선수의 득점력이 뛰어났습니다.<br>";

}

if(fg>=50){

text+="🎯 야투 성공률이 매우 좋았습니다.<br>";

}

if(best.ast>=5){

text+="🤝 팀플레이가 훌륭했습니다.<br>";

}

if(best.reb>=5){

text+="💪 리바운드 참여가 좋았습니다.<br>";

}

if(best.to>=3){

text+="⚠️ 턴오버를 줄이면 더 좋은 경기력이 기대됩니다.<br>";

}

if(text==""){

text="평균적인 경기였습니다.";

}

ai.innerHTML=text;

}



function drawReport(){

const report=document.getElementById("report");

if(players.length==0){

report.innerHTML="아직 경기 기록이 없습니다.";

return;

}

let totalPoint=0;

let totalReb=0;

let totalAst=0;

let totalStl=0;

let totalBlk=0;

let totalTo=0;

players.forEach(function(p){

totalPoint+=p.point;

totalReb+=p.reb;

totalAst+=p.ast;

totalStl+=p.stl;

totalBlk+=p.blk;

totalTo+=p.to;

});

report.innerHTML=

"<b>총 득점 :</b> "+totalPoint+"<br>"+

"<b>총 리바운드 :</b> "+totalReb+"<br>"+

"<b>총 어시스트 :</b> "+totalAst+"<br>"+

"<b>총 스틸 :</b> "+totalStl+"<br>"+

"<b>총 블록 :</b> "+totalBlk+"<br>"+

"<b>총 턴오버 :</b> "+totalTo+"<br><br>"+

"<b>최종 스코어</b><br>"+

document.getElementById("teamAName").value+

" "+scoreA+

" : "+

scoreB+

" "+

document.getElementById("teamBName").value;

}



function saveData(){

localStorage.setItem(

"ScoutVisionPlayers",

JSON.stringify(players)

);

localStorage.setItem(

"ScoutVisionRecords",

JSON.stringify(records)

);

localStorage.setItem(

"ScoutVisionScoreA",

scoreA

);

localStorage.setItem(

"ScoutVisionScoreB",

scoreB

);

localStorage.setItem(

"ScoutVisionQuarter",

quarter

);

}



function loadData(){

const p=

localStorage.getItem("ScoutVisionPlayers");

const r=

localStorage.getItem("ScoutVisionRecords");

if(p){

players=JSON.parse(p);

}

if(r){

records=JSON.parse(r);

}

scoreA=parseInt(

localStorage.getItem("ScoutVisionScoreA")||0

);

scoreB=parseInt(

localStorage.getItem("ScoutVisionScoreB")||0

);

quarter=parseInt(

localStorage.getItem("ScoutVisionQuarter")||1

);

drawPlayers();

drawTimeline();

drawStats();

drawMVP();

drawAI();

drawReport();

updateScore();

}
const canvas=document.getElementById("court");
const ctx=canvas.getContext("2d");

function setShotMode(mode){

shotMode=mode;

}

function clearShots(){

shots=[];

drawCourt();

saveData();

}

canvas.addEventListener("click",function(e){

const rect=canvas.getBoundingClientRect();

const scaleX=canvas.width/rect.width;

const scaleY=canvas.height/rect.height;

const x=(e.clientX-rect.left)*scaleX;

const y=(e.clientY-rect.top)*scaleY;

shots.push({

x:x,

y:y,

made:shotMode=="make"

});

drawCourt();

saveData();

});

function drawCourt(){

ctx.clearRect(0,0,350,500);

ctx.fillStyle="#d7a35d";

ctx.fillRect(0,0,350,500);

ctx.strokeStyle="white";

ctx.lineWidth=3;

ctx.strokeRect(5,5,340,490);

ctx.beginPath();

ctx.moveTo(145,25);

ctx.lineTo(205,25);

ctx.stroke();

ctx.beginPath();

ctx.arc(175,45,9,0,Math.PI*2);

ctx.stroke();

ctx.strokeRect(110,5,130,180);

ctx.beginPath();

ctx.arc(175,185,42,0,Math.PI*2);

ctx.stroke();

ctx.beginPath();

ctx.arc(175,45,145,Math.PI*0.15,Math.PI*0.85);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(30,5);

ctx.lineTo(30,175);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(320,5);

ctx.lineTo(320,175);

ctx.stroke();

shots.forEach(function(s){

ctx.beginPath();

ctx.fillStyle=s.made?"#00ff44":"#ff3030";

ctx.arc(

s.x,

s.y,

7,

0,

Math.PI*2

);

ctx.fill();

});

}

drawCourt();



function saveData(){

localStorage.setItem(

"ScoutVisionPlayers",

JSON.stringify(players)

);

localStorage.setItem(

"ScoutVisionRecords",

JSON.stringify(records)

);

localStorage.setItem(

"ScoutVisionShots",

JSON.stringify(shots)

);

localStorage.setItem(

"ScoutVisionScoreA",

scoreA

);

localStorage.setItem(

"ScoutVisionScoreB",

scoreB

);

localStorage.setItem(

"ScoutVisionQuarter",

quarter

);

}



function loadData(){

const p=localStorage.getItem("ScoutVisionPlayers");

const r=localStorage.getItem("ScoutVisionRecords");

const s=localStorage.getItem("ScoutVisionShots");

if(p)players=JSON.parse(p);

if(r)records=JSON.parse(r);

if(s)shots=JSON.parse(s);

scoreA=parseInt(

localStorage.getItem("ScoutVisionScoreA")||0

);

scoreB=parseInt(

localStorage.getItem("ScoutVisionScoreB")||0

);

quarter=parseInt(

localStorage.getItem("ScoutVisionQuarter")||1

);

updateScore();

drawPlayers();

drawTimeline();

drawStats();

drawMVP();

drawAI();

drawReport();

drawCourt();

}
const canvas=document.getElementById("court");
const ctx=canvas.getContext("2d");

function setShotMode(mode){

shotMode=mode;

}

function clearShots(){

shots=[];

drawCourt();

saveData();

}

canvas.addEventListener("click",function(e){

const rect=canvas.getBoundingClientRect();

const scaleX=canvas.width/rect.width;

const scaleY=canvas.height/rect.height;

const x=(e.clientX-rect.left)*scaleX;

const y=(e.clientY-rect.top)*scaleY;

shots.push({

x:x,

y:y,

made:shotMode=="make"

});

drawCourt();

saveData();

});

function drawCourt(){

ctx.clearRect(0,0,350,500);

ctx.fillStyle="#d7a35d";

ctx.fillRect(0,0,350,500);

ctx.strokeStyle="white";

ctx.lineWidth=3;

ctx.strokeRect(5,5,340,490);

ctx.beginPath();

ctx.moveTo(145,25);

ctx.lineTo(205,25);

ctx.stroke();

ctx.beginPath();

ctx.arc(175,45,9,0,Math.PI*2);

ctx.stroke();

ctx.strokeRect(110,5,130,180);

ctx.beginPath();

ctx.arc(175,185,42,0,Math.PI*2);

ctx.stroke();

ctx.beginPath();

ctx.arc(175,45,145,Math.PI*0.15,Math.PI*0.85);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(30,5);

ctx.lineTo(30,175);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(320,5);

ctx.lineTo(320,175);

ctx.stroke();

shots.forEach(function(s){

ctx.beginPath();

ctx.fillStyle=s.made?"#00ff44":"#ff3030";

ctx.arc(

s.x,

s.y,

7,

0,

Math.PI*2

);

ctx.fill();

});

}

drawCourt();



function saveData(){

localStorage.setItem(

"ScoutVisionPlayers",

JSON.stringify(players)

);

localStorage.setItem(

"ScoutVisionRecords",

JSON.stringify(records)

);

localStorage.setItem(

"ScoutVisionShots",

JSON.stringify(shots)

);

localStorage.setItem(

"ScoutVisionScoreA",

scoreA

);

localStorage.setItem(

"ScoutVisionScoreB",

scoreB

);

localStorage.setItem(

"ScoutVisionQuarter",

quarter

);

}



function loadData(){

const p=localStorage.getItem("ScoutVisionPlayers");

const r=localStorage.getItem("ScoutVisionRecords");

const s=localStorage.getItem("ScoutVisionShots");

if(p)players=JSON.parse(p);

if(r)records=JSON.parse(r);

if(s)shots=JSON.parse(s);

scoreA=parseInt(

localStorage.getItem("ScoutVisionScoreA")||0

);

scoreB=parseInt(

localStorage.getItem("ScoutVisionScoreB")||0

);

quarter=parseInt(

localStorage.getItem("ScoutVisionQuarter")||1

);

updateScore();

drawPlayers();

drawTimeline();

drawStats();

drawMVP();

drawAI();

drawReport();

drawCourt();

}